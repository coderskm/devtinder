const mongoose = require('mongoose');

const connectDB = async () => {
await mongoose.connect("mongodb+srv://sumitmishraskm21_db_user:4xg6FWm8dEpQKGwZ@namastenode.cgr55e6.mongodb.net/devtinder");
}
 
module.exports = connectDB;