// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');

var fileUpload = require('express-fileupload'); 
// default options 
app.use(fileUpload());

var filePath;
app.post('/upload', function(req, res) {
    var sampleFile;
	
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
	console.log(req.files.sampleFile);
	console.log(req.files.sampleFile.name);
    sampleFile = req.files.sampleFile;
    sampleFile.mv("abc/"+sampleFile.name, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
			filePath = "abc/"+sampleFile.name;
			//return;
			//res.json({ message: 'Phote uploaded!' });
			res.redirect("http://localhost:8080/#/create");
        }
    });
});



// 2nd part -- connect database and add data table
/*var User     = require('./app/models/user');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://leo:63302860@jello.modulusmongo.net:27017/jiB2ozan'); // connect to our database*/
// 2nd part

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


app.use(express.static(path.join(__dirname, '/')));


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// 2nd part -- add actual routing
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
// 2nd part

// 3rd part - insert a user POST
// on routes that end in /users
// ----------------------------------------------------
router.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {               
        var user = {};
		user._id    = seedId + 1;
		user.image = filePath;
		user.name = req.body.name;
		user.title = req.body.title;
		user.sex   = req.body.sex;
		user.startDate = req.body.startDate;
		user.officePhone = req.body.officePhone;
		user.cellPhone = req.body.cellPhone;
		user.SMS = req.body.SMS;
		user.email = req.body.email;		
		user.manager = req.body.manager;
		console.log(user.manager);
		if (!isEmpty(user.manager)) {
			console.log("i am here");
			
			users.push({
				_id:user._id, 
				name:user.name,
				image:user.image,
				title:user.title, 
				sex:user.sex, 
				startDate:user.startDate, 
				officePhone:user.officePhone,
				cellphone:user.cellPhone,
				SMS:user.SMS,
				email:user.email,
				manager:{_id:user.manager._id, name:user.manager.name},
				directReports:[]
			});
			
			var index = users.map(function(x) {return x._id; }).indexOf(user.manager._id);
			users[index].directReports.push(user._id);
		} else {
			users.push({
				_id:user._id, 
				name:user.name,
				image:user.image,
				title:user.title, 
				sex:user.sex, 
				startDate:user.startDate, 
				officePhone:user.officePhone,
				cellphone:user.cellPhone,
				SMS:user.SMS,
				email:user.email,
				manager:user.manager,
				directReports:[]
			});
		}
		res.json(users);
		
		//var user = new User();      // create a new instance of the User model
        // save the user and check for errors
        /*User.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });*/		     
    })
	//;
// 3rd part

// 4th part -- get the user list
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
		//console.log(users);
        /*User.find(function(err, users) {
            if (err)
                res.send(err);
			
            res.json({users});			 
        });*/
		res.json(users);
    });
// 4th part
router.route('/users/manager/:manager_id')
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
		//console.log(users);
        /*User.find(function(err, users) {
            if (err)
                res.send(err);
			
            res.json({users});			 
        });*/
		console.log(req.params.manager_id);
		var currentId = parseInt(req.params.manager_id);
		var index = users.map(function(x) {return x._id; }).indexOf(currentId);
		console.log(users[index]);		
		res.json(users[index]);
    });
	
router.route('/users/directReports/:directReports')
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
		//console.log(users);
        /*User.find(function(err, users) {
            if (err)
                res.send(err);
			
            res.json({users});			 
        });*/
		//console.log(req.params.directReports);
		//console.log(directReportsUserIdArray[0]);
		var directReportsUserIdArray = JSON.parse(req.params.directReports);
		var i;
		var directReportsUsers = [];
		for(i=0; i<directReportsUserIdArray.length; i++) {
			var currentId = directReportsUserIdArray[i];
			var index = users.map(function(x) {return x._id; }).indexOf(currentId);
			directReportsUsers.push(users[index]);
		}		
		res.json(directReportsUsers);
    });

