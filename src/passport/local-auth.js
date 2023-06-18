const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/user')


passport.serializeUser((User, done) => {
    done(null, User.id)
})

passport.deserializeUser(async (id, done) => {
    const User = await user.findById(id);
    done(null, User, )
})
passport.use('local-signup', new LocalStrategy({
    
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    try {
        const User = await user.findOne({email: email});
        if(User){
            return done(null,User)
        } else {
            const newUser = new user();
            newUser.name = req.body.name;
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            await newUser.save();
            done(null, newUser);
        }
    } catch (err) {
        done(err);
    }
    
}))
