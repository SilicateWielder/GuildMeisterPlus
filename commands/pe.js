exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'utility',
	helpShort: 'Changes your nickname',
	helpLong: 'Changes your nickname'
}

const dbMain = require('./../lib/dbMain.js');
const dbUser = require('./../lib/dbUser.js');
const dbPe = require('./../lib/dbPe.js');
let statPe = require('./../lib/statPe.js');

const units = {'"' : 1, 'in': 1, 'inch': 1, 'inches': 1, 'cm': 0.393701, 'centimeter': 0.393701, 'centimeters': 0.393701};
const types = ['BPEL', 'BPFL', 'BPFSL', 'MSEG', 'MSFG', 'BSEG', 'BSFG']
const dateMatrix = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const monthIndex = {'jan' : '01', 'feb' : '02',	'mar' : '03', 'apr' : '04', 'may' : '05', 'jun' : '06', 'jul' : '07', 'aug' : '08', 'sep' : '09', 'oct' : '10', 'nov' : '11', 'dec' : '12',
					'january' : '01', 'february' : '02', 'march' : '03', 'april' : '04', 'june' : '06', 'july' : '07', 'august' : '08', 'september' : '09', 'october' : '10', 'november' : '11', 'december' : '12'};

function padouble(number)
{
	if (number.length == 1)
	{
		return '0' + number;
	}

	return number;
}

