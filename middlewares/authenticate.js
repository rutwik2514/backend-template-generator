const { header } = require('express-validator');
const jwt = require('jsonwebtoken');
// exports.checkAuthorizationHeaders = [
//   header('authorization')
//     .exists()
//     .withMessage('You are not authorized to access this resource')
//     .bail()
//     .custom(async (value, { req, res }) => {
//       console.log("came in middleware", value);
//       if (!value.startsWith('Bearer ')) {
//         console.log("returning false");
//         return res.send({ message: "Token not found" });
//         return false;
//       }
//       const access_token = value.split('Bearer ')[1];
//       console.log("Access token is", access_token);
//       req.access_token = await decodeToken(access_token);
//       console.log("access token is", req.access_token);
//       if (!req.access_token) {
//         throw new ErrorResponse('Session Expired! Please login again');
//       }
//       return true;
//     })
// ];

 const checkAuthorizationHeaders = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token == null || !token || token == undefined) {
    res.status(403).send({ message: "Token is missing" });
    return;
  }

  if (!token.startsWith('Bearer ')) {
    console.log("returning false");
    return res.send({ message: "Token not found" });
    return false;
  }
  const access_token = token.split('Bearer ')[1];
  const decoded = await decodeToken(access_token);
  if(!decoded){
    return res.send({message:'Session Expired! Please login again'})
  }
  req.access_token = await decodeToken(access_token);
  console.log("access token is", req.access_token);
  if (!req.access_token) {
    return res.send({message:'Session Expired! Please login again'});
  }
  // return true;

  next();
}

const decodeToken = async (token, accessType = null) => {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded success");
      return decodedToken;
  } catch (error) {
      console.error("Token verification failed:", error.message);
      return false;
  }
};
module.exports={
  checkAuthorizationHeaders
}