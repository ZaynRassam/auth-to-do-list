import express from 'express'

var router = express.Router();

router.get('/', function(req,res){
    res.render('todolist.ejs', {user: req.user})
})

export default router