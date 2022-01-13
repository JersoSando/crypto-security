const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const users = []


const app = express()

app.use(express.json())
app.use(cors())

const {
    login,
    register
} = require('./controllers/auth')

app.post(`/api/login`, login)
app.post(`/api/register`, register)

module.exports = {
    register: (req, res) => {
        const {username, email, firstName, lastName, password} = req.body
        const salt = bcrypt.genSalt(5)
        const passwordHash = bcrypt.hashSync(password, salt)

        let user = {
            username,
            email,
            firstName,
            lastName,
            passwordHash
        }
        users.push(user)
        let userToReturn = {...user}
        delete userToReturn.passwordHash
        res.status(200).send(userToReturn)
    },
    login: (req,res) => {
        const {username, password} = req.body

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username){
                const authenticated = bcrypt.compareSync(password, users[i].passwordHash)
                if (authenticated) {
                    let userToReturn = {...users[i]}
                    delete usertoReturn.passwordHash
                    res.status(200).send(userToReturn)
                }
            }
    }
}
}

app.listen(4004, () => console.log(`running on 4004`))