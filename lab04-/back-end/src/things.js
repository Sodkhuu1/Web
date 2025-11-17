var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Things home page');
});
router.post('/', function(req, res) {
    res.send('Add a new thing');
}   );
module.exports = router;