// 5th part - access an individual user
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')
    // get the user with that _id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        /*User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });*/
		var currentId = parseInt(req.params.user_id);
		var index = users.map(function(x) {return x._id; }).indexOf(currentId);
		res.json(users[index]);
    })
	//;
// 5th part

// 6th part -- update
// update the user with this _id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {
        // use our user model to find the user we want
        /*User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.fName = req.body.fName;  // update the users info
			user.lName = req.body.lName;
			user.title = req.body.title;
			user.sex = req.body.sex;
			user.age = req.body.age;
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });*/
		var user = {};
		user._id    = parseInt(req.params.user_id);
		user.image = filePath;
		user.name = req.body.name;
		user.title = req.body.title;
		user.sex   = req.body.sex;
		user.startDate = req.body.startDate;
		user.officePhone = req.body.officePhone;
		user.cellPhone = req.body.cellPhone;
		user.SMS = req.body.SMS;
		user.email = req.body.email;		
		user.manager = req.body.manager;
		console.log(user.manager);
		var index = users.map(function(x) {return x._id; }).indexOf(user._id);
		console.log(index);
		console.log(users[index].manager);
		
		//check user.manager is empty or not
		if (!isEmpty(user.manager)) {
			if (!isEmpty(users[index].manager)) {
				var managerIndex = users.map(function(x) {return x._id; }).indexOf(users[index].manager._id);
				console.log(managerIndex);
				console.log(users[managerIndex].directReports);
				var i = users[managerIndex].directReports.indexOf(users[index]._id);
				console.log(i);
				if(i != -1) {
					users[managerIndex].directReports.splice(i, 1);
					console.log(users[managerIndex].directReports);
				}
				users[index].manager = {_id:user.manager._id, name:user.manager.name};
				var managerIndex = users.map(function(x) {return x._id; }).indexOf(user.manager._id);
				users[managerIndex].directReports.push(user._id);
			} else {
				users[index].manager = {_id:user.manager._id, name:user.manager.name};
				var managerIndex = users.map(function(x) {return x._id; }).indexOf(user.manager._id);
				users[managerIndex].directReports.push(user._id);
			}
		} else {
			users[index].manager = {};
		}

		if (users[index].directReports.length > 0) {
			var i;
			var managerIndex = users.map(function(x) {return x._id; }).indexOf(users[index].manager._id);
			console.log(managerIndex);
			for (i=0; i<users[index].directReports.length; i++) {
				var tempId = users[index].directReports[i];
				var tempIndex = users.map(function(x) {return x._id; }).indexOf(tempId);
				//users[tempIndex].manager = {};   //set the directReports' new manager to empty.
				
				//set the directReports' new manager to his/her origanal manager
				users[tempIndex].manager = {_id:users[index].manager._id, name:users[index].manager.name};				
				users[managerIndex].directReports.push(tempId);
			}
		}
		res.json(user);
    })
	//;
// 6th part

// 7th part - delete
// delete the user with this _id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        /*User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });*/
		
		var userId = parseInt(req.params.user_id);
		var index = users.map(function(x) {return x._id; }).indexOf(userId);
		console.log(index);
		console.log(users[index].manager);
		if (!isEmpty(users[index].manager)) {
			var managerIndex = users.map(function(x) {return x._id; }).indexOf(users[index].manager._id);
			console.log(managerIndex);
			console.log(users[managerIndex].directReports);
			var i = users[managerIndex].directReports.indexOf(users[index]._id);
			console.log(i);
			if(i != -1) {
				users[managerIndex].directReports.splice(i, 1);
				console.log(users[managerIndex].directReports);
			}
			
			if (users[index].directReports.length > 0) {
				var i;
				var managerIndex = users.map(function(x) {return x._id; }).indexOf(users[index].manager._id);
				console.log(managerIndex);
				for (i=0; i<users[index].directReports.length; i++) {
					var tempId = users[index].directReports[i];
					var tempIndex = users.map(function(x) {return x._id; }).indexOf(tempId);
					//users[tempIndex].manager = {};   //set the directReports' new manager to empty.
					
					//set the directReports' new manager to his/her origanal manager
					users[tempIndex].manager = {_id:users[index].manager._id, name:users[index].manager.name};				
					users[managerIndex].directReports.push(tempId);
				}
			}
		} else {
			if (users[index].directReports.length > 0) {
				var i;
				for (i=0; i<users[index].directReports.length; i++) {
					var tempId = users[index].directReports[i];
					var tempIndex = users.map(function(x) {return x._id; }).indexOf(tempId);
					users[tempIndex].manager = {};   //set the directReports' new manager to empty.
				}
			}
		}		
		users.splice(index, 1);
		res.json(users);
    });
