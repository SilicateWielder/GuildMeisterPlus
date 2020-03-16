1// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'general',
	helpShort: 'Display\'s this help listing, and more!',
	helpLong: 'add the name of a command, or a command category to get that listing or command\'s details'
}

global.helpMenu = {};

// Generate the help menu listing.
exports.init = async function()
{
	ErrLog.log("	Initializing help.js");
	ErrLog.log("		...building help menu");
	
	let cmds = global.commands;
	let keys = Object.keys(cmds);
	
	
	ErrLog.log(JSON.stringify(keys));
	for(let i = 0; i < keys.length; i++)
	{
		let currentCommand = keys[i]
		let category = global.commands[currentCommand].properties.category;
		
		if(category === "undefined")
		{
			category = "unassigned";
		}
		
		if(global.helpMenu[category] == undefined)
		{
			global.helpMenu[category] = {};
		}
		
		global.helpMenu[category][currentCommand] = global.commands[currentCommand].properties.helpShort;
	}
	
	ErrLog.log("" + JSON.stringify(global.helpMenu));
}

exports.command = async function(data)
{
	
	let text = `Main help menu for ${global.config.version}:\n`;
	
	let categories = Object.keys(global.helpMenu);
	
	for(i = 0; i < categories.length; i++)
	{
		let categoryName = categories[i]
		let category = global.helpMenu[categoryName];
		
		let commands = Object.keys(category);
		
		text += `***${categoryName}***:\n`;
		
		for(cmd = 0; cmd < commands.length; cmd++)
		{
			let commandName = commands[cmd];
			let commandText = category[commandName];
			text += `	\`${commandName}\` - ${commandText}\n`;
		}
	}
	
	data.message.channel.send("test" + text);
}
