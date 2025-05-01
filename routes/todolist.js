import express from 'express'
import { authenticateJWT } from '../public/authentication/jwt.js'
import { queryAll } from '../public/postgres/postgres.js';

var router = express.Router();

router.get('/', authenticateJWT, async function(req,res){
    var dbUserTasks = []
    const dbAllTasks = await queryAll(process.env.TASK_TABLE_NAME)
    if (!req.user){
        return res.render('todolist.ejs', {user: req.user, dbUserTasks: dbUserTasks})
    }
    dbUserTasks = dbAllTasks.filter((dbTask) => dbTask.user_id == req.user.user_id)
    console.log(dbUserTasks)
    res.render('todolist.ejs', {user: req.user, dbUserTasks: dbUserTasks})
})

router.put('/add-task', authenticateJWT, async function(req, res){

})

export default router