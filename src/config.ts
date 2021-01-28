import Lava from 'discord-akairo'

const config: Lava.Config = {
	// Bot
	lava: {
		devMode: false,
		prefix: ["lava", ";;"],
		token: process.env.TOKEN,
		akairo: {
			ownerID: ['605419747361947649']
		},
		client: {
			disableMentions: 'everyone',
			fetchAllMembers: false,
			ws: {
				intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']
			}
		}
	},
	// Currency
	currency: {
		caps: {
			minBet: 420,
			maxBet: 500000,
			maxWin: 2222222,
			maxPocket: 15000000,
			maxMulti: 150
		},
		emojis: [
			['clown', 1.1234310],
			['eyes', 1.3654613],
			['alien', 1.5646046],
			['peach', 1.8642608],
			['star2', 2.14641060],
			['flushed', 2.3564610],
			['medal', 2.63464804],
			['trophy', 3.288604160],
			['fire', 3.85641601]
		]
		// emojis: [
		// 	{ emoji: 'clown', winnings: 0.50451345 },
		// 	{ emoji: 'eyes', winnings: 0.64646045 }, 
		// 	{ emoji: 'alien', winnings: 0.84546106 }, 
		// 	{ emoji: 'peach', winnings: 1.032563624 }, 
		// 	{ emoji: 'star2', winnings: 1.25504585 }, 
		// 	{ emoji: 'flushed', winnings: 1.30845608 }, 
		// 	{ emoji: 'medal', winnings: 1.5056438 }, 
		// 	{ emoji: 'trophy', winnings: 1.88025581 }, 
		// 	{ emoji: 'fire', winnings: 2.0638134 }
		// ]
	},
	// Spawns
	spawns: {
		cooldown: 60,
		enabled: true,
		blacklisted: {
			users: [],
			channels: [
				// Public Chat
				'791659327148261406',
				'801471120192438312',
				'801413467080622120',
				'692923254872080395',
				'756101559938449449',
				'796019885775126560',
				'691597490411012137',
				// Dank Memer
				'691594488103305216',
				'692547222017015828',
				'691595376524001290',
				'694697159848886343'
			],
			categories: [],
			guilds: []
		},
		whitelisted: {
			users: [],
			channels: [],
			categories: [
				'691416705917780000', 
				'691595121866571776', 
				'791576124185378817',
				'724618509958774886'
			],
			guilds: []
		}
	}
}

export default config;