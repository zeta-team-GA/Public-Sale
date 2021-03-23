const express = require('express');
const routes = express();
const User = require("../models/user");


// Show Login Form
routes.get("/login", (req, res) => {
    res.render("login");
})


// Show SignUp form
routes.get("/signup", (req, res) => {
    res.render("signup")
});




// recieve signup form
routes.post("/signup", (req, res) => {
    var fullName = req.body.fullName;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;

    console.log(req.body)
    User.createSceureData(fullName, email, phoneNumber, password);
    var option = {
        position:"b",
        duration:"2000" // milliseconds >>> 2s.
      };
    res.flash('Successfuly Sign Up','success', option);

    res.redirect("/login");
});


// recieve login form

routes.post("/login", (req, res) => {
    console.log("Login email, password", req.body.email, req.body.password);
  
   
   
    // Authenitcate User
    User.authenticate(req.body.email, req.body.password, (err, foundUser) => {
        if (err) {
            
            console.log("Authenitcate error", err)
            var option = {
                position:"b",
                duration:"2000" // milliseconds >>> 2s.
              };
            res.flash('Invalid Password or Invalid Email','error', option);
            // res.status(401).send(err)
            res.render("login")
        } else {
            var option = {
                position:"b",
                duration:"2000" // milliseconds >>> 2s.
              };
            res.flash('Sucessfuly Login', 'success', option);
            req.session.userId = foundUser._id;
            res.redirect("/")
            
        }
    });

});

// logout
routes.get("/logout", function (req, res) {
    // remove the session user id
    req.session.userId = null; //// lose only the userid info
   // req.session.destroy() // lose all info
    // redirect to login (for now)
    res.redirect("/");
});





module.exports = routes;