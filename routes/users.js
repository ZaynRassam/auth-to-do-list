import { queryAll } from '../public/postgres/postgres.js'
import { insertUser, changeUserRole, updateUserPassword, deleteUser} from '../public/postgres/postgresUsers.js'
import { authenticateJWT, generateJWT, authorizeRoles } from '../public/authentication/jwt.js'
import bcrpyt from "bcryptjs"
import express from 'express'
var router = express.Router();
var allUsers;

const hashed_adminpassword = await bcrpyt.hash(process.env.ADMINPASSWORD, 10)

router.get('/login', function(req, res){
    if (req.user){
        return res.redirect('/')
    }
    res.render("login.ejs", { user: req.user, userCreated: false, wrongCredentials: false })
})

router.post('/login', async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password
    
    allUsers = await queryAll(process.env.USER_TABLE_NAME)
    console.log(allUsers)
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        return res.status(400).render("login.ejs", { user: req.user, userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
    }
    const user = { username: dbUser.username, role: dbUser.role}
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            const accessToken = generateJWT(user)
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })
            res.redirect('/')
        } else {
            return res.status(400).render("login.ejs", {user: req.user, userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/logout', async function(req, res){
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
    res.redirect('/')
})

router.get("/signup", function(req, res){
    if (req.user){
        return res.redirect('/')
    }
    res.render("signup.ejs", {user: req.user})
})

router.post('/signup', async function(req,res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password
    const hashedPassword = await bcrpyt.hash(reqPassword, 10)

    allUsers = await queryAll(process.env.USER_TABLE_NAME)

    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        try {
            insertUser(reqUsername, hashedPassword, 'user')
            res.status(201).render("login.ejs", {user: req.user, userCreated: true, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: false})
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(500).render("signup.ejs", {usernameTaken: true})
    }
})

router.get("/update-password", function(req, res){
    if (req.user){
        return res.redirect('/')
    }
    res.render("updateAccountPassword.ejs", {user: req.user})
})

router.post('/update-password', async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password
    const reqNewPassword = req.body.newPassword

    allUsers = await queryAll(process.env.USER_TABLE_NAME)
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        res.status(400).render("update-password.ejs", {user: req.user, invalidUsername: true})
    }
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            const hashedPassword = await bcrpyt.hash(reqNewPassword, 10)
            updateUserPassword(reqUsername, hashedPassword)
            res.status(201).render("login.ejs", {user: req.user, changedPassword: true, userCreated: false, wrongCredentials: false})
        } else {
            return res.status(400).render("login.ejs", {user: req.user, userCreated: true, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/delete-user', authenticateJWT, authorizeRoles("admin"), function(req,res){
    res.render('deleteUser.ejs', {user: req.user})
})

router.post('/delete-user', authenticateJWT, authorizeRoles("admin"), async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password

    allUsers = await queryAll(process.env.USER_TABLE_NAME)
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        return res.status(400).render("deleteUser.ejs", {user: req.user, wrongCredentials: true})
    }
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            deleteUser(reqUsername)
            res.status(201).render("login.ejs", {user: req.user, userDeleted: true, changedPassword: false, userCreated: false, wrongCredentials: false})
        } else {
            return res.status(400).render("deleteUser.ejs", {user: req.user, userDeleted: false, userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/change-role', async function(req, res){
    if (!req.user){
        return res.redirect('/users/login')
    }
    if (req.user.role == "admin") {
        changeUserRole("user", req.user.username)
    } else {
        changeUserRole("admin", req.user.username)
    }
    res.redirect('/users/logout')
})

export default router
