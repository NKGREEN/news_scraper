var cheerio = require('cheerio');
var axios = require('axios');
var mongoose = require('mongoose');
var express = require('express');
var exphbs = require('express-handlebars');

var PORT = 3000;
var app = express();
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
  });
  


