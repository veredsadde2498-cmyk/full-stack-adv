const express = require('express');
const router = express.Router();
const Transaction = require('../controllers/transactionController');
const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../validation/transactionValidation');

router.post('/', validate(createTransactionSchema), Transaction.createTransaction);
router.get('/', Transaction.getAllTransactions);
router.get('/:id', Transaction.getTransactionById);
router.put('/:id', validate(updateTransactionSchema), Transaction.updateTransaction);
router.delete('/:id', Transaction.deleteTransaction);

module.exports = router;
