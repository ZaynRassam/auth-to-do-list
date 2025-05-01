import express from "express"
import logger from "morgan"
import path from "path"
const __dirname = path.resolve();
import cookieParser from "cookie-parser";
import { authenticateJWT, loggedInAs } from "./public/authentication/jwt.js";

const app = new express()

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // for req.body to work with html form
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import adminRouter from './routes/admin.js'
import pageNotFoundRouter from './routes/404.js'
import aboutRouter from './routes/about.js'
import toDoListRouter from './routes/todolist.js'   

app.use(authenticateJWT)
app.use(loggedInAs)
app.use('/', indexRouter);
app.use('/about', aboutRouter)
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/to-do-list', toDoListRouter);
app.use(pageNotFoundRouter);

app.listen(process.env.PORT)