const express = require('express');
const routes = express()
const User = require("../models/user");
const Products = require("../models/product")

// show user profile page and git user info 
routes.get("/profile", function (req, res) {
  console.log("session user id: ", req.session.userId);
  // find the user currently logged in
  User.findOne({ _id: req.session.userId }, function (err, currentUser) {
    if (err) {
      console.log("database error: ", err);
      res.redirect("/login");
    } else {
      // render profile template with user's data
      console.log("loading profile of logged in user") ;

      User.findById(req.session.userId)
        .populate('products')
        .then((user)=>{
         // console.log("user from profile", user.fullName)
          res.render("profile", { user: user });
        })
     
    }
  });
});
// edit product
routes.get("/update/:id/edit", (req, res) => {
  const id = req.params.id;
  Products.findById(id)
      .then(product => {
          res.render("edit", { product: product });
      }).catch(err => console.log(err))
    })

// update action
routes.put("/updateUser/:id", (req, res) => {
  const id = req.session.userId;
  let updateProduct = {
    fullName : req.body.name,
      email :  req.body.email,
      phoneNumber : req.body.phoneNumber,
  };
  User.findByIdAndUpdate(id, updateProduct)
      .then(product => {
          res.redirect("/profile");
      }).catch(err => console.log(err))
});

//change password
routes.get("/updatePassword/:id/edit", (req, res) => {
  const id = req.session.userId;

  User.findById(id)
      .then(user1 => {
      //  console.log(user1.email)
          res.render("resetPassword", { user1: user1 });
      }).catch(err => console.log(err))

});


// change password
routes.post("/resetPassword", (req,res)=>{
  var id = req.session.userId;
  var newPassword = req.body.password;
 
  User.findById(id)
  .then(user1 => {
    var email = user1.email
  //  console.log(user1.email)
  User.resetPassword(email , newPassword, (err, foundUser)=>{
    // console.log("test err", err, foundUser)
  //  res.redirect("/profile")
   var option = {
    position:"b",
    duration:"2000" // milliseconds >>> 2s.
  };
  res.flash('Sucessfuly change password', 'success', option); 
  res.redirect("/profile")
})
  }).catch(err => console.log(err))


  
})







module.exports = routes;