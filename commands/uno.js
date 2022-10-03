const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uno')
		.setDescription('Play Uno!'),

    async execute(interaction) {
		return interaction.reply('Uno!');
	},
};