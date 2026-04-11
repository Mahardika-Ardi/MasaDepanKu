const ownerShipCheck = (req, res, next) => {
  const paramsId = req.params.id;
  const userId = Number(req.user.id);
  const targetId = req.params.id ? Number(req.params.id) : userId;
  const role = Number(req.user.role);

  if (Number.isNaN(paramsId)) {
    return res.status(400).json({
      message: "BAD_REQUEST",
      information: "Invalid user id parameter",
    });
  }

  if (userId !== targetId && role !== "ADMIN") {
    return res.status(403).json({
      message: "FORBIDEN",
    });
  }

  req.targetUserId = targetId;

  next();
};

export default ownerShipCheck;
