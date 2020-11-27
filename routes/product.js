const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const productCtrl = require('../controllers/product');

/* GET ALL */
router.get('/', auth, productCtrl.getAllSauces);

/* GET ONE BY ID */
router.get('/:id', auth, productCtrl.getOneSauce);

/* POST ONE / ADD ONE */
router.post('/', auth, multer, productCtrl.createSauce);

/* UPDATE ONE */
router.put('/:id', auth, multer, productCtrl.modifySauce);

/* DELETE ONE */
router.delete('/:id', auth, productCtrl.deleteSauce);

/*LIKE DISLIKE*/
router.post('/:id/like', auth, productCtrl.likeSauce);

module.exports = router;