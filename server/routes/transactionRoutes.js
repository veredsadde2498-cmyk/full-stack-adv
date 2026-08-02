const express = require('express');
const router = express.Router();
const Transaction = require('../controllers/transactionController');

router.post('/', Transaction.createTransaction);
router.get('/', Transaction.getAllTransactions);
router.get('/:id', Transaction.getTransactionById);
router.put('/:id', Transaction.updateTransaction);
router.delete('/:id', Transaction.deleteTransaction);

module.exports = router;
