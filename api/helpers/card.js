'use strict';
const ApiError = require('../controllers/ApiError');
const transactionHelper = require('./transaction');

module.exports = {
  initDb,
  makeTransaction,
  getCardResponse,
  bankCardExists,
};

let db = null;

function initDb(dbResource) {
  db = dbResource;
  transactionHelper.initDb(db);
}

function makeTransaction(cardCredentials, amount, orderItem) {
  let card = null;
  try {
    card = db.getObject('cards', {id: cardCredentials.id});
  } catch (e) {
    throw new ApiError(404, `Card with '${cardCredentials.id}' id not found!`);
  }

  if (card.password !== cardCredentials.password) {
    throw new ApiError(403, 'Incorrect card password!');
  }

  if (card.bank_card.balance < amount) {
    throw new ApiError(400,
        'Can\'t process because of your card balance is to low');
  }
  card.bank_card.balance -= amount;
  transactionHelper.saveTransaction(card, amount, orderItem);
}

function getCardResponse(cards) {
  cards.forEach(card => {
    delete card.userId;
    delete card.bank_card.ccv;
    delete card.password;
  });
  return cards;
}

function bankCardExists(cardNumber) {
  let exists = true;
  try {
    db.getObjects('cards', card => {
      if (card.bank_card.number === cardNumber) {
        return card;
      }
    });
  } catch {
    exists = false;
  }
  return exists;
}
