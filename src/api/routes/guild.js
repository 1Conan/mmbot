const express = require('express');
const router = module.exports = express.Router();
const client = require('../../index.js');

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ guild: null });
    return res.json({ guild: guild });
});

router.get('/:id/role/:role', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    const role = await guild.roles.get(req.params.role);
    if (!role) return res.status(404).json({ role: null });
    return res.json({ role });
});

router.get('/:id/roles', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    const roles = await guild.roles;
    return res.json({ roles });
});

router.get('/:id/channels', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    const channels = await guild.channels;
    return res.json({ channels });
});

router.get('/:id/owner', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ owner: null });
    return res.json({ owner: { id: guild.owner.user.id, username: guild.owner.user.username, tag: guild.owner.user.tag, discriminator: guild.owner.user.discriminator } });
});

router.put('/:id/prefix', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.prefix) return res.status(400).json({ error: 'no prefix provided' });
    if (typeof req.body.prefix !== 'string') return res.status(400).json({ error: 'prefix must be a string' });
    if (req.body.prefix.length > 10) return res.status(400).json({ error: 'prefix must be no longer than 10 characters' });

    guild.configs.update('prefix', req.body.prefix, guild);
    res.json({ response: 'updated prefix, see prefix property', prefix: guild.configs.get('prefix') });
});

router.put('/:id/nick', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.nick) req.body.nick = '';
    if (typeof req.body.nick !== 'string') return res.status(400).json({ error: 'nickname must be a string' });
    if (req.body.nick.length > 32) return res.status(400).json({ error: 'nickname must be no longer than 32 characters' });
    if (!guild.me.hasPermission('CHANGE_NICKNAME')) return res.status(403).json({ error: 'bot missing change nickname permission' });
    guild.me.setNickname(req.body.nick);
    guild.configs.update('nickname', req.body.nick.length < 1 ? null : req.body.nick, guild);
    res.json({ response: 'updated nickname, see nick property', nick: guild.configs.get('nick') });
});

// djRole must be a role ID!
router.put('/:id/roles/djrole', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.djRole) return res.status(400).json({ error: 'no role provided' });
    if (typeof req.body.djRole !== 'string') return res.status(400).json({ error: 'role id must be a string' });

    const role = await guild.roles.get(req.body.djRole);
    if (!role) return res.status(404).json({ error: 'invalid role' });

    await guild.configs.update('roles.djRole', role, guild);
    return res.json({ response: 'updated djRole, see djRole property', djRole: role.id });
});

// modRole must be a role ID!
router.put('/:id/roles/modrole', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.modRole) return res.status(400).json({ error: 'no role provided' });
    if (typeof req.body.modRole !== 'string') return res.status(400).json({ error: 'role id must be a string' });

    const role = await guild.roles.get(req.body.modRole);
    if (!role) return res.status(404).json({ error: 'invalid role' });

    await guild.configs.update('roles.modRole', role, guild);
    return res.json({ response: 'updated modRole, see djRole property', modRole: role.id });
});

// STARBOARD

router.put('/:id/starboard/self', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.allowed) return res.status(400).json({ error: 'no "allowed" property provided' });
    if (typeof req.body.allowed !== 'boolean') return res.status(400).json({ error: '"allowed" property must be a boolean' });

    await guild.configs.update('starboard.allowSelfStar', req.body.allowed, guild);
    return res.json({ response: 'updated allowSelfStar, see allowSelfStar property', allowSelfStar: guild.configs.starboard.allowSelfStar });
});

router.put('/:id/starboard/emoji', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.emoji) return res.status(400).json({ error: 'no emoji provided' });
    if (typeof req.body.emoji !== 'string') return res.status(400).json({ error: 'emoji must be a string' });
    if (!guild.configs.premium) return res.status(403).json({ error: 'custom emojis are limited' });

    await guild.configs.update('starboard.emoji', req.body.emoji, guild);
    return res.json({ response: 'updated emoji, see emoji property', emoji: guild.configs.starboard.emoji });
});

router.put('/:id/starboard/enabled', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (req.body.enabled == null || req.body.enabled == undefined) return res.status(400).json({ error: 'no "enabled" property provided' });
    if (typeof req.body.enabled !== 'boolean') return res.status(400).json({ error: '"enabled" property must be a boolean' });

    await guild.configs.update('starboard.enabled', req.body.enabled, guild);
    return res.json({ response: `${guild.configs.starboard.enabled ? 'enabled starboard' : 'disabled starboard'}`, enabled: guild.configs.starboard.enabled });
});

router.put('/:id/starboard/minimum_stars', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.minimum_stars) return res.status(400).json({ error: 'no minimum_stars provided' });
    if (typeof req.body.minimum_stars !== 'number') return res.status(400).json({ error: 'minimum_stars must be a number' });
    if (req.body.minimum_stars < 1 || req.body.minimum_stars > 10) return res.status(400).json({ error: 'must be between 1 and 10' });

    await guild.configs.update('starboard.minimumStars', req.body.minimum_stars, guild);
    return res.json({ response: 'updated minimum stars, see minimum_stars property', minimum_stars: guild.configs.starboard.minimumStars });
});

router.put('/:id/starboard/channel', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.channel) return res.status(400).json({ error: 'no channel provided' });
    if (typeof req.body.channel !== 'string') return res.status(400).json({ error: 'channel id must be a string' });
    const channel = await client.channels.get(req.body.channel);
    if (!channel) return res.status(404).json({ error: 'invalid channel' });

    await guild.configs.update('starboard.starboardChannel', req.body.channel, guild);
    return res.json({ response: 'updated starboard channel, see channel property', channel: guild.configs.starboard.starboardChannel });
});


// AUTO ROLE

router.put('/:id/autorole/role', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (!req.body.autoRole) return res.status(400).json({ error: 'no role provided' });
    if (typeof req.body.autoRole !== 'string') return res.status(400).json({ error: 'role id must be a string' });

    const role = await guild.roles.get(req.body.autoRole);
    if (!role) return res.status(404).json({ error: 'invalid role' });

    await guild.configs.update('autoRole.role', role, guild);
    return res.json({ response: 'updated role, see autoRole property', autoRole: role.id });
});

router.put('/:id/autorole/enabled', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'no guild id passed' });
    const guild = await client.guilds.get(req.params.id);
    if (!guild) return res.status(404).json({ error: 'invalid guild' });
    if (req.body.enabled == null || req.body.enabled == undefined) return res.status(400).json({ error: 'no "enabled" property provided' });
    if (typeof req.body.enabled !== 'boolean') return res.status(400).json({ error: '"enabled" property must be a boolean' });

    await guild.configs.update('autoRole.enabled', req.body.enabled, guild);
    return res.json({ response: `${guild.configs.autoRole.enabled ? 'enabled auto role' : 'disabled auto role'}`, enabled: guild.configs.autoRole.enabled });
});