import express from 'express'

var router = express.Router();

router.use(function(req,res){
    res.status(404).render('404', { user: req.user, title: "Page not found" })
})

export default router