// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'misc',
	helpShort: 'Configure a setting for GuildMeister',
	helpLong: 'Configure a setting for GuildMeister'
}

let dbMain = require('./../lib/dbMain.js');

exports.command = async function(data)
{
    let args = data.args;
    let guild = data.message.guild.id;
    let message = data.message;

    if (args[0].toLowerCase() == 'welcome' || args[0].toLowerCase() == 'welcomemessage')
    {
      let cfg = await dbMain.getServerSettings(data.db, guild);
          
      let content = message.content.slice(12 + args[0].length);
      await dbMain.setServerSetting(guild, 'welcome_message', content);
    }

    if (args[0].toLowerCase() == 'strikelimit' && !isNaN(parseInt(args[1])))
    {
      let cfg = await dbMain.getServerSettings(data.db, guild);
      await dbMain.setServerSetting(guild, 'strike_banning_threshold', args[1]);
    }
}
