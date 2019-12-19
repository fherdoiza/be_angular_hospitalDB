// Requires

var express = require("express");
var mongoose = require("mongoose");
// Init variables

var app = express();

// Conection to DB
mongoose.connect("mongodb://localhost:27017/hospitalDB", (err, res) => {
  if (err) throw err;
  console.log("Database server running");
});

//Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: "OK"
  });
});

// Listen express
app.listen(3005, () => {
  console.log(
    "Express server running on port 3005 \x1b[32m%s\x1b[0m",
    "online"
  );
});
