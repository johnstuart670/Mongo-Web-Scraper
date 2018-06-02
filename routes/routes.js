var cheerio = require("cheerio");
var db = require("../models/index.js");
var axios = require("axios");

module.exports = function (app) {

	// at the base menu
	app.get("/", function (req, res) {
		// we will go and get all the articles  in the database that haven't been saved
		db.Article.find({
			saved: false
		})
			// once we receive the response
			.then(function (result) {
				// make a json object with the results so we can use the Handlebars templates
				let hbsObj = {
					articles: result
				};
				// push it to the page
				res.render("homepage", hbsObj)
					// error handling
					.catch(function (err) {
						res.json(err);
					});
			})
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
	app.put("/save_article/:articleId", function(req, res){
		// find the article and update the "saved" key to truthy 
		db.Article.findByIdAndUpdate(
			{_id: req.params.articleID},
			{saved : true},
		)
		.then(function (postResults){
			res.send("Article Saved")
		})
		.catch(function (err) {
			res.json(err);
		})
		//end of the save post route
	})

}