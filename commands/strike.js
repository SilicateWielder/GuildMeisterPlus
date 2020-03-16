// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: true,
	listed: true,
	category: 'moderation',
	helpShort: 'Applies and removes strikes on a user.',
	helpLong: 'Applies and removes strikes on a user.'
}

let dbMain = require('./../lib/dbMain.js');
let dbUser = require('./../lib/dbUser.js');

let DateSig = require('./../lib/util/datesig.js');

exports.help = 'give and remove strikes from users';

exports.properties = {
	devOnly: false
}

exports.command = async function(data)
{
    let args = data.args;
	let message = data.message;
    let user = message.member;
    let mention = message.mentions.users.first();
	let client = data.client;
	
	let userName = user.user.username;
	let mentionName = mention.username;
	
	let guildId = message.channel.guild.id;
	
    
    let isAdmin = user.hasPermission('ADMINISTRATOR', true, false);
    let canBan = user.hasPermission('BAN_MEMBERS', true, false);
    let canKick = user.hasPermission('KICK_MEMBERS', true, false);
	
    if(isAdmin || canBan || canKick)
    {
		let cfg = await dbMain.getServerChannels(guildId);
		let logchn = client.channels.get(cfg[0].channel_modlogs);
		
        if (mention != undefined && args[0] != 'get' && args[0] != 'subtract')
        {
			let date = DateSig.current();
			let reason = ("" + data.message).substring(31);

			if(reason != "")
			{				
				let bannable = await dbUser.addStrike(mention, message, reason, date);

				if(bannable)
				{
					message.reply(mention.username + " has exceeded the strike limit, and should be banned.")
				} else {
					message.reply(` i've added a strike to ${mention.username}`);
				}
				
				if(cfg.channels_modlog != 0 && logchn != undefined)
				{
					logchn.send("***STRIKE***: " + ` ${userName} added a strike to ${mentionName} | ***REASON:*** \`${reason}\``);
				}
			} else {
				message.channel.send(`Sorry, ${userName}, you need to supply a reason for adding a strike`);
			}
        }

        else if (mention != undefined && args[0] == 'get')
        {
            let count = await dbUser.getGlobalStrikes(mention);

            message.reply(mention.username + ' Has ' + count + ' strikes.');
        }

    	else if (mention != undefined && args[0] == 'subtract')
	    {
			let date = DateSig.current();
			let reason = ("" + data.message).substring(39);
			
			if(reason != "")
			{
				message.reply(` i've removed a strike from ${mention.username}`);
				await dbUser.subStrike(mention, message, reason, date);
				
				if(cfg.channels_modlog != 0)
				{
					logchn.send("***STRIKE***: " + ` ${userName} removed a strike from ${mentionName} | ***REASON:*** \`${reason}\``);
				}
			} else {
				message.channel.send(`Sorry, ${userName}, you need to supply a reason for removing a strike`);
			}
	    }

        else if (mention == undefined)
        {
            message.reply("Sorry, you've not mentioned a user!");
        }
    }

    else
    {
        message.reply('sorry, you dont have permission to ban/strike people.');
    }
}