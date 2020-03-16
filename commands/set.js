// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: true,
	modAndUp: false,
	listed: true,
	category: 'administrator',
	helpShort: 'Assign a channel within the local server',
	helpLong: 'Assign a channel within the local server'
}

let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
	let client = data.client;
	let message = data.message;
	let guildId = message.channel.guild.id;
	let command = data.syntax;
	let args = data.args;
	let argsRaw = data.argsRaw;
	
	if(args.length > 1 && message.member.id === config.authorID)
	{
		// set status check.
		if (args[0] === "status")
		{
			let subArg = argsRaw.slice(command.length + 7);
			let newStat = "";
			
			
			if(subArg == " default")
			{
				global.status.set('default');
			} else {
				global.status.set('status', subArg);
			}
			
			message.channel.send(`Alright, ${message.author}, I've updated my status to \`${subArg}\``);
		}
		
		//Assign channel check.
		else if (args[0] === "channel")
		{
			let channelType = 'channel_' + args[args.length - 1];
			let cfg = await dbMain.getServerChannels(guildId);
			
			if(cfg[0][channelType] != undefined)
			{
				await dbMain.setServerChannel(guildId, channelType, message.channel.id);
			} else {
				message.reply(channelType + " is an invalid channel type, you'll have to try again.");
			}
		}
	} else if (message.member.id === config.authorID)
	{
		message.channel.send(`Sorry, I can't let you do that, ${message.author} ***bonk***`);
	}
}
