const express = require('express');
const router = express.Router();
const { register, logout, login } = require('../controllers/auth');
const { createTrainerProfile, createClientProfile, createClass } = require('../controllers/data');
const { requireAuth } = require('../middleware/authCheck');

/* GET home page. */
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.post('/auth/create-trainer-profile', createTrainerProfile);
router.post('/auth/create-client-profile', createClientProfile);
router.post('/auth/dashboard/trainer/create-a-class', createClass);


module.exports = router;
