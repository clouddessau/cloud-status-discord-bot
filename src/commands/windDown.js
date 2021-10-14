// Import helper to conviniently detect development environment
const isDev = require('../isDev');

// Get [cloud] status
const status = require('../cloudStatus.js');

// Export command `/winddown`
module.exports = {
	data: {
		name: 'winddown',
		description: 'Indicates that [cloud] is about to close',
		default_permission: false,
	},
	async execute(interaction) {
		const devIndicatorMessage = ' [Development Mode]';

		// Enable [cloud] status "Wind Down" when [cloud] is open
		if (status.isOpen) {
			status.enableWindDown();

			let reply = '🟡 [cloud] will close soon';
			if (isDev) reply += devIndicatorMessage;

			await interaction.reply(reply);
		}
		else {
			let reply = '❌ [cloud] is already closed';
			if (isDev) reply += devIndicatorMessage;

			await interaction.reply(reply);
		}
	},
};
