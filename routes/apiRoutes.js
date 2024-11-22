const express = require('express');
const router = express.Router();
const controller = require('../controllers/portalController');
const jwt = controller.jwt;




router.post('/admin/login',authenticateAdmin,controller.adminLogin);

router.post('/admin/login',authenticateAdmin,controller.adminLogin);





function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).send('Token is required');

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (error) {
      res.status(403).send('Invalid or expired token');
    }
  }


module.exports = router;