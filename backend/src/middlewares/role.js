const roleCheck = (...role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "UNAUTHORIZED",
      });
    }

    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        message: "FORBIDEN",
      });
    }

    next();
  };
};

export default roleCheck;
