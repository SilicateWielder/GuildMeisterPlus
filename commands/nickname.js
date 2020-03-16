// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'utility',
	helpShort: 'Changes your nicnkame',
	helpLong: 'Changes your nicnkame'
}

let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
	let message = data.message;
	let member = message.member;
	let command = data.syntax;
	let argsRaw = data.argsRaw;
	let args = data.args;
	let client = data.client;
	
	let authorized = message.channel.guild.me.hasPermission("MANAGE_NICKNAMES");
	
	ErrLog.log("" + authorized);
	
	// Get the sender's name.
	if(args[0] != undefined && authorized)
	{
		let newNickname = argsRaw.replace('nickname ', '');
		
		let success = true;
		member.setNickname(newNickname)
		.then((e) => message.reply("Okay, I've set your nicnake to " + newNickname))
		.catch(
			function(e){
				message.channel.send("It seems I'm either missing a permission, or you outrank me. \nDiscord wont let me do this.");
				success = false;
			}
		);
	}
}
