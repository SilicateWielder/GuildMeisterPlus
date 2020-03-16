// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'general',
	helpShort: 'Sends a bug report to the development discord',
	helpLong: 'Sends a bug report to the development discord'
}

let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
	let message = data.message;
	let command = data.syntax;
	let argsRaw = data.argsRaw;
	
	// Get the sender's name.
	let identifier = message.member.id;
	// Delete the message.
	message.delete().catch(O_o=>{});
	
	
	// Reply to the user and send the bug report.
		
		let report = argsRaw.slice(command.length);

		if (report == "")
		{
			message.channel.send(`Sorry, <@${identifier}>, you need to tell me what the problem is\n` + "`~bug [description]` i.e `~bug the bug command doesn't work :(`");
		} else {
			message.channel.send("Thank you for your efforts <@" + identifier + ">! I've sent this bug to SilicateWielder for you :)");
			channels.bugs.send("***BUG REPORT FROM ***<@" + identifier + ">***:*** " + report);
		}
}
