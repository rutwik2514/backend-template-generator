const { header} = require('express-validator');
const jwt = require('jsonwebtoken');
exports.checkAuthorizationHeaders = [
    
    header('authorization')
      .exists()
      .withMessage('You are not authorized to access this resource')
      .bail()
      .custom(async (value, { req }) => {
        console.log("came in middleware",value);
        if (!value.startsWith('Bearer ')){
            console.log("returning false");
           return false;
        }
        const access_token = value.split('Bearer ')[1];
        console.log("Access token is", access_token);
        req.access_token = await decodeToken(access_token);
        console.log("access token is", req.access_token);
        if (!req.access_token) {
          throw new ErrorResponse('Session Expired! Please login again');
        }
        return true;
      })
  ];

const decodeToken = async (token, accessType = null) => {
	// try {
        console.log("came in decode token");
		const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded success");
		return decodedToken;
	// } catch (e) {
	// 	return null;
	// }
};