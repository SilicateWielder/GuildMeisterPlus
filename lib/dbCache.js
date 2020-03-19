const colors = require('colors');
const dbMain = require('./dbMain.js');
const dateSig = require('./util/datesig.js');

const youtubedl = require('youtube-dl');

// logs a new video in the database.
exports.recordCachedVideo = async function(id, category)
{	
	const options = ['--no-color'];
	
	youtubedl.getInfo(`https://www.youtube.com/watch?v=${id}`, options, function(err, info, sql_con, id, category) {
		let date = dateSig.current();
		let query = `CALL record_cached_video(${id}, ${info.title}, ${info.author}, ${category}, ${date.current});`
		
		ErrLog.log(query);
	});
	
	let query = ``;
	sql_connection.query(query);
}

// Retrieves all music from youtube cache.
exports.getMusic = async function()
{
	let query = `CALL get_youtube_music()`;
	
	let tracks = await sql_connection.query(query);

	return(tracks[0]);
}