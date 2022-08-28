const express = require('express')
const app = express();
const router = express.Router();
// const PORT = process.env.PORT;
// if (app.get('env') == 'development'){ require('dotenv').config(); }
const mongoose = require('mongoose');
const db = mongoose.connection;
// const host = process.env.CLUSTER
const moment = require('moment');
const bcrypt = require('bcrypt');
const session = require('express-session');
require("dotenv").config();

/////////////////////
//MIDDLEWARE
/////////////////////
// app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: "feedmeseymour", //some random string
    resave: false,
    saveUninitialized: false
}));

//route for sessionUsers
app.get('/sessionUser', (req, res)=>{ //change /app to /sessionUser
    if(req.session.currentUser){
        res.json(req.session.currentUser);
    } else {
        res.status(401).json({ //status 401 is specifically for when the user needs to log in
            status:401,
            message:'not logged in'
        });
    }
});


//////////////////////
//CONTROLLERS
///////////////////
// const animalsControl = require('./controllers/animals.js');
// app.use('/animalsapi', animalsControl);

const locationsController = require("./controllers/locations.js");
app.use("/locations", locationsController);
const userController = require('./controllers/users.js')
app.use('/users', userController);

const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

//new
const commentsController = require('./controllers/comments.js');
app.use('/comments', commentsController);

/////////////////////
//DATABASE
/////////////////////

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Connect to Mongo
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// mongoose.connect('mongodb://localhost:27017/meancrud', { useNewUrlParser: true });
// });

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on( 'open' , ()=>{
  console.log('Connection made to db!');
});


/////////////////////////
//RUNTIME DATA
/////////////////////////




/////////////////////
//Listener
/////////////////////
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
