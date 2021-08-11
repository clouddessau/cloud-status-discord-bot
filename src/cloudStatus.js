const statusUpdate = require('./statusUpdate.js');

class CloudStatus {
	constructor() {
		// Set initial value
		this.isOpen = false;
	}

	updateStatus(state) {
		this.isOpen = state;

		// Emit an event to notify that the [cloud] status changed
		statusUpdate.emit('update', this.isOpen);
	}

	toggleStatus() {
		statusUpdate.emit('toggle');
	}
}

const admin = require('firebase-admin');

// Create new `CloudStatus` class instance
const status = new CloudStatus();

// Load Firebase service account configuration
const serviceAccount = require('../firebase-admin-account.json');

// Initialize Firebase app
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://cloud-dessau-app.firebaseio.com',
});

// Intialize Firestore database
const database = admin.firestore();

// Get [cloud] status document in Firestore and observe it
const statusDoc = database.collection('status').doc('cloud_status');
statusDoc.onSnapshot(snapshot => {
	console.log('Received status update');

	// Update local [cloud] status
	status.updateStatus(snapshot.data().open);
}, error => {
	console.error(`Encountered error: ${error}`);
});

// Toggle [cloud] status
statusUpdate.on('toggle', async () => {
	// Toggle [cloud] status in Firestore
	statusDoc.update({
		open: !status.isOpen,
	});

	console.log('Toggled the [cloud] status');
});

// Export class instance
module.exports = status;
