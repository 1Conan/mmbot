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

    await guild.configs.update('djRole', role, guild);
    return res.json({ response: 'updated djRole, see djRole property', djRole: role.id });
});