const { SlashCommandBuilder } = require('@discordjs/builders');

// Get [cloud] status
const status = require('../cloudStatus.js');

// Export command '/status'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with the current [cloud] status'),
	async execute(interaction) {
		const messageStaticPart = ' [cloud] is ';

		if (status.isOpen) {
			await interaction.reply('🟢' + messageStaticPart + 'open');
		}
		else {
			await interaction.reply('🔴' + messageStaticPart + 'closed');
		}
	},
};
