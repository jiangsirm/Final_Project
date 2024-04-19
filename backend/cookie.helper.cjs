const jwt = require('jsonwebtoken');

function cookieDecryptor(request) {
    const token = request.cookies.token;  
    if (!token) {
        return false;
    } else {
        try {
            return jwt.verify(token, 'OWNER_SECRET').ownerAccount;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
}

module.exports = {
    cookieDecryptor
}