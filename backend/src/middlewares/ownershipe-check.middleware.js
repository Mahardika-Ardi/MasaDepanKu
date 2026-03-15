const ownerShipCheck = (req, res, next) => {
  const paramsId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  if (userId !== paramsId && role !== "ADMIN") {
    return res.status(403).json({
      message: "FORBIDEN",
    });
  }

  next();
};

export default ownerShipCheck;
