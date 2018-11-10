'use strict';
const db = require('./db');
const ApiError = require('./ApiError');
const _ = require('lodash');
require('underscore-query')(_);
const clone = require('lodash.clonedeep');
const cardHelper = require('../helpers/card');

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
  let cards = [];
  try {
    cards = db.getObjects('cards', {userId: user.id});
    cards = clone(cards);
    cards = cardHelper.getCardResponse(cards);
  } catch {
    // silent
  }

  if (cards.length === 0) {
    throw new ApiError(404, 'No cards found!', 'noCards');
  }

  return res.json(cards);
}

function createCard(req, res) {
  let user = req.user;
  let card = req.swagger.params.card.value;
  card.userId = user.id;
  if (cardHelper.bankCardExists(card.bank_card.number)) {
    throw new ApiError(409, 'Bank card already exists', 'cardAlreadyLinked');
  }

  let cardId = db.createObject('cards', card).id;
  return res.json({id: cardId});
}

function getCard(req, res) {
  let user = req.user;
  let cardId = req.swagger.params.id.value;
  let card = null;
  try {
    card = db.getObject('cards', {id: cardId, userId: user.id});
  } catch (e) {
    throw new ApiError(404, `Card with '${cardId}' id not found!`);
  }
  card = cardHelper.getCardResponse([clone(card)])[0];
  return res.json(card);
}

function deleteCard(req, res) {
  let user = req.user;
  let cardId = req.swagger.params.id.value;
  try {
    db.deleteObject('cards', {id: cardId, userId: user.id});
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
  let filter = {id: cardId, userId: user.id};
  let errorCardNotExists = new ApiError(404,
      `Card with '${cardId}' id not found!`);

  try {
    card = db.getObject('cards', filter);
  } catch (e) {
    throw errorCardNotExists;
  }

  if (card.password !== newCard.password) {
    throw new ApiError(403, `Incorrect card password!`);
  }

  if (typeof newCard.newPassword !== 'undefined') {
    newCard.password = newCard.newPassword;
    delete newCard.newPassword;
  }

  if (newCard.bank_card.number !== card.bank_card.number &&
      cardHelper.bankCardExists(newCard.bank_card.number)) {
    throw new ApiError(409, 'Bank card already exists', 'cardAlreadyLinked');
  }

  try {
    db.updateObject('cards', filter, newCard);
  } catch (e) {
    throw errorCardNotExists;
  }
  newCard.id = cardId;
  newCard = cardHelper.getCardResponse([clone(newCard)])[0];
  return res.json(newCard);
}
