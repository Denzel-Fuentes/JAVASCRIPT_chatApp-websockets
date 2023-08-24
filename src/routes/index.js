const { Router } = require('express');
const router = Router();
const controller = require('../controller/controller.user');

router.get('/', (req, res, next) => {
  res.render('signin');
});

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', controller.signin);

router.get('/logout', controller.logout);

router.get('/email', isAuthenticated, controller.getEmail);


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
