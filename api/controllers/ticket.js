'use strict';
const db = require('./db');
const cardHelper = require('../helpers/card');
const ticketHelper = require('../helpers/ticket');
const eventHelper = require('../helpers/event');
const ApiError = require('./ApiError');

db.initCollection('events');
db.initCollection('tickets');
db.initCollection('cards');
cardHelper.initDb(db);
ticketHelper.initDb(db);

module.exports = {
  orderTicket,
  getUserTickets,
  getUserTicketsByEventId,
};

function orderTicket(req, res) {
  let eventTicketId = req.swagger.params.eventTciketId.value;
  let order = req.swagger.params.order.value;
  let userId = req.user.id;
  let eventTicketAmount = 0;
  let eventExists = false;
  try {
    db.getObject('events', event => {

      event.tickets.forEach(ticket => {
        eventExists = eventExists || ticket.id === eventTicketId;
        if (ticket.id === eventTicketId &&
            eventHelper.getAvailableTicketsByEventTicketId(eventTicketId) >=
            order.amount) {
          eventTicketAmount = event.amount;
        }
      });
    });
  } catch {
    if (!eventExists) {
      throw new ApiError(
          404,
          'Event ticket not exists!',
          'notFound',
      );
    }
    if (eventTicketAmount === 0) {
      throw new ApiError(
          404,
          'There is no enough tickets!',
          'lowTickets',
      );
    }
  }

  cardHelper.makeTransaction({
        id: order.card_id,
        password: order.card_password,
      },
      eventTicketAmount * order.amount,
      {id: eventTicketId, type: 'eventTicket'},
  );

  let orderedTickets = ticketHelper.saveTickets(
      eventTicketId,
      order.amount,
      userId,
  );

  let tickets = db.getObjects('tickets', ticket => {
    if (orderedTickets.some(value => value === ticket.id)) {
      return ticket;
    }
  });

  return res.json(ticketHelper.getTicketResponse(tickets));
}

function getUserTickets(req, res) {
  let userOrderedTickets = ticketHelper.getUserTickets(req.user.id);
  if (userOrderedTickets.length === 0) {
    throw new ApiError(404, 'No tickets found!', 'notFound');
  }
  return res.json(
      ticketHelper.getUserOrderedTicketsResponse(userOrderedTickets),
  );
}

function getUserTicketsByEventId(req, res) {
  let eventId = req.swagger.params.eventId.value;
  let userOrderedTickets = ticketHelper.getUserTickets(req.user.id);

  userOrderedTickets = ticketHelper.getUserOrderedTicketsResponse(
      userOrderedTickets,
  );
  if (userOrderedTickets.length === 0) {
    throw new ApiError(404, 'No tickets found!', 'notFound');
  }
  return res.json(
      userOrderedTickets.filter(value => value.event_id === eventId)[0],
  );
}
