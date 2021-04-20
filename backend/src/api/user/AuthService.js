const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./User')
const env = require('../../.env')

// Tratamento do E-mail e da Senha...
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

// Método para tratar erros de Banco de Dados...
const sendErrorFromDB = (res, dbErrors) => {

    const errors = []

    _.forIn(dbErrors.errors, error => errors.push(error.message))

    return res.status(400).json({ errors })

}

// Método para validar Login...
// Usuario passa informações de Login...
const login = (req, res, next) => {

    const email = req.body.email || ''

    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {

        // Verificando se existe algum erro no Banco de Dados...
        if (err) {

            return sendErrorFromDB(res, err)

        /** Realiza Teste e valida Usário, se "user" estiver válido
         * Compara de forma Síncrona o "password" enviado com o "user.password"
         * Esta comparação ocorre através do "bcrypt"
        */
        } else if (user && bcrypt.compareSync(password, user.password)) {

            const token = jwt.sign(user, env.authSecret, {
                expiresIn: '1 day'
            })

            const { name, email } = user // Extraí do "user" o "name" e o "email"
            res.json({ name, email, token }) // Gerando um "json" 

        } else {

            return res.status(400).send({ errors: ['Usuários/Senha Inválida'] })

        }

    })

}

// Método para válidar o "token"...
const validateToken = (req, res, next) => {

    const token = req.body.token || ''

    jwt.verify(token, env.authSecret, function(err, decoded) {

        return res.status(200).send({ valid: !err })

    })

}

// Método para validar informações do cadastro de usuários...
const signup = (req, res, next) => {

    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    // Valindado email, comparando "email" com "emailRegex"...
    if (!email.match(emailRegex)) {

        return res.status(400).send({ errors: ['O email informado está inválido'] })

    }

    // Válidando password sobre a expressão regular armazenada em "passwordRegex"
    if (!password.match(passwordRegex)) {

        return res.status(400).send({ errors: ['Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial( @ # $ % ) e tamanho entre 6-12.']})

    }

    // Comparando senhas...
    const salt = bcrypt.genSaltSync()

    const passwordHash = bcrypt.hashSync(password, salt)

    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {

        return res.status(400).send({ errors: ['Senhas não conferem.'] })

    }

    // Verificando se o usuário ja existe no Banco de Dados e cadastrando usuário caso não exista ainda...
    User.findOne({ email }, (err, user) => {

        if (err) {

            return sendErrorFromDB(res, err)

        } else if (user) {

            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })

        } else {

            // Cadastrando Usuário
            const newUser = new User({ name, email, password: passwordHash }) // Obs.: Passar o Hash do password

            newUser.save(err => {

                if (err) {

                    return sendErrorFromDB(res, err)
 
                } else {

                    login(req, res, next)

                }

            })

        }

    })

}

module.exports = { login, signup, validateToken }