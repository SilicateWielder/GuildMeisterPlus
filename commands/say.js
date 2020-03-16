// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: true,
	modAndUp: false,
	listed: true,
	category: 'misc',
	helpShort: 'Record stats, or view your\'s or someone else\'s',
	helpLong: 'Record and view your own stats, view someone else\'s, including GuildMeister'
}

exports.command = async function(data)
{	
	// Figure out the message to say.
	const sayMessage = data.args.join(" ");
	
	// Delete the command message.
	data.message.delete().catch(O_o=>{});
	
	// Say what the command said to say.
	data.message.channel.send(sayMessage);
}
