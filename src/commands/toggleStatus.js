// Import helper to conviniently detect development environment
const isDev = require('../isDev');

// Get [cloud] status
const status = require('../cloudStatus.js');

// Export command `/togglestatus`
module.exports = {
	data: {
		name: 'togglestatus',
		description: 'Toggles the [cloud] status',
		default_permission: false,
	},
	async execute(interaction) {
		// Toggle [cloud] status
		status.toggleStatus();

		// Confirm the action and reply with the new [cloud] status
		const messageStaticPart = ' [cloud] is now ';
		const devIndicatorMessage = ' [Development Mode]';

		// HACK: Assume that the toggle operation succeeded and `status.isOpen` is now its opposite
		if (!status.isOpen) {
			let reply = '🟢' + messageStaticPart + 'open!';
			if (isDev) reply += devIndicatorMessage;

			await interaction.reply(reply);
		}
		else {
			let reply = '🔴' + messageStaticPart + 'closed!';
			if (isDev) reply += devIndicatorMessage;

			await interaction.reply(reply);
		}
	},
};
