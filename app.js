// Requires

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");
// Init variables
var app = express();

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

// Conection to DB
mongoose.connect("mongodb://localhost:27017/hospitalDB", (err, res) => {
  if (err) throw err;
  console.log("Database server running");
});

app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/", appRoutes);

// Listen express
app.listen(3000, () => {
  console.log(
    "Express server running on port 3000 \x1b[32m%s\x1b[0m",
    "online"
  );
});