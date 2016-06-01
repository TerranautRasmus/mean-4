var express = require('express');
var router = express.Router();

router.get("/names", function(req, res){
   res.json([{name: "Peter"}, {name: "Anders"}, {name: "Hanne"}]);
});

router.get("/hellos", function(req, res){
    res.json([{msg: "Hello World"}, {msg: "Hello All"}, {msg: "Hello guys!"}]);
});

module.exports = router;