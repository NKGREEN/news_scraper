var cheerio = require('cheerio');
var axios = require('axios');
var mongoose = require('mongoose');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
  });
  
app.get("/", function(req,res){
res.render("home")
})

//Load exclusives page of Comic Book Resources 
request('https://www.cbr.com/category/cbr-exclusives/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Routes

require("./routes/htmlRoutes.js")(app);
var routes = require("./routes/apiRoutes.js");
app.use(routes)

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});