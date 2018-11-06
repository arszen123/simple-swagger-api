const db = require('./db');
const ApiError = require('./ApiError');
const _ = require('lodash');
require('underscore-query')(_);
const clone = require('lodash.clonedeep');

db.initCollection('cards');
module.exports = {
  getCards,
  createCard,
  getCard,
  deleteCard,
  putCard,
};

function getCards(req, res) {
  let user = req.user;
  try {
    let cards = db.getObjects('cards', {userId: user._id});
    cards = clone(cards);
    cards.forEach(function(card) {
      card.id = card._id;
      delete card._id;
      delete card.userId;
      delete card.bank_card.ccv;
      delete card.password;
    });
    return res.json(cards);
  } catch {
    // silent
  }
  return res.json([]);
}

function createCard(req, res) {
  let user = req.user;
  let card = req.swagger.params.card.value;
  card.userId = user._id;
  // @TODO Check if bank_card.number exists
  try {
    db.getObject(
        'cards',
        {bank_card: {number: card.bank_card.number}},
    );
    throw new ApiError(409, 'Card exists!');
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }
  }
  let cardId = db.createObject('cards', card)._id;
  return res.json({id: cardId});
}

function getCard(req, res) {
  let user = req.user;
  let cardId = req.swagger.params.id.value;
  let card = null;
  try {
    card = db.getObject('cards', {_id: cardId, userId: user._id});
  } catch (e) {
    throw new ApiError(404, `Card with '${cardId}' id not found!`);
  }
  card = clone(card);
  card.id = card._id;
  delete card._id;
  delete card.bank_card.ccv;
  delete card.password;
  delete card.userId;
  return res.json(card);
}

function deleteCard(req, res) {
  let user = req.user;
  let cardId = req.swagger.params.id.value;
  try {
    db.deleteObject('cards', {_id: cardId, userId: user._id});
  } catch (e) {
    throw new ApiError(404, `Card with '${cardId}' id not found!`);
  }
  return res.json({success: true});
}

function putCard(req, res) {
  let user = req.user;
  let newCard = req.swagger.params.card.value;
  let cardId = req.swagger.params.id.value;
  let card = null;
  let filter = {_id: cardId, userId: user._id};
  let cardExistsError = new ApiError(404, `Card with '${cardId}' id not found!`);

  try {
    card = db.getObject('cards', filter);
  } catch (e) {
    throw cardExistsError
  }

  if (card.password !== newCard.password) {
    throw new ApiError(403, `Incorrect card password!`);
  }

  if (typeof newCard.newPassword !== 'undefined') {
    newCard.password = newCard.newPassword;
    delete newCard.newPassword;
  }

  try {
    db.updateObject('cards', filter, newCard);
  } catch (e) {
    throw cardExistsError;
  }
  newCard = clone(newCard);
  newCard.id = cardId;
  delete newCard.bank_card.ccv;
  delete newCard.password;
  return res.json(newCard);
}
