const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const dotenv = require('dotenv');

const guildID = '705125706186620968';
const commandFileDir = './src/commands';

dotenv.config();

// Initialize discord.js client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

// Get all command files
const commandFiles = fs.readdirSync(commandFileDir).filter(file => file.endsWith('.js'));

// Add commands to client
for (const file of commandFiles) {
	const command = require(`${commandFileDir}/${file}`);

	client.commands.set(command.name, command);
}

// Log once the discord.js client is ready
client.once('ready', () => {
	console.log(`Client is ready. Logged in as "${client.user.tag}".`);
});

// Register guild commands
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = {
			name: 'status',
			description: 'Replies with the current [cloud] status',
		};

		const command = await client.guilds.cache.get(guildID)?.commands.create(data);

		console.log(`Created command ${command.name}`);
	}
});

// Execute commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	}
	catch (error) {
		console.log(`Encountered error: ${error}`);

		await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});

// discord.js client login using application token
client.login(process.env.BOT_TOKEN);
