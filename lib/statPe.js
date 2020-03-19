const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const statRenderer = require('./../lib/statRenderer.js');

let types = ['BPEL', 'BPFL', 'BPFSL', 'MSEG', 'MSFG', 'BSEG', 'BSFG', 'DATE'];
let rows = ['start', 'current', 'growth', 'goal'];

// Dimensioning parameters.
let image_w = 865;
let image_h = 215;
let title_h = 20;

// Get body position and size.

let div_dist = 5;

let body_y = title_h + (div_dist * 2);
let body_h = image_h - body_y;

let userCard_x = 5;
let userCard_y = title_h + div_dist;
let userCard_w = 75;
let userCard_h = body_h;

let tableCell_w = 85;
let tableCell_h = 20;

let table_x = userCard_w + (div_dist * 2);
let table_y = userCard_y;
let table_w = (tableCell_w * (types.length + 1)) + (div_dist * 2);
let table_h = 110;

let chart_x = table_x;
let chart_y = table_y + table_h + 5;
let chart_w = table_w;
let chart_h = table_h - 40;

let pallete = {};
pallete.paneBg = '#64B6D2';
pallete.paneMg = '#2F3A3D';
pallete.paneFg = '#3C6496';
pallete.paneTx = 'white';
pallete.gridFg = 'rgba(255, 255, 255, 100)';
pallete.cellA = '#6B6B6B';
pallete.cellB = '#666666';

function longDate(dateSig)
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

// Draws the title of the stats card.
function titleBar(l_user, l_ctx)
{
	let username = null;
	
	if(l_user.user != undefined)
	{
		username = l_user.user.username;
	}

	else
	{
		username = l_user.username;
	}

	l_ctx.fillStyle = pallete.paneBg;
	l_ctx.fillRect(0, 0, image_w, title_h);
	
	l_ctx.font = 'bold 15px Arial';
	l_ctx.fillStyle = pallete.paneTx;
	l_ctx.fillText(`${username}'s growth stats`, 5, 14);
}

// Draws the user's profile box.
async function userCard(l_user, l_ctx)
{
	let user = null;
	
	if(l_user.user != undefined)
	{
		user = l_user.user;
	}

	else
	{
		user = l_user;
	}
	
	let avatar_x = userCard_x + div_dist;
	let avatar_y = userCard_y + div_dist;
	let avatar_w = userCard_w - (div_dist * 2);
	let avatar_h = avatar_w;
	
	let l_avatar = null;
	if(user.avatarURL != null && user.avatarURL != undefined)
	{
		try
		{
			l_avatar = await loadImage(user.avatarURL);
		}

		catch(error)
		{
			ErrLog.log(user.id + ' has no avatar, not saving it.');    
		}
	}	
	
	l_ctx.fillStyle = pallete.paneBg;
	
	l_ctx.fillRect(userCard_x, userCard_y, userCard_w, userCard_h);
	
	l_ctx.fillStyle = pallete.paneFg;
	l_ctx.fillRect(avatar_x - 1 , avatar_y - 1, avatar_w + 2, avatar_h + 2);

    if(l_avatar != null || l_avatar != undefined)
    {
	l_ctx.drawImage(l_avatar, avatar_x, avatar_y, avatar_w, avatar_h);
	}
}

