// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: true,
	listed: true,
	category: 'general',
	helpShort: 'Pong!',
	helpLong: 'Returns the API and internet ping times for the bot.',
}

exports.command = async function(data)
{
	// This command removes all messages from all users in the channel, up to 100.
	
	// get the delete count, as an actual number.
	const deleteCount = parseInt(data.args[0], 10);
	
	// Ooooh nice, combined conditions. <3
	if(!deleteCount || deleteCount < 2 || deleteCount > 100)
		return data.message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
	
	// So we get our messages, and delete them. Simple enough, right?
	const fetched = await data.message.channel.fetchMessages({limit: deleteCount});
	
	data.message.channel.bulkDelete(fetched).catch(
		error => message.reply(`Couldn't delete messages because of: ${error}`)
	);
}
