const { SlashCommandBuilder, Routes, REST } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set';
const GUILD_ID = process.env.GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), { body: [] })
    .then(() => console.log('Removed Guild commands'))
    .catch(console.error);

rest.put(Routes.applicationCommands(APPLICATION_ID), { body: commands })
    .then(() => console.log('Applied commands'))
    .catch(console.error);