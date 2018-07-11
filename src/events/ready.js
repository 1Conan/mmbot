const { Event } = require('klasa');

module.exports = class extends Event {

    async run() {
        this.client.musicQueues = {};
        this.client.user.setActivity(`for @${this.client.user.username} | ${this.client.guilds.size} servers`, { type: 'WATCHING' });
    }

};