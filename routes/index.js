var express = require('express');
var router = express.Router();
var parser = require("../lib/parser")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/submit', function(req, res) {
  console.log(req.body)
  parser.generateOrgTemplate(req.body, function(err, data){
	  if (err) {
	  	return res.send(err);
	  }
	  	return res.send(data);
  })
});

module.exports = router;
