require('dotenv').config();
const express = require("express");
const app = express(); //app is an object
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.static("public"));

//after app has been defined, use methodOverride.
//We'll be adding a query parameter to our delete form named _method
app.use(methodOverride("_method"));

//near the top, around other app.use() calls
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  let logStatement = `${req.method} ${req.url}`;
  if(Object.keys(req.body).length > 0) {
    logStatement += ` -- body: ${JSON.stringify(req.body)}`;
  }
  console.log(logStatement);
  next();
});
const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt; // COOKIE PARSER GIVES YOU A .cookies PROP, WE NAMED OUR TOKEN jwt

  console.log("Cookies: ", req.cookies.jwt);

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err || !decodedUser) {
      return res.status(401).json({ error: "Unauthorized Request" });
    }
    req.user = decodedUser; // ADDS A .user PROP TO REQ FOR TOKEN USER
    console.log(decodedUser);

    next();
  });
};

app.use("/fruits", require("./controllers/fruitsController.js"));
// app.use("/users", require("./controllers/usersController.js"));
// ADD THE VERIFY TOKEN MIDDLEWARE WHERE WE WANT AUTHENTICATION
app.use("/users", verifyToken, require("./controllers/usersController.js"));
app.use("/auth", require("./controllers/authController.js"));
//Index
app.get('/', (req, res) => {
  res.render('users/index.ejs')
})


app.listen(process.env.PORT, () => {
  console.log('I am listening');
})
