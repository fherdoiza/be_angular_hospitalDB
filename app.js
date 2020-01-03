// Requires

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var doctorRoutes = require("./routes/doctor");
var searchRoutes = require("./routes/search");
var uploadRoutes = require("./routes/upload");
var imagesRoutes = require("./routes/images");
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
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/search", searchRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imagesRoutes);

app.use("/", appRoutes);

// Listen express
app.listen(3000, () => {
  console.log(
    "Express server running on port 3000 \x1b[32m%s\x1b[0m",
    "online"
  );
});