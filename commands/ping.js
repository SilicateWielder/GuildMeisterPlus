// Command properties.
exports.properties = {
	devOnly: false,
	adminOnly: false,
	modAndUp: false,
	listed: true,
	category: 'general',
	helpShort: 'Pong!',
	helpLong: 'Returns the API and internet ping times for the bot.',
}

exports.command = async function(data)
{
	// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
	// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
	const m = await data.message.channel.send("Ping?");
	m.edit(`Pong! Latency is ${m.createdTimestamp - data.message.createdTimestamp}ms. API Latency is ${Math.round(data.client.ping)}ms`);
}
