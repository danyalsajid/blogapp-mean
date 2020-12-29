const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

// routes
const authRoute = require("./routes/authRoutes");
const blogRoute = require("./routes/blogRoutes");

const app = express();

//// DB Connection and server ////
const config = require("./config/database");
const port = process.env.PORT || 3000;
mongoose
  .connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port, () => {
      console.log("Server started on port ", port);
    });
  })
  .catch((err) => console.log(err));

//// MIDDLE WARES ////
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// set CORS policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//// Routes ////
app.use("/auth", authRoute);
app.use("/blog", blogRoute);

//// ERROR HANDLING ////
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    msg: error.message,
  });
});
