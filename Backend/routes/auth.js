
import "dotenv/config";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;


function authenticateToken(req, res, next) {
    // Extract token from the Authorization header (Format: Bearer <TOKEN>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    // Verify token validity
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token!' });
        }
        
        // Attach decoded data to request and proceed
        req.user = decodedUser;
        next();
    });
}

export default authenticateToken;