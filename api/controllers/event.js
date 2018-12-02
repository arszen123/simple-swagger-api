'use strict';
const db = require('./db');
const ApiError = require('./ApiError');
const eventHelper = require('../helpers/event');
const _ = require('lodash');
require('underscore-query')(_);

db.initCollection('events');
eventHelper.initDb(db);

module.exports = {
  getAvailableEvents,
  getEventDetails,
};

function getAvailableEvents(req, res) {
  let search = req.swagger.params.search.value || '';
  let from = req.swagger.params.from.value || null;
  let to = req.swagger.params.to.value || null;
  let events = eventHelper.getAvailableEvents({search, from, to});
  if (events.length === 0) {
    throw new ApiError(404, 'No events found', 'notFound');
  }
  return res.json(events);
}

function getEventDetails(req, res) {
  let eventId = req.swagger.params.id.value;
  let event = eventHelper.getEventById(eventId);

  if (event === null) {
    throw new ApiError(404, 'Event not found', 'notFound');
  }
  res.json(event);
}
