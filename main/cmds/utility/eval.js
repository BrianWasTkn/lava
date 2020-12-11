const { Util } = require('discord.js');
const { inspect } = require('util');

function sanitize(str) {
	return Util.escapeMarkdown(str);
}

function codeBlock(str, lang = 'js') {
	return `\`\`\`${lang}\n${str}\n\`\`\``;
}

module.exports = {
	name: 'ping',
	aliases: ['pong'],
	permissions: ['ADMINISTRATOR'],
	execute: async ({ msg, args }) => {
		const { channel } = msg;
		const code = args.join(' ');
		const asynchronous = ['return', 'await'].includes(code);
		let before, evaled, evalTime, type, token, result;

		before = Date.now();
		try {
			evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
		} catch(error) {
			evaled = error;
		}
		evalTime = Date.now() - before;
		type = typeof evaled;

		if (type !== 'string') {
			try {
				evaled = inspect(evaled, { depth: 0 });
			} catch(error) {
				evaled = error;
			}
		}

		result = sanitize(evaled);
		token = new RegExp(ctx.config.main.token, 'gi');
		result = result.replace(token, 'N0.T0K4N.4Y0U');
		await channel.send({ embed: {
			color: 'BLUE',
			description: codeBlock(result),
			fields: [
				{ name: 'Type', value: codeBlock(type) },
				{ name: 'Latency', value: codeBlock(`${evalTime}ms`) }
			]
		}}).catch(console.error);
	}
}