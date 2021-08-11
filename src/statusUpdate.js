const EventEmitter = require('events');

// Create event emitter to publish a notification when the [cloud] status changes
const statusUpdate = new EventEmitter();

module.exports = statusUpdate;
