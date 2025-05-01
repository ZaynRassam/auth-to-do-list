import express from 'express'
import { authenticateJWT } from '../public/authentication/jwt.js'
import { queryAll, insertRecord, deleteRecord } from '../public/postgres/postgres.js';
import { changeTaskCompletedStatus } from '../public/postgres/postgresTasks.js';

var router = express.Router();

router.get('/', authenticateJWT, async function(req,res){
    var dbUserTasks = []
    const dbAllTasks = await queryAll(process.env.TASK_TABLE_NAME)
    if (!req.user){
        return res.render('todolist.ejs', {user: req.user, dbUserTasks: dbUserTasks})
    }
    dbUserTasks = dbAllTasks.filter((dbTask) => dbTask.user_id == req.user.user_id)
    res.render('todolist.ejs', {user: req.user, dbUserTasks: dbUserTasks})
})

router.get('/add-task', authenticateJWT, function(req, res){
    console.log("add task page")
    if (!req.user){
        return res.redirect('/to-do-list')
    }
    res.render("todolist-add-task.ejs", { user: req.user, userCreated: false, wrongCredentials: false })
})

router.post('/add-task', authenticateJWT, async function(req, res){
    const reqTaskTitle = req.body.taskTitle
    const reqTaskDescription = req.body.taskDescription
    const reqTaskPriority = req.body.taskPriority
    const dataObj = {user_id: req.user.user_id, task_title: reqTaskTitle, task_description: reqTaskDescription, priority: reqTaskPriority}

    try {
        insertRecord(process.env.TASK_TABLE_NAME, dataObj)
        res.status(201).redirect("/to-do-list")
    } catch (error) {
        console.log(error)
    }
})

router.post('/delete-task', authenticateJWT, async (req, res) => {
    const reqTaskDeleteID = req.body.taskDelete
    const dataObj = {task_id: reqTaskDeleteID}
    try {
        deleteRecord(process.env.TASK_TABLE_NAME, dataObj)
        console.log(`deleting record with task id: ${dataObj.task_id}`)
        res.status(201).redirect("/to-do-list")
    } catch (error) {
        console.log(error)
        res.redirect('/to-do-list')
    }
})

router.post('/update-task-completion-status', authenticateJWT, async (req, res) => {
    const reqTaskId = req.body.taskID
    var reqTaskCompleteStatus = req.body.taskCompleteStatus === "true"
    console.log(`task is: ${reqTaskId}`)
    console.log(`task is currentlty: ${reqTaskCompleteStatus} (true for complete)`)
    console.log(`trying to convert it to ${!reqTaskCompleteStatus}`)
    try {
        changeTaskCompletedStatus(!reqTaskCompleteStatus, reqTaskId)
        res.status(201).redirect("/to-do-list")
    } catch (error) {
        console.log(error)
        res.redirect('/to-do-list')
    }
})

export default router