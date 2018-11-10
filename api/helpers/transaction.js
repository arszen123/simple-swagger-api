'use strict';
const clone = require('lodash.clonedeep');

module.exports = {
  initDb,
  saveTransaction,
  getTransactions,
  getTransaction,
};

let db = null;

function initDb(dbResource) {
  db = dbResource;
}

function saveTransaction(card, amount, orderItem) {
  db.createObject('transaction', {
    card_id: card.id,
    amount: amount,
    date: (new Date()).toISOString(),
    orderItem: orderItem,
    userId: card.id,
  });
}

function getTransactions(userId) {
  let transactions = [];
  try {
    transactions = db.getObjects('transaction', {userId});
    transactions = getTransactionResponse(clone(transactions));
  } catch {

  }
  return transactions;
}

function getTransaction(id, userId) {
  let transaction;
  try {
    transaction = db.getObject('transaction', {id, userId});
    transaction = getTransactionResponse([clone(transaction)])[0];
  } catch {
    return null;
  }
  return transaction;
}

function getTransactionResponse(transaction) {
  transaction.forEach(t => {
    delete t.userId;
  });
  return transaction;
}
