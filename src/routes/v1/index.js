const express = require('express');

const { InfoController } = require('../../controllers');
const {UserMiddleware}=require('../../middlewares')

const userRoute=require('./user-route')

const router = express.Router();

router.get('/info', UserMiddleware.checkAuthentication,
                    InfoController.info);
router.use('/user',userRoute);

module.exports = router;