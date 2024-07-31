const jwt = require('jsonwebtoken')

const tokenSign = async (data) => {
    return jwt.sign(
        {
            data
        },
        process.env.KEY_JWT,
        {
            expiresIn: "2h"
        }
    )
}

const tokenVerify = async (data) => {
    jwt.verify(data, process.env.KEY_JWT, (err, authData) => {
        if (err) {
            return console.log("error");
        }else{
            return authData
        }
    })
}

module.exports = { tokenSign, tokenVerify };