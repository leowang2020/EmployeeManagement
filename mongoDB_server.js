// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');

/*var fileUpload = require('express-fileupload'); 
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
    sampleFile.mv("uploadPhoto/"+sampleFile.name, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
			filePath = "uploadPhoto/"+sampleFile.name;
			res.redirect("http://localhost:8080/#/create");
        }
    });
});*/
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadPhoto/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });
console.log(upload);
var uploadFile;
app.post('/multer', upload.single('file'), function(req,res,next){
	//var newFile = req.file.filename + req.file.filename
	//res.json(req.file.filename);
	console.log('Uploade Successful');
	console.log(req.file.path);
	uploadFile = req.file.path.replace("\\", "\/");
	console.log(uploadFile);
});


// 2nd part -- connect database and add data table
var User     = require('./app/models/user');

var mongoose   = require('mongoose');
var db = mongoose.connect('mongodb://leo:63302860@jello.modulusmongo.net:27017/jiB2ozan'); // connect to our database
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
		var user = new User();      // create a new instance of the User model
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
		user.directReports = [];
		console.log(user);
        // save the user and check for errors
		if (!isEmpty(user.manager)) {				
			User.findById(user.manager._id, function(err, curManager) {
				var i = curManager.directReports.indexOf(userId);
				if(i != -1) {
					curManager.directReports.splice(i, 1);
					console.log(curManager.directReports);
				}
				User.update({_id: curManager._id}, {$set: {directReports: curManager.directReports}}, 
					function(err){
						if (err)
							res.send(err);
						
						user.save(function(err) {
							if (err)
								res.send(err);

							res.json(user);
						});
					}					
				);
			});
		} else {
			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User created!' });
			});
		}
    })
	//;
// 3rd part

// 4th part -- get the user list
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
		//console.log(users);
        User.find(function(err, users) {
            if (err)
                res.send(err);
			
            res.json(users);			 
        });
		//res.json(users);
    });
// 4th part
router.route('/users/manager/:manager_id')
// get user's manager (accessed at GET http://localhost:8080/api/users/manager/:manager_id)
    .get(function(req, res) {
		//console.log(users);
        User.findById(req.params.manager_id, function(err, user) {
            if (err)
                res.send(err);
			
            res.json(user);			 
        });
    });
	
router.route('/users/directReports/:user_id')
// get the user's direct reports (accessed at GET http://localhost:8080/api/users/directReports/:user_id)
    .get(function(req, res) {
		//var userId = parseInt(req.params.user_id);
		User.findById(req.params.user_id, function(err, user) {
			//console.log(user);
            if (err)
                res.send(err);
			
			User.find({manager: {name: user.name, _id: user._id}}, function(err, users) {
				if (err)
					res.send(err);
				
				console.log(users);
				res.json(users);
			});
		});
    });

// 5th part - access an individual user
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')
    // get the user with that _id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
	//;
// 5th part

