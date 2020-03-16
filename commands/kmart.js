// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'misc',
	helpShort: 'Play\'s K-Mart Radio in whatever voice channel you\'re in',
	helpLong: 'Play\'s K-Mart Radio in whatever voice channel you\'re in'
}

exports.command = async function(data)
{
	let message = data.message;
	let member = data.message.member;
	let client = data.client;

	let vChannel = message.member.voiceChannelID;

	if(message.member.voiceChannel)
	{
		const voice_connection = await message.member.voiceChannel.join();
		
		const dispatcher = voice_connection.playFile('./resources/radio/sample.mp3');
	}

	else
	{
		message.reply("I cannot stream K-Mart Radio to a text channel, dingus!");
	}
}
