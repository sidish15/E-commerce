const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./config/mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hey");
});
app.use("/", require("./routes/auth.js"));
app.use("/", require("./routes/post.js"));
app.use("/", require("./routes/user.js"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, (err) => {
  if (err) {
    console.log("Error in starting the server :", err);
  }

  console.log(`Server is running at port ${port}`);
});
