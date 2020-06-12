const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  console.log(req.body)
  User.findOne({ "email": req.body.email }).then(exist_user => {
    console.log(exist_user)
    if (exist_user) {
      console.log("there")
      User.findByIdAndUpdate({ "_id": req.body.password }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        contact: req.body.contact
      })
        .exec(function (err, user) {
          if (err) {
            console.log(err)
            res.status(500).json({
              message: "Invalid authentication credentials!"
            });

          } else {
            res.status(201).json({
              message: "User updated!",
              result: user
            });
          }
        })
    } else {
      console.log("here")
      bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          contact: req.body.contact,
          userName: req.body.userName,
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(result => {
            res.status(201).json({
              message: "User created!",
              result: result
            });
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              message: "Invalid authentication credentials!"
            });
          });
      });
    }
  })


}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ userName: req.body.userName })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          userName: fetchedUser.userName,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email,
          contact: fetchedUser.contact
        },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        email: fetchedUser.email,
        contact: fetchedUser.contact,
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
