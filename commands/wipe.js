// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: false,
	category: 'utility',
	helpShort: 'Clear all of your records from the bot (Not including moderation/strike logs)',
	helpLong: 'Clear all of your records from the bot (Not including moderation/strike logs)'
};

let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
	let client = data.client;
	let message = data.message;
	let guildId = message.channel.guild.id;
	let command = data.syntax;
	let args = data.args;
	let argsRaw = data.argsRaw;
};