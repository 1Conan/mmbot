const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			requiredPermissions: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'],
			runIn: ['text'],
			description: 'Make a user leave the voice channel',
			usage: '<member:member>',
			usageDelim: ' '
		});
	}

	async run(msg, [member]) {
        if (!member.voiceChannel) return msg.reply('this user is not in a voice channel.');
        const channel = await msg.guild.channels.create(`$$tempvc ${member.user.id}`, { type: 'voice', userLimit: 1, reason: 'vckick' });
        await member.setVoiceChannel(channel);
        await channel.delete();
        msg.channel.send('👌');
    }

};