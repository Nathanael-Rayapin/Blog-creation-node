const req = require('express/lib/request');
const { Validator } = require('node-input-validator');

const loginValidator = (req, res, next) => {

    const v = new Validator(req.body, {
        username: 'required',
        password: 'required',
    });

    v.check().then((matched) => {
        if (!matched) {
            console.log(v.errors);
            req.flash('errorForm', v.errors);
            return res.redirect('/users/login');
        }
        next()
    })
}

module.exports = loginValidator;