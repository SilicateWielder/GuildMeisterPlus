const colors = require('colors');
const mysql = require('mysql');

function connectDB(config)
{
	let connection = mysql.createConnection( config );
	
	connection.connect(function(err) {
		if(err)
		{
			ErrLog.log(`Problem connecting to MySQL ${err}`);
			setTimeout(connectDB, 2000);
		}
	});
	
	connection.on('error', function(err) {
		SQLog.log(`ERROR: ${err}`);
		
		if(err.code === 'PROTOCOL_CONNECTION_LOST')
		{
			connectDB();
		} else {
			throw err;
		}
	});
	
	return(connection);
}

// MySQL Wrapper, the SQLClient
class SqlClient {
    constructor( config ) {
		this.connection = connectDB( config );	
    }
    
    query( sql, args ) {
		if(config.devMode)
		{
			SQLog.log(colors.green("QUERY: ") + sql);
		}
		
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )﻿
                    return reject( err );
                resolve( rows );
            } );
        }).catch( function(err)
        {
            SQLog.log(colors.bgRed("ERROR: ") + err);    
        });
    }
    
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        }).catch( function(err)
        {
            ErrLog.log(err + '');    
        });
    }
}

global.sql_connection = new SqlClient(dbLoginParameters);


// Registers a specific server to the database, based on a message send.
exports.registerServer = async function(guild, standalone = false)
{
	let serverId = guild.id;
	let serverName = guild.name;
	let ownerId = guild.ownerID;
	let ownerName = guild.owner.displayName;
	let userCount = guild.memberCount;
	
	let check = await sql_connection.query(`CALL get_server_info(${serverId});`);
	check = check[0];

	if(check == undefined)
	{
		//SQLog.log(`Adding Server: ${serverId}, ${serverName}, ${ownerId}, ${ownerName}, ${userCount}`);
		SQLog.log(`	SERVER ` + " REGSTR ".bgRed + " " + colors.yellow(` ${serverId} | Name = ${serverName} Owner = ${ownerName} Users: ${userCount}`));
		
		let query = `CALL register_server(${serverId}, "${serverName}", ${ownerId}, "${ownerName}", ${userCount});`;
		
		await sql_connection.query(query);
		return true;
	}
	
	if(!standalone)
	{
		SQLog.log(`	SERVER ` + " EXISTS ".bgGreen + " " + colors.yellow(` ${serverId} | Name = ${serverName}, Owner = ${ownerName}, Users: ${userCount}`));
	}
	return false;
}

// Checks for new servers, and individually registers them to the database.
exports.registerServers = async function(client)
{	
	SQLog.log("Checking for new servers...".bold);
	
	// Get list of all guilds.	
	let availableServers = client.guilds.array();
		
	for(s = 0; s < availableServers.length; s++)
	{
		let currentServer = availableServers[s];
		
		await exports.registerServer(currentServer);
	}
	
	SQLog.log("...Check complete!".bold);
}

exports.getAnnouncementChannels = async function()
{
	let query = `SELECT channel_news FROM Channel_Configs`;
	let servers = await sql_connection.query(query);

	ErrLog.log(servers + '');
	return servers;
}

exports.getServerSettings = async function(serverId)
{
	let query = `CALL get_server_settings(${serverId});`;
	let record = await sql_connection.query(query);

	return record;
}

exports.setServerSetting = async function(serverId, setting, value)
{

	let record = await exports.getServerSettings(serverId);

	if (record != {} && record != undefined && record != null)
	{
		let setQuery = `CALL set_server_setting-${setting}(${serverId}, ${value});`;
		await sql_connection.query(setQuery);
	}
}

exports.getServerChannels = async function(serverId)
{
	let query = `CALL get_server_channels(${serverId});`;
	let record = await sql_connection.query(query);

	return record;
}

exports.setServerChannel = async function(serverId, channel, channelId)
{
	let record = await exports.getServerChannels(serverId);

	if(record != {} && record != undefined && record != null)
	{
	let setQuery = `CALL set_server_channel_${channel}(${serverId}, ${channelId});`;
		await sql_connection.query(setQuery);
	}
}

