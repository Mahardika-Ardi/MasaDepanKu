import { verifyToken } from "../utils/generate_token.utils.js";

const verifyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      Message: "Unauthorized",
      Information: "Invalid Token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  } catch (error) {
    console.log(error);
  }
};

export default verifyMiddleware;
