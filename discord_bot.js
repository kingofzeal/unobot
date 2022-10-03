const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set';
const GUILD_ID = process.env.GUILD_ID;

const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

console.log('Loaded commands');

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	console.log(`Command: ${interaction.commandName}`)
	console.log(interaction);
	console.log(interaction.options.getString('command'));

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// client.on('guildCreate', async guild => {
//     guild.commands
//         .set(commands)
//         .then(() => console.log(`Commands deployed to ${guild.name}`))
// })

console.log('Commands registered');

client.login(TOKEN);