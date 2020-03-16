// Command properties.
exports.properties = {
	devOnly: true,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'Sends out an inter-server announcement',
	helpLong: 'Sends out an inter-server announcement'
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
	if(identifier == config.authorID)
	{
		let announcement = argsRaw.slice(command.length);;
		let qeue = await dbMain.getAnnouncementChannels();

		for(chan = 0; chan < qeue.length; chan++)
		{
			let channelId = qeue[chan].channel_news
			if (channelId != 0 && announcement != '')
			{
				let channel = client.channels.get(channelId);

				try {
					channel.send("**GUILDMEISTER NEWS:** \n```" + announcement + "```");
				} catch(err) {};
			}
		}
	} else {
		message.reply("I can't let you do that, this is a developer-only command.");
	}
}
