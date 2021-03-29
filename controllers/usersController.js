const express = require("express");
const router = express.Router();

const User = require('../models').User;
const Fruit = require('../models').Fruit;
// INDEX
router.get("/", (req, res) => {
  res.render("users/index.ejs");
});



// GET USERS PROFILE
// router.get("/profile/:id", (req, res) => {
//   User.findByPk(req.params.id).then((user) => {
//     res.render("users/profile.ejs", { user });
//   });
// });
// router.get("/profile/:id", (req, res) => {
//   User.findByPk(req.params.id, {
//     include: [
//       {
//         model: Fruit,
//         attributes: ["id", "name"],
//       },
//     ],
//   }).then((userProfile) => {
//     res.render("users/profile.ejs", {
//       user: userProfile,
//     });
//   });
// });
router.get("/profile/:id", (req, res) => {
  // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
  if (req.user.id == req.params.id) {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Fruit,
          attributes: ["id", "name"],
        },
      ],
    }).then((userProfile) => {
      res.render("users/profile.ejs", {
        user: userProfile,
      });
    });
  } else {
    // res.json("unauthorized");
    res.redirect("/");
  }
});

// EDIT PROFILE
router.put("/profile/:id", (req, res) => {
  User.update(req.body, {
    where: { id: req.params.id },
    returnin: true
  }).then((user) => res.redirect(`/users/profile/${req.params.id}`));
});

// DELETE USER
router.delete("/:id", (req, res) => {
  User.destroy({ where: { id: req.params.id } }).then(() => {
    res.redirect("/users"); //redirect back to index route
  });
});

module.exports = router;
