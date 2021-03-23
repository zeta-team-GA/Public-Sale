// database for users
const mongoose = require("mongoose")
const bcrypt = require("bcrypt"); //library to hide password...

const UserSchema = new mongoose.Schema({
    fullName : String,
    email : String,
    phoneNumber : String,
    passwordDigest: String,
    products :[{type : mongoose.Schema.Types.ObjectId , ref : 'Product'  }],
    
},)

// Methods for login go here
UserSchema.statics.createSceureData =  function (fullName, email, phoneNumber, password, callback){
  console.log("fullName: " , fullName , 
              "\nemail:" , email,
              "\nphoneNumber", phoneNumber,
              "\npassword", password); // this just to ensure that data its in database.

  //salt : the meaning of salt >> before encrypt password we need use random info to encrypt messag why?? because we dont want to any person to guess what is the information.
    bcrypt.genSalt((err, salt) =>{
    //console.log("byecrpt: " , salt) // just for test to ensure we get random info

    // hash: random value that we take it is string and we want to encrypt string
    bcrypt.hash(password, salt, (err, passwordHash) =>{

      // create user
      User.create( {fullName:fullName,email:email, phoneNumber:phoneNumber, passwordDigest: passwordHash}, callback);

    })
  })
}

//User authenticate ... check for me if the email that logIn in database

UserSchema.statics.authenticate = function (email, password, callback){

// find user by name entered at log in
// remember `this` is the User model when we are inside a static method
this.findOne({email: email}, function (err, foundUser) {
  console.log(foundUser);
  // throw error if can't find user
  if (!foundUser) {
    // console.log('No user with name ' + email);
    callback("Error: no user found", null);  // better error structures are available, but a string is good enough for now
  // if we found a user, check if password is correct
  } else if (foundUser.checkPassword(password)) {
    callback(null, foundUser);
  } else {
    callback("Error: incorrect password", null);
  }
});
};


// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
  return bcrypt.compareSync(password, this.passwordDigest);
};



// User reset password
UserSchema.statics.resetPassword = (email, newPassword, callback) =>{
  // console.log( "Email:" ,email)

      
      bcrypt.genSalt((err, salt) =>{
        //console.log("byecrpt: " , salt) // just for test to ensure we get random info
    
        // hash: random value that we take it is string and we want to encrypt string
        bcrypt.hash(newPassword, salt, (err, passwordHash) =>{
          console.log("PasswordHash:", passwordHash)
          // create user
          User.findOneAndUpdate( {email:email}, {passwordDigest: passwordHash}, callback);
    
        })
      }) 
}







const User = mongoose.model("User", UserSchema)
// export user model
module.exports = User;