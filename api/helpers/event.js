'use strict';
const clone = require('lodash.clonedeep');

module.exports = {
  initDb,
  getAvailableEvents,
  getAvailableTicketsByEventTicketId,
  getEventById,
};

let db = null;

function initDb(dbResource) {
  db = dbResource;
}

function getAvailableEvents(criteria) {
  let events = getFilteredEvents(criteria);
  events = setAvailableTickets(events);
  return events;
}

function getAvailableTicketsByEventTicketId(event_ticket_id) {
  let available = 0;
  try {
    let tickets = db.getObjects('tickets', ticket => {
      if (typeof ticket.event_ticket_id !== 'undefined' &&
          ticket.event_ticket_id === event_ticket_id &&
          (typeof ticket.userId === 'undefined' || ticket.userId === null)) {
        return ticket;
      }
    });
    available = tickets.length;
  } catch {

  }
  return available;
}

function getEventById(eventId) {
  let event = null;
  try {
    event = db.getObject('events', {id: eventId});
    event = setAvailableTickets([clone(event)])[0] || null;
  } catch {

  }
  return event;
}

/**
 *  Private methods
 */

function getFilteredEvents({search, from, to}) {
  let events = [];
  try {
    events = searchEventByText(search);
    events = filterEventsByDate(clone(events), {from, to});
  } catch {
    // silent
  }
  return events;
}

function setAvailableTickets(events) {
  let result = [];
  events.forEach(event => {
    event.tickets = event.tickets.filter(ticket => {
      ticket.available = getAvailableTicketsByEventTicketId(ticket.id);
      if (ticket.available === 0) {
        return false;
      }
      return true;
    });
    if (event.tickets.length !== 0) {
      result.push(event);
    }
  });
  return result;
}

function searchEventByText(search) {
  let events = [];
  let regexp = /([ ,.\/\\;\'\"]+)/ig;
  search = search.replace(regexp, '').toLowerCase();
  try {
    events = db.getObjects('events', event => {
      let text = event.name + (event.description || '');
      text = text.replace(regexp, '').toLowerCase();
      return search === '' || text.search(search) !== -1;
    });
  } catch {

  }
  return events;
}

function filterEventsByDate(events, {from, to}) {
  if (to !== null) {
    to.setDate(to.getDate() + 1);
  }
  events.filter(event => {
    event.tickets = event.tickets.filter(ticket => {
      let date = new Date(ticket.date);
      if ((from === null || date >= from) && (to === null || date <= to)) {
        return true;
      }
      return false;
    });
  });
  return events;
}
