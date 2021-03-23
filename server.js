// Require express framework and additional modules
const express = require("express");
const routes = express();
require("dotenv").config();
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const mongoSessisonStore = require("connect-mongo")(session);
const flash = require("flash-express")

const port = process.env.PORT || 3000;
// Connect to database and pull in model(s)
mongoose.connect(
  process.env.MONGO_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(`MongoDb connected to ${process.env.MONGO_CONNECTION_URL}`)
);

// Middleware
routes.use(express.static("public"));
routes.use(flash());
routes.use(expressLayouts);
routes.use(
  session({
    store: new mongoSessisonStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    resave: true,
    secret: "Zeta's super secret secret",
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
routes.use((req, res, next)=>{

  if(req.session.userId){

    res.locals.checklogin = true

  }else{

    res.locals.checklogin = false

  }
  next()

})
routes.set("view engine", "ejs");
routes.use(methodOverride("_method"));
routes.use(express.urlencoded({ extended: true }));


// routes
routes.use(require('./routes/home'))
routes.use(require('./routes/user'))
routes.use(require('./routes/products'))
routes.use(require('./routes/profile'))



//test


// listen on port 3000
routes.listen(port, function () {
    console.log(`Server is running ${port}`);
  });