const db = require('./api/controllers/db');

module.exports = {
  run,
};

function run() {
  db.initCollection('users');
  db.initCollection('session');
  db.initCollection('events');
  db.initCollection('tickets');
  db.initCollection('cards');
/*

  try {
    db.getObjects('users');
  } catch {
    db.createObject('users', {
      id: '1',
      username: 'test',
      password: 'test123',
      email: 'test@gm.com',
      full_name: 'Test Elek',
      age: 25,
    });
    db.createObject('session', {id: 'axd43xs', userId: '1'});
  }

  try {
    db.getObjects('cards');
  } catch {
    db.createObject('cards', {
          id: '1',
          userId: '1',
          name: "Debit Card",
          password: "cardPassword",
          limit: 5000,
          bank_card: {
            holder_name: "Test Elek",
            ccv: "100",
            number: "4012888888881881",
            balance: 100000000
          }
        });
  }
*/

  try {
    db.getObjects('events');
  } catch {

    db.createObject('events', {
      id: '6',
      name: 'Event Name 1Cool',
      amount: 9000,
      tickets: [
        {
          id: '61',
          date: '2018-11-09T05:29:38.632Z'
        },
        {
          id: '62',
          date: '2018-11-19T15:29:38.632Z'
        },
        {
          id: '63',
          date: '2018-11-10T17:29:38.632Z'
        },
        {
          id: '64',
          date: '2018-11-11T20:29:38.632Z'
        }
      ]
    });

    db.createObject('events', {
      id: '1',
      name: 'Event Name 1Cool',
      amount: 9000,
      tickets: [
        {
          id: '11',
          date: '2018-11-09T05:29:38.632Z'
        },
        {
          id: '12',
          date: '2018-11-19T15:29:38.632Z'
        },
        {
          id: '13',
          date: '2018-11-10T17:29:38.632Z'
        },
        {
          id: '14',
          date: '2018-11-11T20:29:38.632Z'
        }
      ]
    });

    db.createObject('tickets',
        {id: 'x61', description: 'Ticket description', event_ticket_id: '61'});
    db.createObject('tickets',
        {id: 'x62', description: 'Ticket description', event_ticket_id: '61'});
    db.createObject('tickets',
        {id: 'x63', description: 'Ticket description', event_ticket_id: '62'});
    db.createObject('tickets',
        {id: 'x11', description: 'Ticket description', event_ticket_id: '11'});
    db.createObject('tickets',
        {id: 'x12', description: 'Ticket description', event_ticket_id: '11'});
    db.createObject('tickets',
        {id: 'x13', description: 'Ticket description', event_ticket_id: '12'});
    db.createObject('tickets',
        {id: 'x14', description: 'Ticket description', event_ticket_id: '12'});
    db.createObject('tickets',
        {id: 'x15', description: 'Ticket description', event_ticket_id: '13'});
    db.createObject('tickets',
        {id: 'x17', description: 'Ticket description', event_ticket_id: '13'});
    db.createObject('tickets',
        {id: 'x18', description: 'Ticket description', event_ticket_id: '14'});
    db.createObject('tickets',
        {id: 'x19', description: 'Ticket description', event_ticket_id: '14'});
    db.createObject('tickets',
        {id: 'x110', description: 'Ticket description', event_ticket_id: '14'});
  }
}
