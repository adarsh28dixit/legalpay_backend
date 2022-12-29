const mongoose = require('mongoose')
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const userSchema = new mongoose.Schema({
    user_id: {type: String, unique: true, required: false},
    password: {type: String, required: false},
    amount: { type: Number , required: false, default: 0}
})

const User = mongoose.model("User", userSchema);
 
module.exports = User;