const express = require('express');
const router = express.Router();
const userController = require('./../controller/user.controller.js');

router.post('/', userController.create);

router.get('/', userController.getAll);


module.exports = router;