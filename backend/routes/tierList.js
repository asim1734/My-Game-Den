const express = require('express');
const router = express.Router();
const { 
    createTierList, 
    updateTierList, 
    getTierListBySlug, 
    getMyTierLists,
    deleteTierList 
} = require('../controller/tierListController');

const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', protect, createTierList);
router.get('/my', protect, getMyTierLists);
router.put('/:id', protect, updateTierList);
router.delete('/:id', protect, deleteTierList);

router.get('/slug/:slug', optionalAuth, getTierListBySlug);

module.exports = router;