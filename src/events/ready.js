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

        setInterval(() => { 
            this.client.user.setActivity(`for @${this.client.user.username} | ${this.client.guilds.size} servers`, { type: 'WATCHING' });

            if (!lists.post) return false;

            if (lists.botsdiscordpw.length > 1) {
                const botsdiscordpw = await fetch(`https://bots.discord.pw/api/bots/${this.client.id}/stats`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': lists.botsdiscordpw },
                    body: JSON.stringify({ server_count: this.client.guilds.size })
                });
                if (!botsdiscordpw.ok) this.client.console.wtf('AHHHH THERE WAS AN ERROR WHILE POSTING STATS TO BOTSDISCORDPW');
            }
        }, 60000 * 25);
    }

};