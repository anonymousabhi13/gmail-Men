var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/gmaildb");
var userSchema = mongoose.Schema({
  username:String,
  email: String,
  Number: String,
  password: String,
  gender: String,
  sentMails:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Mail'
  }],
  receiveMails:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Mail'
  }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
