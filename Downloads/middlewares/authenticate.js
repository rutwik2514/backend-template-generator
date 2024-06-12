
        const jwt = require('jsonwebtoken');

        const checkIfSuperAdmin = async (req) => {
        const token = req.headers['authorization'];
        if (token == null || !token || token == undefined) {
            return false;
        }

        if (!token.startsWith('Bearer ')) {
            return false;
        }
        const access_token = token.split('Bearer ')[1];
        const decoded = await decodeToken(access_token);
        if (!decoded) {
            console.log("sending session expired");
            return false;
        }
        return decoded.userType === "super_admin";
        }

        const checkAuthorizationHeaders = async (req, res, next) => {
        const token = req.headers['authorization'];
        if (token == null || !token || token == undefined) {
            res.status(403).send({ message: "Token is missing" });
            return;
        }

        if (!token.startsWith('Bearer ')) {
            console.log("returning false");
            return res.status(500).send({ message: "Token not found" });
            return false;
        }
        const access_token = token.split('Bearer ')[1];
        const decoded = await decodeToken(access_token);
        if (!decoded) {
            console.log("sending session expired");
            return res.status(500).send({ message: 'Session Expired! Please login again' })
        }

        req.access_token = await decodeToken(access_token);
        console.log("access token is", req.access_token);
        if (!req.access_token) {
            return res.status(500).send({ message: 'Session Expired! Please login again' });
        }
        // return true;

        next();
        }


        const authorizeUser = (permission_key) => async (req, res, next) => {
        const userType = req.access_token.userType;
        if (userType === "super_admin") {
            return next();
        }

        try {
            const permissionsModule = await import('../utils/permissions');
        const validPermissions = permissionsModule[`${userType}`];
            if (!validPermissions) {
            return res.status(403).json({ error: "Unauthorized user type" });
            }
            if(validPermissions.includes(permission_key)){
            return next();
            }
            else{
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
        };


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
        module.exports = {
        checkAuthorizationHeaders,
        checkIfSuperAdmin,
        authorizeUser
        }