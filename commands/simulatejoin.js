// Command properties.
exports.properties = {
	devOnly: true,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'Triggers a \'new guildmember\' event.',
	helpLong: 'Triggers a \'new guildmember\' event.'
}

exports.command = async function(data)
{
	if(data.message.member.id === data.config.authorID)
	{
		data.client.emit("guildMemberAdd", data.message.member);
		data.message.reply("I've triggered a new join event");
	} else {
		data.message.reply("Sorry, this is a developer-only command");
	}
}
