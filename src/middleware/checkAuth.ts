const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  
  // verify user token
  const userToken = req.header('x-auth-token');
  jwt.verify(userToken, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        "errors": [
          {
            "msg": err.message,
          }
        ]
      });
    }
    
    // grant access
    next()
  });
};