import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'kill',
	aliases: ['shutdown'],
	description: 'shutdown your bot',
	usage: '[timeout]'
}, async (bot, args) => {

	try {
		if (args[0]) setTimeout(() => {}, Number(args[0]));
		await bot.destroy();
	} catch(error) {
		log('commandError', 'kill', error)
	}

})