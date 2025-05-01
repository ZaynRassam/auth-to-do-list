import express from 'express'
import { authenticateJWT, authorizeRoles } from '../public/authentication/jwt.js';

var router = express.Router();

router.get('/', authenticateJWT, authorizeRoles("admin"), function(req,res){
    res.render('admin.ejs', { user: req.user })
})

export default router