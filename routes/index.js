const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { 
    metaTitle: 'Index Title',
    metaDescription: 'Index Description',
    scripts: ['controllers/index.js']
  });
});

module.exports = router;
