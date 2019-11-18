'use strict';

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const User = require("../models/user");

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
  const { userName, password } = req.body;

  bcrypt.hash(password, 10).then(hash => {
    return User.create({
      userName, 
      passHash: hash
    });
  })
  .then(user => {
    req.session.user = user._id;
    res.redirect("/");
  })
  .catch(error => next(error));
});


router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});

router.post("/sign-in", (req, res, next) => {
  const { userName, password } = req.body;
  let userId;

  User.findOne({ userName })
    .then(user => {
      if (!user) {
          return Promise.reject(new Error("There's no user with that User Name."));
      } else {
        userId = user._id;
        return bcrypt.compare(password, user.passHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});


const routeGuard = require('./../middleware/route-guard');

router.get('/profile/:userName', routeGuard, (req, res, next) => {
  User.findOne({ _id: req.session.user._id }).then(user => {
    res.render("profile");
  });
});

router.post('/profile/edit', (req, res, next) => {
  const userName = req.body.userName;
  User.updateOne({ _id: req.user._id }, { userName }).then(result => {
    res.redirect(`/profile/${userName}`);
  }).catch(error => {
    next(error);
  });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;
