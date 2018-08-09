const { Monitor } = require('klasa');
const invite = RegExp('(discordapp.com/invite|discord.me|discord.gg)(?:/#)?(?:/invite)?/([a-z0-9\-]+)');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreOthers: false,
            ignoreEdits: false,
            ignoreBlacklistedUsers: false,
        });
    }

    run(msg) {
        if (!msg.guild.configs.autoMod.blockInvites) return;
        if (!invite.test(msg.content.toLowerCase())) return;
        try { 
            msg.delete();
            // award a consequence?
            // log to mod-log channel?
        } catch (err) { /* do nothing if mmbot can't delete it */ }
    }

};