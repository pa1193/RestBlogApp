var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
//app config
mongoose.connect("mongodb://localhost:27017/blogapp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
//models
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);





//restful routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});
//index
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
    //create
    app.post("/blogs", function(req, res) {
        //create blog
        //redirect
        console.log(req.body);
		req.body.blog.body = req.sanitize(req.body.blog.body);
		console.log("=================");
		        console.log(req.body);

        Blog.create(req.body.blog, function(err, newBlog) {
            if (err) {
                res.render("new");

            } else {
                res.redirect("/blogs")
            }
        });
    });
});
//
app.get("/blogs/new", function(req, res) {
    res.render("new");

});

//edit
app.get("/blogs/:id/edit", function(req,res){

	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("shows",{blog:foundBlog});
		}
	});
});
//update 
app.put("/blogs/:id", function(req, res){
Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
	if(err){
		res.redirect("/blogs");
	}else{
		res.redirect("/blogs/"+ req.params.id);
	}
})
});

app.delete("/blogs/:id", function (req,res) {
	/* body... */
	Blog.findOneAndRemove(req.params.id, function (err) {
		if(err){
			console.log("Blog could not be found");
			res.redirect("/blogs");
		}
		else{
			console.log("blog deleted");
			res.redirect("/blogs");
		}
		
		/* body... */
	})
});
app.listen(3000, function() {
    console.log("server is running");
});