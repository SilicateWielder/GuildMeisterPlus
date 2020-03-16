const colors = require('colors');
const dbMain = require('./dbMain.js');
const dbUser = require('./dbUser.js');
//const queries = require('./queriesStat.js');

// Records a new PE record for a user..
exports.addRecord = async function(message, type, measurement, day, month, year)
{	
	// Get the user's discord ID.
	let user = message.member.user;
	let id = message.member.user.id;
	
	// Ensure user exists in the database.
	await dbUser.registerUser(user, true);
	
	SQLog.log(`${year} ${month} ${day}`);

	let query = "CALL `record_stat`('" + id + "', '" + type + "', '" + measurement + "', '" + (year + month + day) + "');";
	
	ErrLog.log(query);
	
	sql_connection.query(query);
}

exports.getAllRecords = async function(types = ['BPEL', 'BPFL', 'BPFSL', 'MSEG', 'MSFG', 'BSEG', 'BSFG'])
{
	let data = {};
	
	for(type = 0; type < types.length; type++)
	{
		let typeName = types[type];
		let currentQuery = "CALL `get_stat_records_all`('" + typeName + "');";

		data[typeName] = (await sql_connection.query(currentQuery))[0];
	}

	return data;
}

// Returns all PE records of a user.
exports.getRecords = async function(user, types = ['BPEL', 'BPFL', 'BPFSL', 'MSEG', 'MSFG', 'BSEG', 'BSFG'])
{
	let id = user.id;

	// Ensure user exists in the database.
	await dbUser.registerUser(user, true);

	// Check records.
	// There's probably a better/faster way of running our queries, but lets leave it like this for now.
	// append [0] to the end of the line in order to fix an issue with using prodedures embedding data in an extra layer.
	let data = {}
	
	// Retrieve measurement data.
	for(type = 0; type < types.length; type++)
	{
		let typeName = types[type];
		let currentQuery = "CALL `get_stat_records`('" + id + "', '" + typeName + "');";

		data[typeName] = (await sql_connection.query(currentQuery))[0];
	}
	
	// Retrieve goal data.
	data.goal = (await sql_connection.query("CALL `get_stat_goals`('" + id + "');"))[0];
	
	if(data.goal[0] != undefined)
	{
		data.goal = data.goal[0];
	}

	return data;
}

exports.clearRecords = async function(user)
{
	let id = user.id;
	let query = ("CALL `clear_stat_records`('" + id + "');");
	ErrLog.log(query);

	await sql_connection.query(query);
}

exports.updateGoal = async function(user, type, measurement)
{
	let uid = user.id;

	let data = await sql_connection.query("CALL ``();");

	if(data == undefined)
	{
		let query = queries.addGoals(type, uid, measurement);
		await sql_connection.query(query);
	} else {
		let query = queries.updateGoals(type, uid, measurement);
		await sql_connection.query(query);
	}
	
	//db.run(`UPDATE PeGoals`);
}