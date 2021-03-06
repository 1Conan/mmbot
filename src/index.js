const { Client, PermissionLevels } = require('klasa');
const { token, prefix, idiotApiKey } = require('../config.json');
const Idiot = require('idiotic-api');

const client = module.exports = new Client({
    clientOptions: {
        disableEveryone: true
    },
    prefix,
    permissionLevels: new PermissionLevels()
        .add(0, () => true)
        .add(4, (client, msg) => msg.member.roles.some(r => r.id == msg.guild.configs.get('djRole')))
        .add(5, (client, msg) => msg.member.roles.some(r => r.id == msg.guild.configs.get('modRole')))
        .add(6, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'), { fetch: true })
        .add(7, (client, msg) => msg.guild && msg.member.id === msg.guild.owner.id, { fetch: true })
        .add(9, (client, msg) => msg.author.id == client.owner.id, { break: true })
        .add(10, (client, msg) => msg.author.id == client.owner.id),
    disabledCorePieces: ['commands'],
    cmdEditing: true,
    typing: true,
    gateways: {
        guilds: { provider: 'rethinkdb' },
        users: { provider: 'rethinkdb' },
        clientStorage: { provider: 'rethinkdb' }
    },
    providers: { rethinkdb: { db: 'mmbot' } },
    readyMessage: (client) => '[client] ' + client.user.tag + ' is ready :)'
});

client.idiot = new Idiot.Client(idiotApiKey, { dev: true });

client.login(token);
require('./api/api.js')();
// console.log('[api] starting in 6 seconds');
// setTimeout(require('./api/api.js'), 6000, client);
