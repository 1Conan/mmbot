const { Extendable } = require('klasa');

module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { appliesTo: ['GuildMember'] });
    }

    extend(level) {
        switch(level) {
            case 0:
                return true;
            case 4:
                return this.roles.find(r => r.id == this.guild.configs.get('djRole'));
            case 5:
                return this.roles.find(r => r.id == this.guild.configs.get('modRole'));
            case 6:
                return this.permissions.has('MANAGE_GUILD');
            case 7:
                return this.user.id == this.guild.owner.id;
            case 9:
            case 10:
                return this.user.id == this.client.owner.id;
            default:
                return undefined;
        }
    }

};