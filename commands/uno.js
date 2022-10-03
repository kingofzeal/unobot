const { SlashCommandBuilder } = require('discord.js');

var storage = require('botkit-storage-redis')({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
	methods: ['hands']
}),
Promise = require('bluebird');

Promise.promisifyAll(storage.channels);
Promise.promisifyAll(storage.users);

const unoGame = require('../lib/uno.js')({ storage: storage })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uno')
		.setDescription('Play Uno!')
		.addStringOption(option => 
			option.setName('command')
				.setDescription('The command to run')),

    async execute(interaction) {
		if (interaction.options.getString('command') === null){
			return interaction.reply({content: '/wave', ephemeral: true});
		}

		switch (interaction.options.getString('command')) {
			case 'status':
				var g = await unoGame.getGame(interaction);
        await unoGame.reportHand(interaction, g);
        await unoGame.reportTurnOrder(interaction, g, true);
        await unoGame.reportScores(interaction, g, true);
				break;
		
			default:
				return interaction.reply({content: '/wave', ephemeral: true});
		}

		// return interaction.reply({content: '/wave'});
	},
};