const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            success: false,
            message: 'no tiene autirización'
          });
    }
    const token = req.headers.authorization.split(' ').pop();
    if (token === null) {
        return res.status(403).send({
            success: false,
            message: 'no tiene autirización'
          });;
    }
    try {
        jwt.verify(token, process.env.KEY_JWT, (err, authData) => {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: "Error en el token"
                });
            }else{
                // console.log(authData); 
                next();
            }
        })
        
    } catch (error) {
        return res.status(403).send({
            success: false,
            message: "JWT invalido"
          });
    }
}




module.exports = {verifyToken}