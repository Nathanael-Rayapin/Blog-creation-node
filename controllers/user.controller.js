const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const randomToken = require('random-token');
const Reset = require('../models/reset.model');

module.exports = {
    login: (req, res, next) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })

        req.login(user, (err) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/users/login');
            }
            passport.authenticate("local",
                { failureRedirect: '/users/login', failureFlash: 'Invalid username or password !' })(req, res, (err, user) => {
                    if (err) {
                        req.flash('error', err.message);
                        return res.redirect('/users/login');
                    }
                    req.flash('success', 'Your are now connected !');
                    return res.redirect('/users/dashboard');
                })
        })
    },
    signup: (req, res, next) => {
        const newUser = User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        })

        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/users/signup');
            }
            // Authentification
            passport.authenticate("local")(req, res, (err, newUser) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('/users/signup');
                }
                req.flash('success', 'Your are now connected !');
                return res.redirect('/');
            })
        })
    },
    resetPassword: (req, res, next) => {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
            if (!user) {
                req.flash('error', 'Username not found !');
                return res.redirect('/users/forgot-password');
            }
            // Creation de token
            const token = randomToken(32);
            const reset = new Reset({
                username: req.body.username,
                resetPasswordToken: token,
                resetExpires: Date.now() + 3600000
            })
            reset.save((err, reset) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('/users/forgot-password');
                }
                // Email de réinitialsiation
                req.body.email = user.email;
                req.body.message = "<h3>Hello " + user.username + "</h3><br>click this link to reset your password : <br>"
                    + req.protocol + "://" + req.get('host') + "/users/reset-password/" + token;
                next();
            })
        })
    },
    saveProfile: (req, res, next) => {
        if (!req.user) {
            req.flash('warning', 'Please login to modify your profile !');
            return res.redirect('/users/login');
        }
        if (req.user._id != req.body.userId) {
            req.flash('error', 'You do not have the right to modify this profile !');
            return res.redirect('/users/dashboard');
        }
        User.findOne({ _id: req.body.userId }, (err, user) => {
            if (err) {
                console.log(err);
            }
            const oldUsername = user.username;
            user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
            user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;

            user.save((err, user) => {
                if (err) {
                    req.flash('error', 'An error has occured. Please try again !');
                    return res.redirect('/users/dashboard');
                }
                if (oldUsername != user.username) {
                    req.flash('success', 'Your username has been changed successfully and you have been logged out. Please reconnect using your new username : ' + req.body.username);
                    return res.redirect('/users/login');
                }
                req.flash('success', 'Your profile has been updated !');
                return res.redirect('/users/dashboard');
            })
        })
    }
}