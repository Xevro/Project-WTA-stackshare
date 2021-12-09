const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const passport = require('passport')
const Categories = mongoose.model('Categories');

router.get('/',
    async (req, res) => {
        const categories = await Categories.find();
        res.json({
            data: categories,
            totalCount: await Categories.countDocuments()
        });
    });

router.get('/:categoryId',
    async (req, res) => {
        const categories = await Categories.findOne({uuid: req.params.categoryId});
        res.json(categories);
    });

module.exports = router;
