const passport = require('passport');
const User = require('../models/user');
require('../passport/local-auth.js');

function signin(req, res, next) {
  passport.authenticate('local-signup', {
    successRedirect: '/email',
    failureRedirect: '/signin',
    passReqToCallback: true
  })(req, res, next);
}

function logout(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/signin');
  });
}

async function getEmail(req, res, next) {
  const id = req.session.passport.user;
  const user = await User.findById(id);

  console.log(user);
  res.render('main', { user, uri: process.env.GetAway || 'http://localhost:3000/mensajes' });
}

module.exports = {
  signin,
  logout,
  getEmail
};
