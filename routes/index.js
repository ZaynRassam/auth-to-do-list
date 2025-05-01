import express from 'express'

var router = express.Router();

router.get('/', function(req,res){
    res.render('index.ejs', {user: req.user})
})

export default router