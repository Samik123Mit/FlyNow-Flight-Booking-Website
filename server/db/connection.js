const mongoose = require("mongoose");

const connect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not defined");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("invalid db connection");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connect;
