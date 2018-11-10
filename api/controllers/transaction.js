'use strict';
const db = require('./db');
const transactionHelper = require('../helpers/transaction');
const ApiError = require('./ApiError');

db.initCollection('transaction');
transactionHelper.initDb(db);

module.exports = {
  getTransactions,
  getTransaction,
};

function getTransactions(req, res) {
  let transactions = transactionHelper.getTransactions(req.user.id);
  if (transactions.length === 0) {
    throw new ApiError(404, 'No transactions found!', 'notFound');
  }
  return res.json(transactions);
}

function getTransaction(req, res) {
  let transactionId = req.swagger.params.id.value;
  let transaction = transactionHelper.getTransaction(transactionId,
      req.user.id);
  if (transaction === null) {
    throw new ApiError(404, 'Transaction not found!', 'notFound');
  }
  return res.json(transaction);
}
