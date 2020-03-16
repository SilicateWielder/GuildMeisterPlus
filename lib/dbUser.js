const colors = require('colors');
const dbMain = require('./dbMain.js');

// Registers a new user in the database.
exports.registerUser = async function(user, standalone = false)
{

	let id = user.id;

    let userName = user.username;

    if(userName == undefined)
    {
	    userName = user.user.username;
	}

	let check = await sql_connection.query(`CALL get_user_info(${id});`);

	if(check == undefined || check == '')
	{
		SQLog.log(`	USER ` + " REGSTR ".bgRed + " " + colors.yellow(` ${id} | Name = ${userName}`));
		await sql_connection.query(`CALL register_user(${id}, "${userName}");`);

		return true;
	}

	if(!standalone)
	{
		SQLog.log(`	USER ` + " EXISTS ".bgGreen + " " + colors.yellow(` ${id} | Name = ${userName}`));
	}
	return false;
}

// Gets strike count of a user.
exports.getGlobalStrikes = async function(user)
{
	let uid = user.id;

	let query = `CALL get_user_info(${uid});`;

	let record = await sql_connection.query(query);

	if (record == undefined || record == '')
	{
		exports.registerUser(user, true);
		record = await sql_connection.query(query);
	}

	ErrLog.log("Strikes: " + JSON.stringify(record[0]));

	return record[0][0].global_strikes;
}

// Applies a new strike to a user.
exports.addStrike = async function(user, message, reason, date)
{
	let uid = user.id;
	let sid = message.channel.guild.id;

	let strikes = await exports.getGlobalStrikes(user);
	strikes++;
	
	ErrLog.log("Strikes: " + strikes);

	let queryA = `CALL set_user_strikes(${uid}, ${strikes});`;
	let queryB = `CALL log_strike_event(${uid}, ${sid}, 'ADD', "${String.raw`` + reason}", '${date.signature}');`;

	let config = await dbMain.getServerSettings(message.channel.guild.id);
	let strikeLimit = parseInt(config.strike_banning_threshold);

	await sql_connection.query(queryA);
	await sql_connection.query(queryB);

	let shouldBan = false;
	if(strikeLimit > 0)
	{
		shouldBan = (strikes >= config.strikeBanThreshold);
	}

	return shouldBan;
}

// Removes a  strike from a user.
exports.subStrike = async function(user, message, reason, date)
{
	
	let uid = user.id;
	let sid = message.channel.guild.id;

	let strikes = await exports.getGlobalStrikes(user);
	strikes--;

	let queryA = `CALL set_user_strikes(${uid}, ${strikes});`;
	let queryB = `CALL log_strike_event(${uid}, ${sid}, 'SUB', "${String.raw`` + reason}",, '${date.signature}');`;

	let config = await dbMain.getServerSettings(message.channel.guild.id);
	let strikeLimit = parseInt(config.strike_banning_threshold);

	await sql_connection.query(queryA);
	await sql_connection.query(queryB);
}