//database for store products
var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema ({
    name:String,
    discription:String,
    image:String,
    price: String,
    features:String,
    // ownerId :{type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    
})

var Product= mongoose.model('Product',ProductSchema);

// export products model
// hello git??
module.exports=Product;