exports.command = async function(data)
{
	let message = data.message;
	let sid = message.channel.guild.id;
	let user = message.member;
	let uid = user.id;
	
	let serverConfig = await dbMain.getServerSettings(sid);
	let peEnabled = serverConfig[0][0].enabled_pe;

	// If this command is not enabled, do nothing.
	if(peEnabled != 1 || message.channel.nsfw == false)
	{
		return;
	}
	
	// If everything is good, lets continue.dbMain
	if (data.args[0] == 'getsy'){
		// If soemone was mentioned, do this instead.
		let table = null;
		let img = null;
		let mention = message.mentions.users.first();
		if(mention != undefined)
		{
			table = await dbPe.getRecords(mention);
			img = await statPe.drawStats(mention, table);
		} else {
			table = await dbPe.getRecords(user.user);
			img = await statPe.drawStats(user, table);
		}

		let buf = await new data.Discord.Attachment(img, 'stat.png');
		message.reply("here are your stats!",  buf);
	}

	else if (data.args[0] == 'graph'){
		// If soemone was mentioned, do this instead.
		let table = null;
		let img = null;
		let mention = message.mentions.users.first();
		if(mention != undefined)
		{
			table = await dbPe.getRecords(mention);
			table.key = types;
			
			img = await statPe.drawGraphedStats(mention, table);
		} else {
			table = await dbPe.getRecords(user.user);
			table.key = types;
			
			img = await statPe.drawGraphedStats(user, table);
		}

		let buf = await new data.Discord.Attachment(img, 'chart.png');
		message.reply("here is your growth chart!",  buf);
	}

	else if(data.args[0] == 'clear')
	{
		// Confirm entry.
		let m = await message.channel.send(`<@${uid}> **Are you sure you want to clear your records? This is irreversible. (Thumbs up for yes, thumbs down for no.)`);
		let reactions = ["👍", "👎"];
		
		await m.react("👍");
		await m.react("👎");
		
		// Create filter for answer.
		const filter = (reaction, user) => {
			return reactions.includes(reaction.emoji.name) && user.id == uid;
		}
		
		// Gather confirmation value.
		let answer = await m.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();
			m.delete(10);
			return reactions.indexOf(reaction.emoji.name);
		})
		.catch(collected => { m.delete(10);	return(-1);});

		// Turn our value into something useable!
		if(answer == 0)
		{
			dbPe.clearRecords(user);
		}
	}
	else if(data.args[0] == 'record' || data.args[0] == 'add' || data.args[0] == 'log')
	{
		if(data.args[1] != undefined)
		{
			// Get the current date.
			let date = {};
			date.current = (new Date(Date.now())).toISOString();
			date.y = date.current.slice(0, 4);
			date.m = date.current.slice(5, 7);
			date.d = date.current.slice(8, 10);

			let measureType = null;
			let measure = 0;
			
			let argsType = data.args[1];
			let argsMesr = data.args[2];
			
			// Determine the type of measurement being made.
			if(types.includes(argsType))
			{
				measureType = argsType;
			}
			
			else
			{
				message.reply("'" + argsType + "' is not a valid type of measurement, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}
			
			// Ensure measurement is actually a number.
			if(!isNaN(parseFloat(argsMesr)))
			{
				measure = parseFloat(argsMesr).toFixed(2);
			}
			
			else
			{
				message.reply("'" + argsMesr + "' is not a valid measurement, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}
			
			// Check if there is a unit defined.
			let argOffset = 0;
			if(units[data.args[3]] != undefined)
			{
				measure = measure * units[data.args[3]];
				argOffset = 1;
			}
			
			// Gather date arguments.
			let argsYear = 0;
			let argsMnth = '';
			let argsDay = 0;


			if (data.args[3 + argOffset] == undefined)
			{
				argsDay = date.d;
				argsMnth = dateMatrix[parseInt(date.m) - 1];
				argsYear = date.y;
			}
			else if(data.args[3 + argOffset].length <= 2)
			{
				argsDay = data.args[3 + argOffset];
				argsMnth = data.args[4 + argOffset].toLowerCase();
				argsYear = data.args[5 + argOffset];
			}

			else if(data.args[3 + argOffset].length == 3)
			{
				argsDay = data.args[4 + argOffset];
				argsMnth = data.args[3 + argOffset].toLowerCase();
				argsYear = data.args[5 + argOffset];
			} 
			else {
				message.reply("you've entered an invalid date, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}

			// Check if year exists and is valid.
			if(argsYear == undefined || isNaN(parseFloat(argsYear)) || argsYear > date.y)
			{
				message.reply("'" + argsYear + "' is not a valid year, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}

			// Check if month exists and is valid.
			if((monthIndex[argsMnth] == undefined && isNaN(parseFloat(argsMnth))) || argsMnth > 12)
			{
				message.reply("'" + argsMnth + "' is not a valid month, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}

			// Check if day exists and is valid.
			if(isNaN(parseFloat(argsDay)) || argsDay > 31)
			{
				message.reply("'" + argsDay + "' is not a valid day, please try again.").then(msg => {msg.delete(10000)});
				return(0);
			}

			measure = parseFloat(measure).toFixed(2);

			// Confirm entry.
			let m = await message.channel.send("<@" + uid+ "> **Are you sure this is correct?:\n" + `${measure} inches on ${argsMnth} ${argsDay} ${argsYear}`);
			let reactions = ["👍", "👎"];
			
			await m.react("👍");
			await m.react("👎");
			
			// Create filter for answer.
			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id == uid;
			};
			
			// Gather confirmation value.
			let answer = await m.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
				m.delete(10);
				return reactions.indexOf(reaction.emoji.name);
			})
			.catch(collected => { m.delete(10);	return(-1);});

			// Turn our value into something useable!
			if(answer == 0)
			{
				dbPe.addRecord(message, measureType, measure, padouble(argsDay), monthIndex[argsMnth], argsYear);
				message.reply("Okay, I've filed this update!").then(msg => {
					msg.delete(10000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
			} else {
			}
		} else {
			message.channel.send("You've made an error, or didn't specify any parameters.");
		}
	}

	// Set the user's goal size.
	else if(data.args[0] == 'goal' && types.includes(data.args[1]))
	{
		let type = data.args[1]
		if(data.args[2] != undefined && data.args[2] > -1)
		{
			SQLog.log("updating " + uid + "'s goal " + data.args[2] + " to " + data.args[3]);
		
			let measurement = data.args[2]
			dbPe.updateGoal(user, type, measurement);
			message.reply("Updated goal " + type + " to " + measurement + " inches!");
		} else {
			message.channel.send("You've made an error, or didn't specify any parameters.");
		}
	}

	else if(data.args[0] == 'all' || data.args[0] == 'global')
	{
		let table = await dbPe.getAllRecords();

		let response = statPe.getGlobalStats(table);

		message.channel.send(response);
	}
}