var express = require('express');
const userController = require('../controllers/user.controller');
const loginValidator = require('../middlewares/validators/login.validator');
const userValidator = require('../middlewares/validators/user.validator');
const { guard } = require('../middlewares/guard');
const sendResetMail = require('../middlewares/services/email.service');
var router = express.Router();

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', loginValidator, userController.login);

// Reset Password
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
})

router.post('/forgot-password', userController.resetPassword, sendResetMail);

// Sign up
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', userValidator, userController.signup);


// Dashboard
router.get('/dashboard', guard, (req, res) => {
  res.render('dashboard');
});

router.post('/save-profile', userController.saveProfile);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now disconnected !');
  res.redirect('/');
})

module.exports = router;
