exports.properties = {
	mode: 'default',
	text: ''
}

exports.set = function(mode, text)
{
	let newStat = "";
	
	if (mode == 'default' || mode == 'undefined')
	{
		if (config.devMode)
		{
			newStat = 'Running in dev mode';
		} else {
			newStat = `Running on ${client.guilds.size} servers`;
		}
	}
	
	if (mode == 'status' && text != "undefined")
	{
		newStat = text;
	}
	
	client.user.setStatus(newStat);
	return(newStat);
}