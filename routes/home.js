const express = require('express');
const routes = express()
const Products = require("../models/product")
const User = require("../models/user")




// Show home page
//Display all product in home page
routes.get('/',(req,res)=>{
    
    User.find()
        .populate('products')
        .then(userProduct => {
         console.log(userProduct)
            res.render("home", { userProduct: userProduct, type: undefined });
        })
})









module.exports = routes