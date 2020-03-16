// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'Sends a suggestion to the local server.',
	helpLong: 'Sends a suggestion to the local server, provided a suggestions channel has been set'
}

let dbMain = require('./../lib/dbMain.js');

function suggestionMenu(msg)
{
	msg.react("👍");
	msg.react("👎");
}

exports.command = async function(data)
{
	let client = data.client;
	let message = data.message;
    let guildId = message.channel.guild.id;
	let command = data.syntax;
	let argsRaw = data.argsRaw;
	
	// Find suggestion channel Id.
	let cfg = await dbMain.getServerChannels(guildId);
	
	// Delete the message.
	message.delete().catch(O_o=>{});
	
	// Reply to the user.
	if(cfg.channels_suggestions != 0)
	{
		message.channel.send("Thank you for your suggestion! It has been filed to be voted on.");

		let chn = client.channels.get(cfg[0].channel_suggestions);
		chn.send("***SUGGESTION***: " + argsRaw.slice(command.length));

		const m = await chn.send("Please Vote:");
		suggestionMenu(m);
	} else {
		message.reply("it seems that no suggestion channel has been set for this server, please contact an admin or set it yourself.");
	}
}
