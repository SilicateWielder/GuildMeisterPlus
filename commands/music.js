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
const dbCache = require('./../lib/dbCache.js');

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

	// Play media source
	async function streamAudioPath(vpath, msg = message) {	
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
	
	if(args.length == 0)
	{
		return(0);
	}
	
	if(args[0] == 'random')
	{
		let tracks = await dbCache.getMusic();
		
		let trackNum = Math.floor(Math.random() * tracks.length);
		
		let track = tracks[trackNum]
		
		message.channel.send(`Now playing ${track.title} posted by ${track.author}`);
		
		let audioPath = `./resources/cache/${track.id}.m4a`;
		ErrLog.log(audioPath);
		
		streamAudioPath(audioPath);
	} else {
		let cacheId = getParameterByName('v', args[0]);
		let cachePath = './resources/cache/' + cacheId + '.m4a';
		
		
		
		ErrLog.log("" + cachePath);
		
		// Play media source
		async function streamAudioDownloaded(vpath = cachePath, msg = message) {
			msg.channel.send('...finished caching!');
		
			streamAudioPath(vpath);
		}
		
		if (!fs.existsSync(cachePath)) {
			const options = ['--format=140']
			const info = null;
			const video = youtubedl(args[0], options, {cwd: __dirname});

			// Begin playing cached file.
			let vChannel = message.member.voiceChannelID;

			message.channel.send("caching video...");
			video.pipe(fs.createWriteStream(cachePath));
				
			video.on('end', streamAudioDownloaded);
		} else {
			streamAudioDownloaded();
		}
	}
}