// 6th part -- update
// update the user with this _id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(upload.single('file'), function(req, res) {
        // use our user model to find the user we want
		var userId = parseInt(req.params.user_id);
        User.findById(userId, function(err, user) {
            if (err)
                res.send(err);
			
			//update user information
			console.log(req.body.image);
			console.log(req.file);
			if (typeof req.body.image == "undefined") {
				user.image = filePath;
			}
			user.name = req.body.name;
			user.title = req.body.title;
			user.sex   = req.body.sex;
			user.startDate = req.body.startDate;
			user.officePhone = req.body.officePhone;
			user.cellPhone = req.body.cellPhone;
			user.SMS = req.body.SMS;
			user.email = req.body.email;
			console.log(user.email);			
			var managerObj = req.body.manager;
			console.log(managerObj);
            // if the origanal user's manager is empty
			if (isEmpty(user.manager)) {
				if (isEmpty(managerObj)) {
					user.save(function(err) {
						if (err)
							res.send(err);

						res.json(user);
					});
				} else {
					user.manager = managerObj;
					User.findById(user.manager._id, function(err, curManager) {
						var i = curManager.directReports.indexOf(userId);
						if(i != -1) {
							curManager.directReports.splice(i, 1);
							console.log(curManager.directReports);
						}
						User.update({_id: curManager._id}, {$set: {directReports: curManager.directReports}}, 
							function(err){
								if (err)
									res.send(err);
								
								user.save(function(err) {
									if (err)
										res.send(err);

									res.json(user);
								});
							}					
						);
					});
				}
			} else {	// if the origanal user's manager is not empty!!!
				if (isEmpty(managerObj)) { //post user's manager is empty
					//update user's manager's directReports
					User.findById(user.manager._id, function(err, curManager) {
						var i = curManager.directReports.indexOf(userId);
						if(i != -1) {
							curManager.directReports.splice(i, 1);
							console.log(curManager.directReports);
						}
						User.update({_id: curManager._id}, {$set: {directReports: curManager.directReports}}, 
							function(err){
								if (err)
									res.send(err);
								
								user.save(function(err) {
									if (err)
										res.send(err);

									res.json(user);
								});
							}					
						);
					});
				} else if (user.manager._id == managerObj._id) { //user's manager didn't change
					//update user's manager's directReports
					user.save(function(err) {
						if (err)
							res.send(err);
						
						res.json(user);
					});
				} else { //user's manager has been changed
					//update user's manager's directReports
					User.findById(user.manager._id, function(err, oldManager) {
						//update user's old manager's directReports(remove the user's id)
						var i = oldManager.directReports.indexOf(userId);
						if(i != -1) {
							oldManager.directReports.splice(i, 1);
							console.log(oldManager.directReports);
						}
						User.update({_id: oldManager._id}, {$set: {directReports: oldManager.directReports}}, 
							function(err){
								if (err)
									res.send(err);
								
								User.findById(managerObj._id, function(err, newManager) {
									//update user's new manager's directReports(add the user's id)
									newManager.directReports.push(user._id);
									console.log(newManager.directReports);
									
									User.update({_id: newManager._id}, {$set: {directReports: newManager.directReports}}, 
										function(err){
											if (err)
												res.send(err);
											
											user.manager = managerObj;
											user.save(function(err) {
												if (err)
													res.send(err);

												res.json(user);
											});
									});
								});
						});
					});
				}
			}

        });
    })
	//;
// 6th part

// 7th part - delete
// delete the user with this _id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
		var userId = parseInt(req.params.user_id);
		User.findById(userId, function(err, user) {
			if (err)
				res.send(err);
			
			if (user.directReports.length == 0 && (isEmpty(user.manager))) {
				User.remove({_id: userId}, function(err, user) {
					if (err)
						res.send(err);
					
					console.log("I'm here;");
					res.json({ message: 'Successfully deleted' });
				});
			} else if (user.directReports.length == 0 && (!isEmpty(user.manager))) {
				User.findById(user.manager._id, function(err, curManager) {
					var i = curManager.directReports.indexOf(userId);
					if(i != -1) {
						curManager.directReports.splice(i, 1);
						console.log(curManager.directReports);
					}
					User.update({_id: curManager._id}, {$set: {directReports: curManager.directReports}}, 
						function(err){
							if (err)
								res.send(err);
							
							User.remove({_id: userId}, function(err, user) {
								if (err)
									res.send(err);
								
								console.log("I'm here 111;");
								res.json({ message: 'Successfully deleted' });
							});
						}					
					);
				});
			} else if (user.directReports.length != 0 && (isEmpty(user.manager))) {
				console.log(user._id);
				console.log(user.name);
				User.update({manager: {name: user.name, _id: user._id}}, { $set: {manager: {}}}, {multi: true}, 
					function(err){
						if (err)
							res.send(err);
						
						User.remove({_id: userId}, function(err, user) {
							if (err)
								res.send(err);
							
							console.log("I'm here 222;");
							res.json({ message: 'Successfully deleted' });
						});
					}					
				);				
			} else {
				User.findById(user._id, function(err) {
					User.update({manager: {name: user.name, _id: user._id}}, { $set: {manager: {}}}, {multi: true}, 
						function(err){
							if (err)
								res.send(err);
							
							User.findById(user.manager._id, function(err, curManager) {
								if (err)
									res.send(err);
							
								var i = curManager.directReports.indexOf(userId);
								if(i != -1) {
									curManager.directReports.splice(i, 1);
									console.log(curManager.directReports);
								}
								User.update({_id: curManager._id}, {$set: {directReports: curManager.directReports}}, 
									function(err){
										if (err)
											res.send(err);
										
										User.remove({_id: userId}, function(err, user) {
											if (err)
												res.send(err);
											
											console.log("I'm here 111;");
											res.json({ message: 'Successfully deleted' });
										});
									}					
								);
							});
						}							
					);
					
				});
			}
		});
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
var seedId = 22;