var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// =====================
// COMMENTS ROUTES
// =====================
// New Comments
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campgrounds by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});
// Create Comments
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up camground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong, whoops.");
                    console.log(err);
                } else {
                    //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                    console.log("The comment username will be " + req.user.username);
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/campgrounds/" + campground._id);
                 }
            });
        }
    });
});
// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    //res.send("YOU HIT THE UPDATE ROUTE FOR COMMENTS");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// COMMENTS DESTORY ROUTE
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



// CHECK COMMENTS OWNERSHIP

module.exports = router;