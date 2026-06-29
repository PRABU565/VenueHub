const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "venuehub_secret_key_12345";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access Denied: Invalid token." });
  }
};

const allowRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access Denied: Unauthorized request." });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to roles: [${roles.join(", ")}]`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, allowRoles, JWT_SECRET };
