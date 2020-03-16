// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: true,
	modAndUp: false,
	listed: true,
	category: 'utility',
	helpShort: 'Record stats, or view your\'s or someone else\'s',
	helpLong: 'Record and view your own stats, view someone else\'s, including GuildMeister'
}

let dbMain = require('./../lib/dbMain.js');

const DateSig = require('./../lib/util/datesig.js');

function dateSigToDate(dateSig)
{
	let date = {}
	date.year = dateSig.slice(6, 8);
	date.month = dateSig.slice(4, 6);
	date.day = dateSig.slice(0, 4);
	
	return date;
}

exports.command = async function(data)
{
	let client = data.client;
	let message = data.message;

	let args = data.args
	
	// Just retains support for the old '~stat pe' command, '~pe' can be called by itself now.
	if(args[0] == 'pe')
	{
		data.args.shift();
		commands['pe'].command(data);
	}

	else if (args[0] == 'bot')
	{
		let commandCount = Object.keys(commands).length;
		let commandPath = config.commandPath;
		let userCount = client.users.size;
		let chanCount = client.channels.size;
		let gildCount = client.guilds.size;
		let devMode = config.devMode;
		let ver = config.version;

		let uptimeSecs = Math.round(process.uptime());

		let uptimeMin = Math.round(uptimeSecs / 60);

		let uptimeHrs = Math.round(uptimeMin / 60);
		
		let uptimeDys = Math.round(uptimeHrs / 24);
		uptimeHrs = uptimeHrs - Math.floor(uptimeHrs/60);
		uptimeMin -= (uptimeHrs * 60);
		uptimeSecs -= (uptimeMin * 60);
		
		let uptimeMnt = Math.round(uptimeDys / 30.45);
		
		let uptimeYer = Math.round(uptimeMnt / 365);

		message.channel.send(`
		**GuildMeister's Status:** \`\`\`
		Development Mode: ${devMode}
		Version: ${ver}

		Loaded Commands: ${commandCount}
		Command Path: ${commandPath}

		Users: ${userCount}
		Channels: ${chanCount}
		Guilds: ${gildCount}

		Uptime: ${uptimeHrs} Hours, ${uptimeMin} Minutes, ${uptimeSecs} seconds
		\`\`\``);
	}
}
