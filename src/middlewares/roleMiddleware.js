export const authorizeSuperadmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden: Superadmin only' });
  }
  next();
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: `Forbidden: Requires role ${roles.join(', ')}` });
    }
    next();
  };
};