// Display user's growth stats in a table.
async function growthTable(data, ctx)
{
	// Starting X and Y positions.
	let startX = table_x + div_dist;
	let startY = table_y + div_dist;
	let newData = [];

	// Organize the data.
	for(let cy = 0; cy < 2; cy++)
	{
		let row = [];
		let date = 0;

		// If we're getting the starting measurements, set our date to the max value.
		if(cy == 0)
		{
			date = 99999999;
		}

		for(let cx = 0; cx < types.length - 1; cx++)
		{
			let type = types[cx];

			let entry = data[type];
			
			if(entry == undefined)
			{
				row[type] = '';
			} 
			
			else
			{
				let index = entry.length - 1;
				if (cy == 1)
				{
					index = 0;
				}
			
				if(entry[index] != undefined)
				{
					let measurement = entry[index].measurement_value;
					let dateSig = parseInt(entry[index].date_signature);

					row[type] = measurement + ' in';

					if((dateSig > date && cy == 1) || (dateSig < date && cy == 0))
					{
						date = dateSig;
					}
				} else {
					row[type] = '';

					if(date == 0)
					{
						date = '99999999';
					}
				}
			}
		}
		row['DATE'] = longDate(date);
		newData.push(row);
	}

	// Calculate growth.
	let row = [];
	for(let cx = 0; cx < types.length - 1; cx++)
	{
		let type = types[cx];
		let valA = parseFloat(newData[0][type].slice(0, -3));
		let valB = parseFloat(newData[1][type].slice(0, -3));

		if(!isNaN(valA) && !isNaN(valB))
		{
			row[type] = (valB - valA).toFixed(2);
		}
		
		else
		{
			row[type] = '';
		}
	}
	
	row['DATE'] = '';
	newData.push(row);

	// Insert goals and prune null values.
	if(data != undefined && data.goal != undefined)
	{
		data.goal['DATE'] = '';
		newData.push(data.goal);
	} else {
		
	}

	for(let cx = 0; cx < types.length - 1; cx++)
	{
		let type = types[cx];
		let entry = newData[newData.length - 1][type];

		if (entry == null || entry == '')
		{
			newData[newData.length - 1][type] = '';
		} else {
			newData[newData.length - 1][type] = entry + ' in';
		}
	}


	// Draw the pane.
	ctx.fillStyle = pallete.paneBg;
	ctx.fillRect(table_x, table_y, table_w, table_h);

	// Draw the columns and rows.
	for(let x = 0; x < types.length + 1; x++)
	{
		for(let y = 0; y <= 4; y++)
		{
			// Invert depending on X and y position.
			let invert = ((x / 2) - Math.floor(x / 2) == 0);
			
			if ((y / 2) - Math.floor(y / 2) == 0)
			{
				invert = !invert;
			}
			
			// Set color accordingly.
			if(invert)
			{
				ctx.fillStyle = pallete.cellA;
			} else {
				ctx.fillStyle = pallete.cellB;
			}
			
			// Figure out X and Y position of cell.
			let xPos = startX + (tableCell_w * x);
			let yPos = startY + (tableCell_h * y);
			
			// Draw cell
			ctx.fillRect(xPos, yPos, tableCell_w, tableCell_h);
			
			// Text to draw along top.
			if(x > 0 && y == 0)
			{
				ctx.fillStyle = pallete.paneTx;
				ctx.fillText(types[x - 1], xPos + 5, yPos + 14);
			}
			
			// Text to draw along left edge.
			else if(x == 0 && y > 0)
			{
				ctx.fillStyle = pallete.paneTx;
				ctx.fillText(rows[y - 1], xPos + 5, yPos + 14);
			}
			
			// Fill in table with data.
			else if (x > 0 && y > 0)
			{
				ctx.fillStyle = pallete.paneTx;
				
				let content = newData[y - 1];
				if(content != undefined)
				{
					ctx.fillText(newData[y - 1][types[x-1]], xPos + 5, yPos + 14);
				} else {
					ctx.fillText('?', xPos + 5, yPos + 14);
				}
			}
		}
	}
}

// Routine Pane
async function routineDisplay(data, ctx, posX = chart_x, posY = chart_y, width = chart_w, height = chart_h)
{
	// Draw the pane.
	ctx.fillStyle = pallete.paneBg;
	ctx.fillRect(posX, posY, width, height);

	ctx.fillStyle = pallete.paneMg;
	ctx.fillRect(posX + div_dist, posY + div_dist, width - (div_dist * 2), height - (div_dist * 2));
}

exports.drawStats = async function(user, data)
{
	if(data.length == 0)
	{
		return 0;
	}
	// Retrieve necessary user information.

	let l_id = user.id;
	
	let l_bg = await loadImage('./resources/bg/0.jpeg');
	
	// Create canvas and context.
	let l_canvas = createCanvas(image_w, image_h);
	let l_ctx = l_canvas.getContext('2d');
	
	// Set font and background.
	l_ctx.font = 'bold 15px Impact';
	l_ctx.drawImage(l_bg, 0, 0, image_w, image_h);
	
	// Title and profile card.
	titleBar(user, l_ctx);
	await userCard(user, l_ctx);
	await growthTable(data, l_ctx);
	await routineDisplay(data, l_ctx);
	
	//Return image and save.
	let l_img = l_canvas.toBuffer();
	
	if (!fs.existsSync(`./resources/users/${l_id}`)){
		fs.mkdirSync(`./resources/users/${l_id}`);
	}
	
	fs.writeFileSync(`./resources/users/${l_id}/pestat.png`, l_img);
	
	return l_img;
};

