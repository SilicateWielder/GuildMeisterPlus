const fs = require('fs');

// Run a command
exports.execute = function(commandRepo, commandName, data)
{
	if(commands[commandName] != undefined)
	{
		let canExecute = true;
		let adminOveride = false; // This will require permission to be granted by admin of a server in the future.
		
		let properties = commandRepo[commandName].properties
		
		let message = data.message;
		let guild = message.guild;
		
		// Perform permission checks.
		if(properties.adminOnly && message.author.id != guild.ownerID)
		{
			canExecute = false;
		}
		
		if(properties.devOnly && message.author.id != config.authorID)
		{
			canExecute = false;
		}
		
		// Temporary, replace this with a vote system
		// Mods must vote to authorise developer control, admin can grant immediate access
		if(message.author.id == config.authorID)
		{
			adminOveride = true;
		}
		
		// Now, if we have permission, run the command.
		if(canExecute || adminOveride)
		{
			ErrLog.log("RUN");
			try {
				commandRepo[commandName].command(data);
			} catch(err) {
				ErrLog.log(err);
			}
		} else {
			ErrLog.log("NOT RUN");
		}
	}
}

// Load in commands from a path and return them.
exports.findCommands = function(path)
{
	// Get the filelist.
	let fileList = fs.readdirSync(path);
	
	let commands = {};
	
	ErrLog.log("Loading commands from directory '".yellow + path + "'...".yellow);
	for(i = 0; i < fileList.length; i++)
	{
		let fileRaw = fileList[i];
		let file = fileRaw.split(".");
		
		commands[file[0]] = require('./../../commands/' + fileRaw);
		
		ErrLog.log("	...Loaded command \"".yellow + file[0] + "\"".yellow);
	}
	ErrLog.log("Loaded ".yellow + fileList.length + " commands located in '".yellow + path + "'\n".yellow);

	// Store the count for commands loaded.
	return [commands, fileList.length];
};

exports.initCommands = function(commandRepo)
{
	let keys = Object.keys(commandRepo);
	
	ErrLog.log("Initializing commands...");
	
	for(let i = 0; i < keys.length; i++)
	{
		let commandName = keys[i];
		let command = commandRepo[commandName];
		
		if(typeof command.init === "function")
		{
			command.init();
			ErrLog.log(`	...Initialized ${commandName}.js`);
		}
		
		
	}
	
	ErrLog.log("Commands Initialized.");
}