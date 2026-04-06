const ownerShipCheck = (req, res, next) => {
  const paramsId = Number(req.params.id);
  const userId = Number(req.user.id);
  const role = req.user.role;

  if (Number.isNaN(paramsId)) {
    return next();
  }

  if (userId !== paramsId && role !== "ADMIN") {
    return res.status(403).json({
      message: "FORBIDEN",
    });
  }

  next();
};

export default ownerShipCheck;
