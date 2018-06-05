var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Set port to listen on
var PORT = process.env.PORT || 8080;
// Initialize Express
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Express-handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// static directory to have the ability to style the pages and host images.
app.use(express.static("public"));

// Connect to the Mongo DB

// Require our routes
require('./routes/routes.js')(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});