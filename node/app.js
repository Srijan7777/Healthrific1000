var express 	= require('express'),
	app 		= express(),
   	User        = require("./models/user"),
   	passport    = require("passport"),
   	LocalStrategy = require("passport-local"),
   	passportLocalMongoose = require("passport-local-mongoose"),
   	methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    bodyParser 	= require('body-parser'),
    mongoose    = require("mongoose");

    mongoose.connect("mongodb://localhost:27017/Healthrific",{useNewUrlParser: true , useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!!",
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res , next){
	res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
	next();
});

app.get('/',function(req, res){
	res.render("index");
});

app.get('/dashboard',function(res,req){
	res.render('dashboard');
})

app.get('/register',function(req,res){
	res.render("register");
});

//handle signUp form 
app.post("/register",function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error" , err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Healthrific " + user.username);
			res.redirect("/dashboard");
		});
	});
});

app.get("/login",function(res,req){
	res.render("logIn");
});


//handle login forms
app.post("/login", passport.authenticate("local",
	 {
 		successRedirect: "/dashboard",
 		failureRedirect: "/login"
 	}) ,function(req, res){
});

//logic route
app.get("/logout",function(req, res){
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000,function(){
	console.log("serving on 4000 port");
	console.log("Heathrific has started!!!");
});