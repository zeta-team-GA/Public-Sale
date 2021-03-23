const express = require('express');
const routes = express()
const User = require("../models/user");
const Products = require("../models/product")


// Show products form
routes.get("/product", (req, res) =>{
    res.render("product")
})

// // Recive Product form
// routes.get("/product", (req, res) =>{
//     res.render("profile")
// })


//  add product
routes.post("/product", (req, res) =>{

    console.log("session user id: ", req.session.userId);
    // find the user currently logged in
    User.findOne({ _id: req.session.userId }, function (err, currentUser) {
      if (err) {
        console.log("database error: ", err);
        res.redirect("/login");
      } else {
        var addProduct ={
            name : req.body.name,
            discription : req.body.discription,
            image : req.body.image,
            price : req.body.price,
            features : req.body.features
        }

        Products.create(addProduct)
        .then((product)=>{
            User.findByIdAndUpdate(req.session.userId, {$push:{products:product}})
            .populate('products')
            .then((user)=>{
                console.log(user)
                res.redirect("/profile")
            })
            
        })
        .catch((err)=>{ console.log(err) })
      }
    });
})

// edit product
//  get the update view
routes.get("/update/:id/edit", (req, res) => {
    const id = req.params.id;

    Products.findById(id)
        .then(product => {
            res.render("edit", { product: product });
        }).catch(err => console.log(err))


});

// update action
routes.put("/update/:id", (req, res) => {
    const id = req.params.id;
    let updateProduct = {
        name : req.body.name,
        discription : req.body.discription,
        image : req.body.image,
        price : req.body.price,
        features : req.body.features
    };
    Products.findByIdAndUpdate(id, updateProduct)
        .then(product => {
            res.redirect("/profile");
        }).catch(err => console.log(err))
});



//delete product
routes.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    Products.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/profile");
        })
        .catch(err => console.log(err))

});












module.exports = routes;