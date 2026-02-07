const express = require('express');
const router = express.Router();
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
    bulkAssignClients
} = require('../controllers/client.controller');
const { protect } = require('../middleware/auth.middleware');

// All client routes are protected
router.use(protect);

router.route('/')
    .post(createClient)
    .get(getClients);

router.patch('/bulk-assign', bulkAssignClients);

router.route('/:id')
    .get(getClientById)
    .patch(updateClient)
    .delete(deleteClient);

module.exports = router;
