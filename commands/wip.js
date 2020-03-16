// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'developer',
	helpShort: 'View the developer\'s WIP changelog for future releases',
	helpLong: 'View the developer\'s WIP changelog for future releases'
}

let dbMain = require('./../lib/dbMain.js');

let fs = require('fs');

exports.command = async function(data)
{
	let message = data.message;
	
	let roadmap = '';
	
	roadmap = fs.readFileSync('./wip.txt', 'utf8');
	
	message.channel.send("Current WIP changelog: \n```" + roadmap + "```");
}
