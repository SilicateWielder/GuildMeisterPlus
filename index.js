// DungeonMeister Plus, written by SilicateWielder.
global.configPath = './config.json';
global.credentialPath = './credentials.json';

// Load in dependencies.
const fs = require('fs');
const colors = require('colors');
const Discord = require('discord.js');

// Load in custom dependencies.
const display = require('./lib/display.js'); //Required for the console UI.

// Load in configuration file.
global.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
global.config = Object.assign({}, global.config, JSON.parse(fs.readFileSync(credentialPath, 'utf8')));
global.dbLoginParameters = config.dbLoginParameters;
ErrLog.log(JSON.stringify(global.config));
ErrLog.log("Configuration loaded...\n");

global.cmdWrapper = require("./lib/wrappers/cmdWrapper.js");
global.status = require("./lib/wrappers/statWrapper.js");

// Load in database APIs
const dbMain = require("./lib/dbMain.js");
const dbUser = require("./lib/dbUser.js");

// Important variables.
global.commands = {};
let commandsCount = 0;
let ready = false;

// Update the version shown on the status panel.
updateStatus('Version', config.version);

// Alert the admin if we're in developer mode and update the mode status.
if (config.devMode)
{
	ErrLog.log("[Starting in developer mode...]\n".bold.red);
    updateStatus('Mode', ' Development '.bgRed);
}

// Initialize DiscordJS.
ErrLog.log("Initializing GuildMeister...");
global.client = new Discord.Client();

// Load in commands.
let commandsTemp = cmdWrapper.findCommands(config.commandPath);
global.commands = commandsTemp[0];
commandsCount = commandsTemp[1];

cmdWrapper.initCommands(global.commands);

// This Needs to be globally accessible.
// Otherwise bugs cannot be submitted through the bot.
global.channels = {};


client.on("ready", async () => {
	await dbMain.registerServers(client)
	ready = true;
	
	status.set('default');
	
	// Retrieve channels.
	channels["logs"] = client.channels.get(config.channelsLog);
	channels["bugs"] = client.channels.get(config.channelsBug);
	channels["features"] = client.channels.get(config.channelsFeatures);

	updateStatus('Users', client.users.size);
	updateStatus('Channels', client.channels.size);
	updateStatus('Guilds', client.guilds.size);
});

client.on("message", async message => {
	if(ready)
	{
		// If the message is from the bot or another bot, ignore it.
		if(message.author.bot)
		{
			return;
		}
		
		else
		{
			dbUser.registerUser(message.member, true)
		}
		
		// Run a check to register the server.
	    let justRegistered = await dbMain.registerServer(message.guild, true);
		
		if(justRegistered)
		{
			message.channel.send("It seems this is your first time using me on this server,\nyou'll need use the 'set channel' command to assign channels for certain commands.\n\nAdditionally, to automatically recieve news/notices/updates please run `~set channel news` within your news/announcements channel. \n\nFor help, contact <@270404393411674115>");
		}
		
		// If the message does not have a prefix, ignore it.
		if(message.content.indexOf(config.cmdPref) !== 0) return;
		
		// Grab all commands in message.
		let syntaxRaw = message.content.split(config.cmdPref);
		
		// Process commands.
		for(c = 1; c < syntaxRaw.length; c++)
		{		
			const argsRaw = syntaxRaw[c]; // Full command
			const args = argsRaw.trim().split(/ +/g); // Arguments.
			const syntax = args.shift().toLowerCase(); // Command.
			
			// Log the command sent in our private channel.
			channels.logs.send("***COMMAND***: " + message.author + " sent command `" + argsRaw + "` in channel `" + message.channel.name + "` on server `" + message.channel.guild.name + "`");
			
			
			let commandData = {
					'Discord': Discord,
					"client": client,
					"config": config,
					"message": message,
					"syntax": syntax,
					"args": args,
					"argsRaw": argsRaw,
					"channels": channels,
					"commandCount": commands.length
			};
			cmdWrapper.execute(commands, syntax, commandData);
		}
	}
});

// New member? Send out a welcome message if there is one.
client.on("guildMemberAdd", async member => {
	if(ready)
	{
		let commandData = {
			'Discord': Discord,
			"client": client,
			"config": config,
			"member": member
		}
		//cmdWrapper.execute(commands, 'welcome', commandData);
	}
});

// Reconnect to discord if disconnected.
client.on('disconnected', function() {
	// Log onto Discord.
	if(config.devMode)
	{
		client.login(config.devToken);
	} else {
		client.login(config.token);
	}
});

// Log onto Discord.
if(config.devMode)
{
	client.login(config.devToken);
} else {
	client.login(config.token);
}
