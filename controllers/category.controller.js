const Category = require("../models/category.model");

exports.addCategory = (req, res, next) => {
    const newCategory = new Category({
        ...req.body
    })

    newCategory.save((err, category) => {
        if (err) {
            console.log(err.message);
        }
        req.flash('success', 'Thank you, your category has been added')
        return res.redirect('/add-category');
    })
}