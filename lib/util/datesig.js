exports.current = function()
{
	let date = {};
	date.iso = (new Date(Date.now())).toISOString();
	date.y = date.iso.slice(0, 4);
	date.m = date.iso.slice(5, 7);
	date.d = date.iso.slice(8, 10);
	
	date.signature = "" + date.y + date.m + date.d;
			
	return(date);
}