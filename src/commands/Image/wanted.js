const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Wanted, dead  or alive',
            usage: '[user:user]',
            cooldown: 4
		});
	}

	async run(msg, [user]) {
        const target = user || msg.author;
		await msg.channel.send(new MessageAttachment(await this.client.idiot.wanted(target.displayAvatarURL({ format: 'png', size: 128 })), 'wanted.png'));
	}

};