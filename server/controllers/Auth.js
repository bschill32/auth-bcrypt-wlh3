const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    // user input their info: name, email, password
    // check to see if email is already in db.  If it is => 409 status
    // create a salt
    // create a hash from the password and salt
    // store name, email, hash into db

    const db = req.app.get('db')
    const { name, email, password } = req.body

    let users = await db.getUserByEmail(email)
    let user = users[0]
    
    if (user) {
      return res.status(409).send('email already used')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let createUserResponse = await db.createUser({ name, email, password: hash })
    let createdUser = createUserResponse[0]

    req.session.user = createdUser
    res.send(req.session.user)
  },

  login: async (req, res) => {
    // user input: email, password
    // get user by email from db
    // if no user, send 401 status
    // compare the password and hash using bcrypt
    // if they don't match send 403 status
    // if they do match add user to session

    let db = req.app.get('db')
    let { email, password } = req.body

    let userResponse = await db.getUserByEmail(email)
    let user = userResponse[0]

    if (!user) {
      return res.status(401).send('email not found')
    }

    const isAuthenticated = bcrypt.compareSync(password, user.password)

    if (!isAuthenticated) {
      return res.status(403).send('incorrect password')
    }

    delete user.password 

    req.session.user = user
    res.send(req.session.user)
  },

  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  }
}