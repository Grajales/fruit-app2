require('dotenv').config()
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models").User;
const jwt = require('jsonwebtoken');


// GET SIGNUP FORM
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
  });
 
  // GET LOGIN
  router.get("/login", (req, res) => {
    res.render("users/login.ejs");
  });
    //New
    router.post("/login", (req, res) => {
      User.findOne({
        where: {
          username: req.body.username,
        },
      }).then((foundUser) => {
        if (foundUser) {
          bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
            if (match) {
              const token = jwt.sign(
                {
                  username: foundUser.username,
                  id: foundUser.id,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "30 days",
                }
              );
              console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
              res.redirect(`/users/profile/${foundUser.id}`);
            } else {
              return res.sendStatus(400);
            }
          });
        }
      });
    });
    // router.post("/login", (req, res) => {
    //     User.findOne({
    //       where: {
    //         username: req.body.username,
    //       },
    //     }).then((foundUser) => {
    //       if (foundUser) {
    //         bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
    //           if (match) {
    //             res.redirect(`/users/profile/${foundUser.id}`);
    //           } else {
    //             return res.sendStatus(400);
    //           }
    //         });
    //       }
    //     });
    //   });
  // POST LOGIN
//   router.post("/login", (req, res) => {
//     User.findAll({
//       where: {
//         username: req.body.username,
//         password: req.body.password
//       }
//     }).then((users) => {
//       if (users.length > 0) {
//         console.log('username/password combo is correct');
//         let user = users[0];
//         res.redirect(`/users/profile/${user.id}`);
//       } else {
//         console.log('username/password combo is not correct');
//         res.redirect('/users');
//       }
//     });
//   });
  //New router.post POST - CREATE NEW USER FROM SIGNUP
  // router.post("/", (req, res) => {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) return res.status(500).json(err);
  
  //     bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
  //       if (err) return res.status(500).json(err);
  //       req.body.password = hashedPwd;
  
  //       User.create(req.body)
  //         .then((newUser) => {
  //           res.redirect(`/users/profile/${newUser.id}`);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           res.send(`err ${err}`);
  //         });
  //     });
  //   });
  // });
  ////
  //POST - CREATE NEW USER FROM SIGNUP
  router.post("/", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
        if (err) return res.status(500).json(err);
        req.body.password = hashedPwd;
  
        User.create(req.body)
          .then((newUser) => {
            const token = jwt.sign(
              {
                username: newUser.username,
                id: newUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
      res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/profile/${newUser.id}`);
          })
          .catch((err) => {
            console.log(err);
            res.send(`err ${err}`);
          });
      });
    });
  });

  ///
//   // POST - CREATE NEW USER FROM SIGNUP
//   router.post("/", (req, res) => {
//     User.create(req.body).then(newUser => {
//       res.redirect(`/users/profile/${newUser.id}`);
//     });
//   });

module.exports = router;