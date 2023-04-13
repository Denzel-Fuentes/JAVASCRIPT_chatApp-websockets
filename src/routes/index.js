const { Router } = require('express');
const nodemailer = require ('nodemailer')
const router = Router();
const passport = require('passport')
require('../passport/local-auth.js')
router.get('/', (req,res, next) => {
  res.render('index');
});

router.get('/signin', (req,res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signup', {
  successRedirect: '/email',
  failureRedirect: '/signin',
  passReqToCallback: true
}));

router.get('/login', (req,res, next) => {
  res.render('login');
});


router.post('/login',passport.authenticate('local-signin', {
  successRedirect: '/email',
  failureRedirect: '/login',
  passReqToCallback: true
}));

router.get('/logout', (req, res , next) => {
  req.logout();
  res.redirect('/');
})

router.get('/profile', isAuthenticated,(req, res ,next) => {
  res.render('profile')
})

function isAuthenticated(req,res ,next)  {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
} 

router.get('/email', isAuthenticated,(req, res ,next) => {
  res.render('email')
})

router.post('/send-email', async (req,res)  =>{
    const { name, email,phone,message} = req.body;

    contentHTML = `
      <h1>User Information</h1>
       <ul>
         <li>Username: ${name} </li>
         <li>User Email: ${email} </li>
         <li>Phone: ${phone}</li>
       </ul>
       <p>${message}</p>
    `
    console.log(contentHTML)
    ;
const transporter =   nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'darioguzmanbz@gmail.com',
        pass: 'yahrvwpdpeqrqviz'
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const info = await transporter.sendMail({
      from: "'Pentagono Server' <darioguzmanbz@gmail.com>",
      to: `${email}`,
      subject: 'experimento del pentagono',
      text: `${message}`
    })
    console.log('Mensaje enviado', info.messageId)
    res.redirect('/success.html')
    
})

module.exports = router 