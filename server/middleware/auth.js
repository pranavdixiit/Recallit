// server/middleware/auth.js
// 📄 server/middleware/auth.js
import jwt from 'jsonwebtoken';

// ✅ Auth middleware (checks either cookie or Authorization header)



export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(" ")[1];


  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Will contain role, email, id, etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};


export const registeredOnly = (req, res, next) => {
  // only proceed if role is not guest
  if (req.user?.role === "guest") {
    return res.status(403).json({ error: "Guests cannot perform this action" });
  }
  next();
};



