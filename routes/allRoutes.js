var express = require('express');
const { getTrainerProfile, getClient, getTrainer, getAllClasses, getOneClass, getClientProfile, addClass, editClass, dashboard, trainerClasses, clientClasses } = require('../controllers/data');
var router = express.Router();
const { checkUser, requireAuth} = require('../middleware/authCheck');

router.get('/', (req, res) => res.send('Hello World!'));
router.get('/user', checkUser);
router.get('/auth/dashboard/:id', requireAuth, dashboard);
router.get('/auth/dashboard/trainer/classes', requireAuth, trainerClasses);
router.get('/auth/dashboard/client/classes', requireAuth, clientClasses);
router.get('/auth/dashboard/trainer/profile', getTrainerProfile);
router.get('/auth/dashboard/client/profile', getClientProfile);
router.get('/auth/dashboard/trainer/clients', getClient);
router.get('/auth/dashboard/client/trainers', getTrainer);
router.get('/auth/dashboard/client/classes/find-a-class', getAllClasses);
router.get('/auth/dashboard/client/classes/details/:id', getOneClass);
router.get('/auth/dashboard/trainer/classes/edit-class/:id', getOneClass);
router.put('/auth/dashboard/trainer/classes/edit-class/:id', editClass);
router.post('/auth/dashboard/client/classes/add-a-class', addClass);



module.exports = router;