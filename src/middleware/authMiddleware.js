export const isAuthenticated = (req, res, next) => {
  console.log('Session in isAuthenticated:', req.session);
  if (req.session.userId) {
    // Instead of sending a response, just pass the userId to the next middleware
    req.userId = req.session.userId;
    next();
  } else {
    console.log('Not authenticated, sending 401');
    res.status(401).json({ message: 'Not authenticated' });
  }
};