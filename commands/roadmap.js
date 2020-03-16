// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'View the developer\'s roadmap',
	helpLong: 'View the developer\'s roadmap'
}

let dbMain = require('./../lib/dbMain.js');

let fs = require('fs');

exports.command = async function(data)
{
	let message = data.message;
	
	let roadmap = '';
	
	roadmap = fs.readFileSync('./roadmap.txt', 'utf8');
	
	message.channel.send("Current Roadmap: \n```" + roadmap + "```");
}
