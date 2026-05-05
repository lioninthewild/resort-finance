export function requireOwner(req, res, next) {
  const token = req.headers['x-owner-token'];
  if (token !== process.env.OWNER_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}