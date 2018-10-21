var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("../models");
var express = require("express");
var router = express.Router();
var user = process.env.USER;
var password = process.env.PASSWORD;
var mlab = 'mongodb://' + user + ':' + password + '@dzpl66F3.mlab.com:l66F3/cbnews-scraper';
var databaseUrl = mlab;
// Connect to the Mongo DB
mongoose.connect(databaseUrl);

router.get("/api/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.cbr.com/category/cbr-exclusives/").then(function (response) {

        // load into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        var results = [];

        $(".teaser").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element


            var result = {
                title: $(this)
                    .children(".title")
                    .children('a')
                    .text(),
                link: $(this)
                    .children('.title')
                    .children("a")
                    .attr("href"),
                excerpt: $(this)
                    .children('.excerpt')
                    .text()
            };
            if (result.title != "" && result.link != "" && result.summaryexcerpt != "") {
                db.Article.create(result)
                    .then(function (dbArticle) {

                        // console.log(dbArticle);

                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);

                    });
            }
            if (result.title != "" && result.link != "" && result.summary != "") {


                results.push(result)
            }
        });

        res.json(results.length)
    })




});


// Route for getting all Articles from the db
router.get("/api/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.json(hbsObject);
    })
        .catch(function (err) {
            console.log(err)
        })
});

router.put("/articles/:id", function (req, res) {
    var info = req.body.saved
    console.log(req.params.id)
    console.log(info)
    db.Article.findOne({ _id: req.params.id })
        .update({ saved: info })
        .populate("comments")
        .then(function (dbArticle) {

            res.json(dbArticle);

        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).
        update({ saved: false })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});
router.delete('/articles', function (req, res) {
    db.Article.remove({ saved: false })
        .then(function (dbArticle) {
            if(dbArticle){
            res.json(dbArticle.n)
            }
        })

})

// Route for saving/updating an Article's associated Comments
router.post("/articles/:id", function (req, res) {
    console.log(req.body)
    db.Note.create(req.body)
        .then(function (dbComments) {
            console.log(dbComments._id)
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComments._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If Article update successful, send it back to the client
            res.json(dbArticle);
            console.log(dbArticle)
        })
        .catch(function (err) {
            // If error , send it to the client
            res.json(err);

        });
})
router.get('/comments/:id', function (req, res) {
    var note = [];
    db.Article.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            if (dbArticle.comments.length === 0){
                res.json('none')
            }
            for (var i = 0; i < dbArticle.comments.length; i++) {
                db.Comments.findOne({ _id: dbArticle.comments[i] })
                    .then(function (dbComments) {
                        comments.push(dbComments)
                        if (comments.length === dbArticle.comments.length) {
                            var hbsObject = {
                                comments: comment
                            }
                            res.json(hbsObject)
                            console.log(hbsObject)
                        }

                    })

                    .catch(function (err) {
                        res.json(err)
                    })
            }
        })
})
router.delete('/note/:id', function (req, res) {
    db.Article.findOneAndUpdate({comments: req.params.id}, {$pull:{comments:req.params.id}})
    .then(function(){
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (dbComments) {
            console.log(dbComments)
        })
        .catch(function (err) {
            res.json(err)
        })
    })
})
module.exports = router;