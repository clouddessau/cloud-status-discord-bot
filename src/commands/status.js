// Get [cloud] status
const status = require('../cloudStatus.js');

// Import helper to conviniently detect development environment
const isDev = require('../isDev');

// Export command `/status`
module.exports = {
	data: {
		name: 'status',
		description: 'Replies with the current [cloud] status',
	},
	async execute(interaction) {
		const messageStaticPart = ' [cloud] is ';
		const devIndicatorMessage = ' [Development Mode]';

		if (status.isOpen) {
			if (status.windDown) {
				let reply = '🟡 [cloud] closes soon';
				if (isDev) reply += devIndicatorMessage;

				await interaction.reply(reply);
			}
			else {
				let reply = '🟢' + messageStaticPart + 'open';
				if (isDev) reply += devIndicatorMessage;

				await interaction.reply(reply);
			}
		}
		else {
			let reply = '🔴' + messageStaticPart + 'closed';
			if (isDev) reply += devIndicatorMessage;

			await interaction.reply(reply);
		}
	},
};
