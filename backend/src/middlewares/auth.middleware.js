import { verifyToken } from "../utils/generate_token.utils.js";

const verifyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      Message: "Unauthorized",
      Information: "Invalid token or Token not provided",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Unauthorized",
      information: "Invalid token format",
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
      information: "Invalid or expired token",
    });
  }
};

export default verifyMiddleware;
