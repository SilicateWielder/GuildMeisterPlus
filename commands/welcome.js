// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: false,
	category: 'misc',
	helpShort: 'sends a welcome message to the user.',
	helpLong: 'Sends a suggestion to the local server, provided a suggestions channel has been set'
};

let dbMain = require('./../lib/dbMain.js');

// Sends the server's welcome message to the user.
exports.command = async function(data)
{
	let member = null;
	let guild = null;
	let byUser = false;
	
	// Obtain actual guild and member objects.
	if(data.message == null)
	{
		guild = data.member.guild.id;
		member = data.member;
	} else {
		member = data.message.member;
		guild = data.message.member.guild.id;
		byUser = true;
	}
	
	let customization = (await dbMain.getServerSettings(guild))[0];
	
	if(customization != undefined && customization.welcome_message != "NULL")
	{
		if(byUser)
		{
			data.message.reply("I've DM'd you with this server's welcome message.");
		}
		
		member.send(customization.welcome_message);
	};
};