exports.drawGraphedStats = async function(user, data)
{
	if(data.length == 0)
	{
		return 0;
	}
	// Retrieve necessary user information.

	let l_id = user.id;
	
	let l_bg = await loadImage('./resources/bg/0.jpeg');
	
	// Create canvas and context.
	let l_canvas = createCanvas(image_w, image_h);
	let l_ctx = l_canvas.getContext('2d');
	
	// Set font and background.
	l_ctx.font = 'bold 15px Impact';
	l_ctx.drawImage(l_bg, 0, 0, image_w, image_h);
	
	// Title and profile card.
	titleBar(user, l_ctx);
	ErrLog.log("2 " + JSON.stringify(data));
	await statRenderer.statChart(data, l_ctx, div_dist, 20 + div_dist, image_w - (div_dist * 2), image_h - (20 + (div_dist*2)));
	
	//Return image and save.
	let l_img = l_canvas.toBuffer();
	
	if (!fs.existsSync(`./resources/users/${l_id}`)){
		fs.mkdirSync(`./resources/users/${l_id}`);
	}
	
	fs.writeFileSync(`./resources/users/${l_id}/pestat.png`, l_img);
	
	return l_img;
};

exports.drawProjectedStats = async function(user, data)
{
	if(data.length == 0)
	{
		return 0;
	}
	// Retrieve necessary user information.

	let l_id = user.id;

	let l_bg = await loadImage('./resources/bg/0.jpeg');
	
	// Create canvas and context.
	let l_canvas = createCanvas(image_w, image_h);
	let l_ctx = l_canvas.getContext('2d');
	
	// Set font and background.
	l_ctx.font = 'bold 15px Impact';
	l_ctx.drawImage(l_bg, 0, 0, image_w, image_h);
	
	// Title and profile card.
	titleBar(user, l_ctx);
	await statChart(data, l_ctx, div_dist, 20 + div_dist, image_w - (div_dist * 2), image_h - (20 + (div_dist*2)));
	
	//Return image and save.
	let l_img = l_canvas.toBuffer();
	
	if (!fs.existsSync(`./resources/users/${l_id}`)){
		fs.mkdirSync(`./resources/users/${l_id}`);
	}
	
	fs.writeFileSync(`./resources/users/${l_id}/pestat.png`, l_img);
	
	return l_img;
};

exports.getGlobalStats = function(data, measureTypes = ['BPEL', 'BPFL', 'BPFSL', 'MSEG', 'MSFG', 'BSEG', 'BSFG'])
{
	
	let results = {}

	// Find average measurement for each type.
	for(let m = 0; m < measureTypes.length; m++)
	{
		let currentType = measureTypes[m];
		results[currentType] = {
			'type': currentType,
			'min': 9999,
			'avg': 0,
			'max': 0,
			'count': 0
		};

		let  currentSet = data[currentType];
		for(let r = 0; r < currentSet.length; r++)
		{
			let currentMeasure = currentSet[r].measurement_value;
			results[currentType].count += parseInt(currentMeasure);
			
			if(currentMeasure < results[currentType].min)
			{
				results[currentType].min = currentMeasure;
			}

			if(currentMeasure > results[currentType].max)
			{
				results[currentType].max = currentMeasure;
			}
		}
		results[currentType].avg = (results[currentType].count / currentSet.length).toPrecision(2);
	}

	let message = '***I\'ve tallied the records and here are the metrics (This is ALL records, not just the latest ones)***';

	for(m = 0; m < measureTypes.length; m++)
	{
		let currentType = measureTypes[m];
		let currentMetric = results[currentType];

		let addon = `

		**${currentMetric.type}**:
		Smallest Measurement: ${currentMetric.min} inches
		Largest Measurement: ${currentMetric.max} inches
		Average Size Globally: ${currentMetric.avg} inches
		Combined measurement Globally: ${currentMetric.count} inches
		`

		message = message + addon;
	}

	return message;
}