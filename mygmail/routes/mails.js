const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MailSchema = new Schema({
  userid:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  receiver: String,
  mailtext: String,
});

module.exports = mongoose.model("Mail", MailSchema);
