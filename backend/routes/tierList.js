const express = require('express');
const router = express.Router();
const controller = require('../controller/tierListController');

router.post('/', controller.createTierList);
router.get('/my', controller.getMyTierLists);

router.get('/:id', controller.getTierListById); 

router.put('/:id', controller.updateTierList);
router.delete('/:id', controller.deleteTierList);

module.exports = router;