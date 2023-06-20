const { Router } = require('express');
const router = Router();
const passport = require('passport')
const User = require('../models/user')
require('../passport/local-auth.js')

router.get('/', (req,res, next) => {
  res.render('signin');
});

router.get('/signin', (req,res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signup', {
  successRedirect: '/email',
  failureRedirect: '/signin',
  passReqToCallback: true
}));


router.get('/logout', (req, res , next) => {
  req.logout(function(err) {
    if (err) {
      // Manejar el error de cierre de sesión
      return next(err);
    }
    res.redirect('/signin');
  });
})


function isAuthenticated(req,res ,next)  {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
} 

router.get('/email', isAuthenticated,async (req, res ,next) => {
  const id = req.session.passport.user;
  const user = await User.findById(id);
  
  console.log(user);
  res.render('main',{user,uri:process.env.GetAway || 'http://localhost:3000/mensajes' });
})



module.exports = router 