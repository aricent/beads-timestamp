var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TsAPP' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'TsAPP' });
});


module.exports = router;
