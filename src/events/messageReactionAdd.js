const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { webUri } = require('../../config.json');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            enabled: true
        });
    }

    /* 
        Notes to self tomorrow:
        3. (done, but leaving here for reference) the starboard SchemaFolder must have the following:
            - is the starboard enabled or not?
            - starboard channel id
            - minimum stars for starboard
            - (maybe for premium guilds??) custom starboard emoji
            - array of blacklisted users?
            - is self-starring allowed???
        4. rowboat's starboard can inspire you - check discordboats.club #starboard
        5. do the DJ role giveaway later on in the day
        6. maybe do the skip and forceskip commands
        7. do the starboard and dash page for it... starboard is below, currently unfinished
        8. maybe get started on tags?? :o
        9. i really hope you read this. good morning, if you do!
        10. maybe do guild logs and some more cool stuff
    */
    async run(reaction, user) {
        const msg = reaction.message;
        if (!msg.guild || msg.system) return;
        const starboardConfig = await msg.guild.configs.starboard;
        const starboardChannel = await this.client.channels.get(starboardConfig.starboardChannel);

        if (reaction.emoji.toString() == starboardConfig.emoji && msg.embeds.length < 1) { // Someone is trying to star a message
            if (!starboardConfig.enabled 
                || !starboardChannel 
                || !starboardChannel.permissionsFor(msg.guild.me).has('SEND_MESSAGES') 
                || !starboardChannel.permissionsFor(msg.guild.me).has('EMBED_LINKS') 
                || !starboardChannel.permissionsFor(msg.guild.me).has('USE_EXTERNAL_EMOJIS')) return;
            if (starboardConfig.starredMessages.includes(msg.id)) return;
            if (user.id == msg.author.id) return reaction.users.remove(user.id); // Self-starring is bad
            if (reaction.count >= starboardConfig.minimumStars) { // by default this is 3 - minimum 1 maximum 10
                // ok, let's star it!
                const embed = new MessageEmbed();
                embed.setAuthor(msg.author.username, msg.author.avatarURL());
                embed.setDescription(msg.content);
                embed.setColor('RANDOM');
                embed.setFooter(new Date(msg.createdTimestamp).toDateString());
                starboardChannel.send(`${starboardConfig.emoji.toString()} ${reaction.count} ${msg.channel.toString()} (${msg.id})`, { embed, files: msg.attachments.first() ? msg.attachments.map(a => ({ name: a.filename, attachment: a.url })) : null });
                msg.guild.configs.update('starboard.starredMessages', msg.id, msg.guild)
            }
        }

    }

};