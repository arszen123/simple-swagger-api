'use strict';

module.exports = {
  initDb,
  getTicketResponse,
  saveTickets,
  getUserTickets,
  getUserOrderedTicketsResponse,
};

let db = null;

function initDb(dbResource) {
  db = dbResource;
}

function getTicketResponse(tickets) {
  let result = [];
  tickets.forEach(ticket => {
    let date = getEventTicketDate(ticket.event_ticket_id);
    let ticketRes = {...ticket, date};
    delete ticketRes.userId;
    delete ticketRes.event_ticket_id;
    result.push(ticketRes);
  });
  return result;
}

function saveTickets(eventTicketId, ticketAmount, userId) {
  let ticketsOrdered = 0;
  return db.updateObjects('tickets', ticket => {
    if (ticket.event_ticket_id === eventTicketId && typeof ticket.userId ===
        'undefined' &&
        ticketsOrdered < ticketAmount) {
      ticketsOrdered++;
      return true;
    }
    return false;
  }, {userId});
}

function getUserTickets(userId) {
  let tickets = [];
  try {
    tickets = db.getObjects('tickets', {userId});
  } catch {

  }
  return tickets;
}

function getUserOrderedTicketsResponse(tickets) {
  let result = {};
  let date = '';
  let event_id = null;

  tickets.forEach(ticket => {
    date = getEventTicketDate(ticket.event_ticket_id);
    event_id = getEventTicketEventId(ticket.event_ticket_id);
    console.log(date);
    if ((new Date(date)).getTime() < (new Date()).getTime()) {
      return;
    }

    if (typeof result[event_id] === 'undefined') {
      result[event_id] = [];
    }
    result[event_id].push(
        {id: ticket.id, description: ticket.description, date: date});
  });

  let response = [];
  Object.keys(result).map((index) => {
    response.push({
      event_id: index,
      amount: result[index].length,
      tickets: result[index],
    });
  });
  return response;
}

function getEventTicketDate(event_ticket_id) {
  let events = [];
  let date = '';
  try {
    events = db.getObjects('events');
  } catch {
    return date;
  }

  events.forEach(event => {
    event.tickets.forEach(eventTicket => {
      if (eventTicket.id === event_ticket_id) {
        date = eventTicket.date;
      }
    });
  });
  return date;
}

function getEventTicketEventId(event_ticket_id) {
  let events = [];
  let id = null;
  try {
    events = db.getObjects('events');
  } catch {
    return id;
  }

  events.forEach(event => {
    event.tickets.forEach(eventTicket => {
      if (eventTicket.id === event_ticket_id) {
        id = event.id;
      }
    });
  });
  return id;
}
