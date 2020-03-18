// Command properties.
exports.properties = {
	devOnly: true,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'misc',
	helpShort: '[DEV ONLY][TESTING] Plays music from youtube.',
	helpLong: '[DEV ONLY][TESTING] Plays music from youtube.'
}

const fs = require('fs');
const youtubedl = require('youtube-dl');

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

exports.command = async function(data)
{
	let message = data.message;
	let member = data.message.member;
	let client = data.client;
	let args = data.args;


	let resourceURL = './resources/radio/sample.mp3';
	
	if(args[0] == undefined)
	{
		return(0);
	}
	
	let cachePath = './resources/cache/' + getParameterByName('v', args[0]) + '.mp4';
	
	ErrLog.log("" + cachePath);
	
	// Play media source
	async function streamAudio(vpath = cachePath, msg = message) {
		msg.channel.send('...finished caching!');
	
		if(message.member.voiceChannel)
		{
			const voice_connection = await message.member.voiceChannel.join();
			
			const dispatcher = voice_connection.playFile(vpath);
		}
		else
		{
			message.reply("I cannot stream music to a text channel, dingus!");
		}
	}
	
	if (!fs.existsSync(cachePath)) {
		const options = ['--format=18']
		const info = null;
		const video = youtubedl(args[0], options, {cwd: __dirname});

		// Begin playing cached file.
		let vChannel = message.member.voiceChannelID;

		message.channel.send("caching video...");
		video.pipe(fs.createWriteStream(cachePath));
			
		video.on('end', streamAudio);
	} else {
		streamAudio();
	}
}
