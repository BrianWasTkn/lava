import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'volume',
	aliases: ['set-volume'],
	description: 'set the volume of the current track.',
	usage: '<1-100: Number>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Parse */
	if (args.length <= 0) {
		return 'You need a percentage.'
	}

	/** Do the thing */
	try {
		const percent = !isNaN(args[0]) ? parseInt(args[0]) : 100;
		const queue = await bot.player.setVolume(message, percent)
		return `Successfully set the volume to **${queue.volume}%**`
	} catch(error) {
		log('commandError', 'volume', error)
		return error;
	}
})