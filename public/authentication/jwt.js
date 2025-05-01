import jwt from 'jsonwebtoken'

function generateJWT(user){
  return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {expiresIn: process.env.ACCESS_EXPIRES_IN})
}

function authenticateJWT(req, res, next){
  const token = req.cookies.jwt

  if (!token) {
    req.user = null
  } else{
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) { // Token invalid
        req.user = null
      } else {
        req.user = user; // Attach user info (including role) to request
      }
    });
  }
  next()
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
      if (req.user){
        if (!allowedRoles.includes(req.user.role)) {
          return res.render('unathorisedAccess.ejs', { user: req.user }); // Forbidden
        }
      } else {
        return res.render('unathorisedAccess.ejs', { user: null });
      }
      next();
  }
}

function loggedInAs(req, res, next){
  if (req.user) {
    console.log(`Logged in as: ${JSON.stringify(req.user)}`)
  } else {
    console.log(`Not logged in`)
  }
  next()
}

export { generateJWT, authenticateJWT, authorizeRoles, loggedInAs }