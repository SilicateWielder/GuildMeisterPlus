// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'general',
	helpShort: 'Send an application to the server',
	helpLong: 'Sends an application to the local server, assuming an applications channel is set.'
}


let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
	let client = data.client;
	let message = data.message;
    let guildId = message.channel.guild.id;
	let command = data.syntax;
	let argsRaw = data.argsRaw;
	
	// Find application channel Id.
	let cfg = await dbMain.getServerChannels(guildId);
	
	// Get the sender's name.
	let identifier = message.member.id;
	// Delete the message.
	message.delete().catch(O_o=>{});
	
	
	// Reply to the user.
	if(cfg.Applications != 0)
	{
		message.channel.send("Thank you for your application! <@" + identifier + "> It has been filed for review.");

		let chn = client.channels.get(cfg[0].channel_applications);
		
		chn.send("***APPLICATION  FROM ***<@" + identifier + ">***:*** " + argsRaw.slice(command.length));
	} else {
		message.reply("it seems that no suggestion channel has been set for this server, please contact an admin or set it yourself.");
	}
}
