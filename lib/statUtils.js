exports.longDate = function(dateSig)
{
	if(dateSig == 99999999)
	{
		return '';
	}

	dateSig = dateSig + '';
	let year = dateSig.slice(0, 4);
	let month = dateSig.slice(4, 6);
	let day = dateSig.slice(6, 8);

	return `${year}-${month}-${day}`;
}

exports.dateSigToDate = function(l_dateSig)
{
	let l_date = {}
	let date = String(l_dateSig);

	let yearLength = String(l_dateSig).length - 4;

	l_date.year = parseInt(date.slice(0, yearLength));
	l_date.month = parseInt(date.slice(yearLength, yearLength + 2));
	l_date.day = parseInt(date.slice(yearLength + 2, yearLength + 4));
	
	return l_date;
}