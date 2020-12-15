const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const distube = require('distube');

module.exports = class Musicord extends Client {
	constructor(client, player) {
		super(client);
		this.config = require('../../config.js');
		this.distube = new distube(this, player);
		this.utils = new (require('./Util.js'))(this);
		this.cmds = new Collection();
		this.cmdAlias = new Collection();
		this.cooldowns = new Collection();
		this.rateLimits = new Collection();
		// Memers Crib
		this.fakeHeists = new Collection();
		this.spawnedEvents = new Collection();
		this._setup();
	}

	_setup() {
		readdirSync(join(__dirname, '..', '..', 'cmds')).forEach(dir => {
			readdirSync(join(__dirname, '..', '..', 'cmds', dir)).forEach(cmd => {
				const command = require(join(__dirname, '..', '..', 'cmds', dir, cmd));
				this.cmds.set(command.props.name, command);
				command.props.aliases.forEach(alias => this.cmdAlias.set(alias, command));
				this.utils.log('Musicord', 'main', `Command: ${this.config.main.prefix[0]}${command.props.name}`);
			})
		});

		readdirSync(join(__dirname, '..', 'processes')).forEach(async lis => {
			await require(join(__dirname, '..', 'processes', lis)).run(this);
			this.utils.log('Musicord', 'main', `Listener: ${lis}`);
		});
	}
}