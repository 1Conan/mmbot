const { Event } = require('klasa');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            enabled: true
        });
    }

    async run() {
        this.client.musicQueues = {};
        this.client.user.setActivity(`for @${this.client.user.username} | ${this.client.guilds.size} servers`, { type: 'WATCHING' });
    }

};