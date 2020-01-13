// Get all of our requirements
const mongoose     = require("mongoose");
const express      = require('express');
const session      = require('express-session')
const Question     = require("./QuestionModel");
const User         = require("./UserModel");
const MongoDBStore = require('connect-mongodb-session')(session);

// Create the new mongo store
const store = new MongoDBStore(
{
  uri: 'mongodb://localhost:27017/quiztracker',
  collection: 'sessiondata'
});

// Get our app
const app = express();

// Use the session middleware
// Set the store property in the options
app.use(session({ secret: 'some secret here', store: store }))

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to mongoose
mongoose.connect('mongodb://localhost/quiztracker', {useNewUrlParser: true});

// Connect to our database
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()
{
	app.listen(3000);
	console.log("Server listening on port 3000");
});

// Homepage route
app.get('/', function(req, res, next)
{
  // Find our currently logged in user if there is one
	User.findOne({username: req.session.username}, (err, user) =>
  {
		res.render("pages/index", {loggedin: req.session.loggedin, userID: req.session.username});
	});
});

//Returns a page with a new quiz of 10 random questions
app.get("/quiz", function(req, res, next)
{
	Question.getRandomQuestions(function(err, results)
  {
		if(err) throw err;
		res.status(200).render("pages/quiz",
    {
      loggedin: req.session.loggedin,
			userID: req.session.username,
			questions: results
    });
		return;
	});
});

//The quiz page posts the results here
//Extracts the JSON containing quiz IDs/answers
//Calculates the correct answers and replies
app.post("/quiz", function(req, res, next){
	let ids = [];
	try
  {
		//Try to build an array of ObjectIds
		for(id in req.body){ ids.push(new mongoose.Types.ObjectId(id)); }

		//Find all questions with Ids in the array
		Question.findIDArray(ids, function(err, results)
    {
			if(err)throw err; //will be caught by catch below

			//Count up the correct answers
			let correct = 0;
			for(let i = 0; i < results.length; i++)
      {
				if(req.body[results[i]._id] === results[i].correct_answer) { correct++; }
			}

      if(req.session.loggedin) // See if we are logged in
      {
        User.findOne({username: req.session.username}, (err, user) =>
        {
          // Save quiz info and redirect to profile
          user.total_score   += correct;
          user.total_quizzes += 1;
          user.save(() => { res.json({url: "/users/" + user.username, correct: correct}); });
        });
      }
      else { res.json({url: "/", correct: correct}); }

			return;
		});
	}
  catch(err)
  {
		//If any error is thrown (casting Ids or reading database), send 500 status
		console.log(err);
		res.status(500).send("Error processing quiz data.");
		return;
	}
});

// Route for users
app.get("/users", (req, res, next) =>
{
  // Only find users that aren't private
	User.find({privacy: {$eq: false}}, (err, users) =>
  {
    res.render('pages/users',
	  {
      loggedin: req.session.loggedin,
		  userID: req.session.username,
		  users: users,
    });
  });
});

// Route for specific user
app.get("/users/:userID", (req, res, next) =>
{
  // Get our userID (username)
	let userID = req.params.userID;

	// Find the question using the ID
	User.findOne({ username: userID }, (err, user) =>
	{
    // Set our score average
    let avg;
    if (user.total_quizzes == 0) { avg = 0; }
    else { avg = user.total_score / user.total_quizzes; }

		// 404 if ID doesn't exist
		if (user == null) { res.status(404).send("404: user not found"); }
		else if (user.privacy)
    {
      // Since private, see if it's our profile
      if(req.session.username == user.username)
      {
        res.render('pages/user',
        {
          user: user,
    			loggedName: req.session.username,
    			loggedin: req.session.loggedin,
    			userID: req.session.username,
          score: avg
        });
      }
      else{ res.status(403).send("403: User set to Private"); }
    }
		else
    {
      res.render('pages/user',
      {
        user: user,
			  loggedName: req.session.username,
			  loggedin: req.session.loggedin,
			  userID: req.session.username,
        score: avg
      });
    }
	});
});

// Route handling login
app.post("/login", (req, res) =>
{
  // Chekc if we are already logged in
	if(req.session.loggedin)
  {
		res.status(200).send("Already logged in.");
		return;
	}

  // Get our username and pass
	let username = req.body.username;
	let password = req.body.password;

	User.findOne({username: username}, (err, user) =>
  {
    if(user) // Ff we found a user
    {
      // If the passwords match, log the user in
  		if(user.password === password)
  		{
  			req.session.loggedin = true;
  			req.session.username = username;
  			res.redirect('/users/' + user.username);
  		}
      else{ res.status(401).redirect('/'); }
    }
    else{ res.status(401).redirect('/'); }
	});
});

// Route handling logout
app.get("/logout", (req, res) =>
{
	if(req.session.loggedin)
  {
		req.session.loggedin = false;
		res.render("pages/index", {loggedin: req.session.loggedin});
	}
});

// Route handling for setting privacy
app.post("/private", (req, res) =>
{
  User.findOne({username: req.session.username}, (err, user) =>
  {
    user.privacy = !user.privacy;
    user.save(() => { res.redirect('/users/' + user.username); });
  });
});
