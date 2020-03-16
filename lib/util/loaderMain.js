const fs = require('fs');

// Set an appropriate message on startup.
exports.setDefaultStatus = function(client, config)
{
	if (config.devMode)
	{
		client.user.setActivity('in dev mode');
	} else {
		client.user.setActivity(`Running on ${client.guilds.size} servers`);
	}
}
