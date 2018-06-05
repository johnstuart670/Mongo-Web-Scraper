var cheerio = require("cheerio");
var db = require("../models/schemaIndex.js");
var request = require("request");

module.exports = function (app) {

	// at the base menu
	app.get("/", function (req, res) {
		// we will go and get all the articles  in the database that haven't been saved
		db.Article.find({})
			// once we receive the response
			.then(function (result) {
				// make a json object with the results so we can use the Handlebars templates
				let hbsObj = {
					articles: result
				};
				// push it to the page
				res.render("homepage", hbsObj)
				// error handling
			}).catch(function (err) {
				res.json(err);
			});
		// end of the "/" route
	});

	app.get("/saved_articles", function (req, res) {
		// we will go and get all the articles  in the database that have been saved
		db.Article.find({
			saved: true
		})
			// once we receive the response
			.then(function (result) {
				// make a json object with the results so we can use the Handlebars templates
				let hbsObj = {
					articles: result
				};
				// push it to the page
				res.render("saved_articles", hbsObj)
					// error handling
				
			})
			.catch(function (err) {
				res.json(err);
			});
		// end of the "/" route
	});
	// post route that will allow for the user to post comments to a specific article
	app.post("/comment/:articleID", function (req, res) {
		// first create the comment using the mongoose model and taking in the json object that we will send with the post
		db.Comments.create(req.body)
			// wait for the comment to post
			.then(function (newComment) {
				// then find the article and update using the url parameters
				return db.Article.findByIdAndUpdate({
					_id: req.params.articleID
				}, {
						// use the cheerio stuff to push to the notes key paired item using the comment ID
						$push: {
							notes: newComment._id
						}
					},
					{
						// flag it as a new comment ????
						new: true
					});
			})
			.then(function (article) {
				res.send("Message Successfully Posted")
			})
			.catch(function (err) {
				res.json(err);
			});
		// end of the comment post route
	});

	// when they hit the save article route
	app.put("/save_article/:articleId", function (req, res) {
		// find the article and update the "saved" key to truthy 
		db.Article.findByIdAndUpdate(
			{ _id: req.params.articleID },
			{ saved: true },
		)
			.then(function (postResults) {
				res.send("Article Saved")
			})
			.catch(function (err) {
				res.json(err);
			})
		//end of the save post route
	});

	// allows a user to unsave an article
	app.put("/unsave_article/:articleId", function (req, res) {
		db.Article.findByIdAndUpdate(
			{ _id: req.params.articleID },
			{ saved: false },
		)
			.then(function (postResults) {
				res.send("Article Saved")
			})
			.catch(function (err) {
				res.json(err);
			})
		// end of put route for unsaving
	});

	// post route for more articles 
	app.get("/scrape_articles", function (req, res) {
		console.log("Hits the server")
		// get all the articles that we have already put into the database:
		db.Article.find({}, function (err, archive) {
			if (err){
				return console.log("Err: ", err);
			}
			// tap into the NYTimes information
			console.log("does the api search");

			request("https://www.nytimes.com", function (error, response, webScrape) {
				if (error){
					return console.log("error:", error);
				}
				console.log("gets down to the data");
				let $ = cheerio.load(webScrape);
				let counter = 0;
				$("article.story").has("h2").each(function (i, element) {

					let result = {};
					result.title = $(element).children("h2").children("a").text();
					result.link = $(element).children("h2").children("a").attr("href");
					result.summary = $(element).children("p.summary").text();
					let duplicate = false;

					for (let i = 0; i < archive.length; i++) {
						if (archive[i].title === result.title) {
							duplicate = true;
							console.log("1 article was added")
							break;
						}
					}

					// Create article only if not a duplicate and all three have values
					if (!duplicate && result.title && result.link && result.summary) {
						db.Article.create(result);
					}
					
				});
			});
		})
		.then(function(finalResults){
			console.log("hey so this worked")
			res.json({
				count: counter
			});
		});
		// end of the scrape_articles route
	});

};