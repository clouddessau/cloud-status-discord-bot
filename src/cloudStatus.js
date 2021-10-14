const statusUpdate = require('./statusUpdate.js');

class CloudStatus {
	constructor() {
		// Set initial values
		this.isOpen = false;
		this.windDown = false;
	}

	updateStatus(state) {
		this.isOpen = state;

		// Emit an event to notify that [cloud] status changed
		statusUpdate.emit('updateStatus', this.isOpen);
	}

	updateWindDown(state) {
		this.windDown = state;

		// Emit an event to notify that [cloud] status "Wind Down" changed
		statusUpdate.emit('updateWindDown', this.windDown);
	}

	toggleStatus() {
		statusUpdate.emit('toggleStatus');
	}

	enableWindDown() {
		statusUpdate.emit('enableWindDown');
	}
}

let collection = 'status';
const doc = 'cloud_status';

// Use test collection for development environment
if (process.env.NODE_ENV === 'development') {
	collection = 'statusTest';
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
const statusDoc = database.collection(collection).doc(doc);

statusDoc.onSnapshot(snapshot => {
	console.log('Received status update');

	// Update local [cloud] status
	status.updateStatus(snapshot.data().open);

	// Update local "Wind Down" state
	status.updateWindDown(snapshot.data().windDown);
}, error => {
	console.error(`Encountered error: ${error}`);
});

// Toggle [cloud] status
statusUpdate.on('toggleStatus', async () => {
	// Disable "Wind Down" when [cloud] gets closed
	if (status.isOpen) {
		statusDoc.update({
			windDown: false,
		});

		console.log('Disabled [cloud] status “Wind Down”');
	}

	// Toggle [cloud] status in Firestore
	statusDoc.update({
		open: !status.isOpen,
	});

	console.log('Toggled the [cloud] status');
});

// Enable [cloud] status "Wind Down"
statusUpdate.on('enableWindDown', async () => {
	// Enable [cloud] status "Wind Down" in Firestore
	statusDoc.update({
		windDown: true,
	});
});

// Export class instance
module.exports = status;