// 7th part 

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

var users = [
	{_id:1,  image:"image/Captain.jpg", 	name:"Hege Pege",		title:"President and CEO", 	sex:"male",		startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{}, directReports: [2, 3] },
	{_id:2,  image:"image/Iron-Man.jpg", 	name:"Kim Pim", 		title:"VP of Sales", 		sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 1, name:"Hege Pege"}, directReports: [4, 5] },
	{_id:3,  image:"image/Ant-Man.jpg", 	name:"Sal Smith",		title:"VP of Engineering", 	sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 1, name:"Hege Pege"}, directReports: [6, 7, 8] },
	{_id:4,  image:"image/Spider.jpg",		name:"Jack Jones",		title:"Sales", 				sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 2, name:"Kim Pim"}, directReports: [] },
	{_id:5,  image:"image/Thor.jpg",		name:"John Doe", 		title:"Sales", 				sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 2, name:"Kim Pim"}, directReports: [] },
	{_id:6,  image:"image/Peter.jpg",		name:"Peter Pan", 		title:"Engineering", 		sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 3, name:"Sal Smith"}, directReports: [] },
	{_id:7,  image:"image/Jack.jpg",		name:"Jack Shephard",	title:"Engineering", 		sex:"male",		startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 3, name:"Sal Smith"}, directReports: [] },
	{_id:8,  image:"image/John.jpg",		name:"John Locke", 		title:"Engineering", 		sex:"male", 	startDate:"1-1-2016", officePhone:"(510)-710-1858", cellPhone:"(510)-710-1858", SMS:"(510)-710-1858", email:"leowanglion@gmail.com", manager:{_id: 3, name:"Sal Smith"}, directReports: [] },
	{_id:9,  image:"image/Kate.jpg",		name:"Kate Austen",		title:"Runner", 			sex:"female", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:10, image:"image/Desmond.jpg",		name:"Desmond Hume",	title:"Scientest", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:11, image:"image/Sayid.jpg",		name:"Sayid Jarrah", 	title:"soldier", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:12, image:"image/James.jpg",		name:"James Sawyer", 	title:"Thief", 				sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:13, image:"image/Ben.jpg",			name:"Ben Linus", 		title:"Scientest", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:14, image:"image/Hurley.jpg",		name:"Hugo Hurley",		title:"Waiter", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:15, image:"image/Juliet.jpg",		name:"Juliet Burke",	title:"Danser", 			sex:"female", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:16, image:"image/Charlie.jpg",		name:"Charlie Pace", 	title:"Student", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:17, image:"image/Claire.jpg",		name:"Claire Littleton",title:"Magician", 			sex:"female", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },	
	{_id:18, image:"image/Jacob.jpg",		name:"Jacob", 			title:"Electric Engineer", 	sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:19, image:"image/Black.jpg",		name:"The Black Man",	title:"Monster", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:20, image:"image/Michael.jpg",		name:"Michael Dawson",	title:"Fighter", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:21, image:"image/Boone.jpg",		name:"Boone Carlyle", 	title:"Manger", 			sex:"male", 	startDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] },
	{_id:22, image:"image/Ana.jpg",			name:"Ana Cortez", 		title:"Soldier", 			sex:"female", 	StartDate:"1-1-2016", officePhone:"", cellPhone:"", SMS:"", email:"", manager:{}, directReports: [] }
];
var seedId = 22;