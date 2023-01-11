const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

 function connectDb() {
  console.log('hello')
  try {
     mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Mongodb connected");
  } catch (error) {
    console.log('error')
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDb;
 