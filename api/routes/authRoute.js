const express = require('express')
const signup = require('../controllers/authController.js')

const router = express.router();

router.post('/signup', signup)

module.exports = router