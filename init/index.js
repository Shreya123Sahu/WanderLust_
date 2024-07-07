const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection successful");

    await initdb();
    console.log("data was initialised");

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

main();

async function initdb() {
  await Listing.deleteMany({});
  initData.data= initData.data.map((obj)=>({...obj,owner:"6659b0f7b449bbf45a0c2111"}));
  await Listing.insertMany(initData.data);
}
