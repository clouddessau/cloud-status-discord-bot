// Get [cloud] status
const status = require('../cloudStatus.js');

// Export command '/togglestatus'
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

		// HACK: Assume that the toggle operation succeeded and `status.isOpen` is now its opposite
		if (!status.isOpen) {
			await interaction.reply('🟢' + messageStaticPart + 'open!');
		}
		else {
			await interaction.reply('🔴' + messageStaticPart + 'closed!');
		}
	},
};
