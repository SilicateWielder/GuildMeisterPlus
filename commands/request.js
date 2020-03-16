// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'Sends a feature suggestion to SilicateWielder.',
	helpLong: 'Sends a feature suggestion to SilicateWielder.'
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
		
		let request = argsRaw.slice(command.length);

		if (request == "")
		{
			message.channel.send(`Sorry, <@${identifier}>, you need to tell me what feature you'd like to request\n` + "`~request [description]` i.e `~request a shiny new iguana`");
		} else {
			message.channel.send("Thank you for your efforts <@" + identifier + ">! I've sent this feature request to SilicateWielder for you :)");
			channels.features.send("***FEATURE REQUEST FROM ***<@" + identifier + ">***:*** " + request);
		}
}
