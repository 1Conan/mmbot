const { Event } = require('klasa');

module.exports = class extends Event {

    async run(member) {
        const guild = member.guild;

        if (!guild.configs.autoRole.enabled) return;
        if (!guild.roles.get(guild.configs.autoRole.role)) return;
        if (!guild.me.permissions.has('MANAGE_ROLES')) return;

        await member.roles.add(guild.roles.get(guild.configs.autoRole.role).id, 'Auto role');
    }

};