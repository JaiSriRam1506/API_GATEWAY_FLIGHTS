const express = require('express');

const { InfoController } = require('../../controllers');

const userRoute=require('./user-route')

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/user',userRoute);

module.exports = router;