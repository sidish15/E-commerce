const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");

mongoose.connect(MONGOURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error on connectin to database"));

db.once("open", () => {
  console.log(`Successfully connected to database`);
});
