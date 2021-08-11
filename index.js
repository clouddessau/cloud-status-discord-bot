const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

const status = require('./src/cloudStatus.js');
const statusUpdate = require('./src/statusUpdate.js');

const guildID = '705125706186620968';
const clientID = '874333019673100349';
const commandFileDir = './src/commands';

dotenv.config();

// Initialize discord.js client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commands = [];
client.commands = new Collection();

// Get all command files
const commandFiles = fs.readdirSync(commandFileDir).filter(file => file.endsWith('.js'));

// Add commands to client
for (const file of commandFiles) {
	const command = require(`${commandFileDir}/${file}`);

	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// Create a Discord API REST client
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: commands },
		);

		console.log('Successfully reloaded application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

// Log once the discord.js client is ready
client.once('ready', () => {
	console.log(`Client is ready. Logged in as "${client.user.tag}".`);

	// Set the message (activity) “Listening to /status”
	client.user.setActivity('/status', { type: 'LISTENING' });

	// Initially set the bot presence according to the current [cloud] status
	setPresence(status.isOpen);

	// Update the bot presence when the [cloud] status changes
	statusUpdate.on('update', isOpen => {
		setPresence(isOpen);
	});
});

// Execute commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	}
	catch (error) {
		console.error(`Encountered error: ${error}`);

		await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});

// Set the bot presence
function setPresence(isOpen) {
	if (isOpen) {
		client.user.setStatus('online');
	}
	else {
		client.user.setStatus('dnd');
	}
}

// discord.js client login using application token
client.login(process.env.BOT_TOKEN);
