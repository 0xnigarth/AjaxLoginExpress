          /** Config Vars ***/
         var expressPort = 80;
         var mongoHost = "localhost";
         var mongoPort = 27017;
         var databaseName = "someDB";
         /**** Mongo Setup *******/

         var mongo = require('mongodb');
         var MongoServer = mongo.Server,
           Db = mongo.Db;
         var mongoServer = new MongoServer(mongoHost, mongoPort, {
           auto_reconnect: true
         });
         var db = new Db(databaseName, mongoServer);


         /******** Passowrd Hash setup*****/
         var passwordHash = require('password-hash');
         /********** Express setup ******/
         var express = require('express');
         var app = express();



          // Express app config
          // This points the default route to the angular js seed
         app.use(express.static(__dirname + '/app'));
         app.engine('html', require('ejs').renderFile);


          // middleware

         app.use(express.bodyParser());
         app.use(express.cookieParser('shhhh, very secret'));
         app.use(express.session());

          // Session-persisted message middleware

         app.use(function(req, res, next) {
           var err = req.session.error,
             msg = req.session.success;
           delete req.session.error;
           delete req.session.success;
           res.locals.message = '';
           if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
           if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
           next();
         });



          // Authenticate using mongodb find

         function authenticate(name, pass, fn) {
           if (!module.parent) console.log('authenticating %s:%s', name, pass);

           db.collection('users', {
             strict: true
           }, function(err, collection) {


             if (err) {
               console.log(err);
             }

             if (!collection) {
               console.log("Collection not found");
             } else {


               collection.findOne({
                 username: name,

               }, function(err, user) {
                 if (err) {
                   console.log("user not found");
                 }
                 if (user) {

                   if (passwordHash.verify(pass, user.hashPass)) {
                     //Login Sucess
                     fn(null, user);
                   } else {
                     fn(new Error('invalid passowrd'));
                   }


                 } else {

                   fn(new Error('user not found'));

                 }


               });
             }



           });



         }


         //This function verifies that the user has a session.
         function restrict(req, res, next) {
           if (req.session.user) {
             next();
           } else {
             req.session.error = 'Access denied!';

             res.end('access denied');
           }
         }

          // Create secure routes using restrict function
         app.get('/restricted', restrict, function(req, res) {
           res.send('Wahoo! restricted area');
         });

          // Rest Based login
         app.post('/login', function(req, res) {
           authenticate(req.body.username, req.body.password, function(err, user) {
             if (user) {
               // Regenerate session when signing in
               // to prevent fixation 
               req.session.regenerate(function() {
                 // Store the user's primary key 
                 // in the session store to be retrieved,
                 // or in this case the entire user object
                 req.session.user = user;
                 req.session.success = 'Authenticated as ' + user.username;
                 res.send(req.session.success);
                 //res.redirect('back');
               });
             } else {
               req.session.error = 'Authentication failed';
               res.send(req.session.error);
               //res.redirect('login');
             }
           });
         });



         app.get('/logout', function(req, res) {
           // destroy the user's session to log them out
           // will be re-created next request
           req.session.destroy(function() {
             res.send("Logged out");
           });
         });

         app.post("/signUp", function(req, res) {



           var username = req.body.username;
           var hashPass = passwordHash.generate(req.body.password);


           if (username && hashPass) {


             db.collection('users', {
               strict: true
             }, function(err, collection) {


               if (err) {
                 console.log("Error Collection");
               }

               collection.findOne({
                 username: username
               }, function(err, user) {

                 if (user == null) {

                   collection.save({
                     username: username,
                     hashPass: hashPass
                   }, function(err) {

                     res.send("User registered sucessfully");
                   });


                 } else {

                   res.send("User Name not available");

                 }



               });


             });

           } else {
             res.send("Please provide a username and password");

           }



         });



         db.open(function(err, db) {
           if (!err) {


             app.listen(expressPort);

             console.log('Express started on port ' + expressPort);
           }
         });