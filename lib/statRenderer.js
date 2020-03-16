const statUtils = require('./../lib/statUtils.js');

// Dimensioning parameters.
let image_w = 865;
let image_h = 215;
let title_h = 20;

// Get body position and size.

let div_dist = 5;

let pallete = {};
pallete.paneBg = '#64B6D2';
pallete.paneMg = '#2F3A3D';
pallete.paneFg = '#3C6496';
pallete.paneTx = 'white';
pallete.gridFg = 'rgba(255, 255, 255, 100)';
pallete.cellA = '#6B6B6B';
pallete.cellB = '#666666';



async function colorLabel(ctx, color, text, x, y)
{
	ctx.fillStyle = 'rgba(125,125,125,255)';
	ctx.fillRect(x, y, 10, 10);

	ctx.fillStyle = color;
	ctx.fillRect(x + 1, y + 1, 8, 8);
	
	ctx.font = 'bold 10px Arial';
	ctx.fillStyle = pallete.paneTx;
	ctx.fillText(text, x + 12, y + 9);
	ctx.stroke();
}



// Graph the user's records over time.
exports.statChart = async function(data, ctx, posX = chart_x, posY = chart_y, width = chart_w, height = chart_h)
{
	let types = Object.keys(data);
	
	if(data.key != undefined)
	{
		types = data.key;
	}
	
	ErrLog.log("3 " + types);
	
	// Draw the pane.
	ctx.fillStyle = pallete.paneBg;
	ctx.fillRect(posX, posY, width, height);

	ctx.fillStyle = pallete.paneMg;
	ctx.fillRect(posX + div_dist, posY + div_dist, width - (div_dist * 2), height - (div_dist * 2));
	
	let innerFrameWidth = 20;

	// Calculate Dimensional Ranges.
	let graphTop = (posY + div_dist) + (div_dist + innerFrameWidth);
	let graphBot = (posY + height) - (div_dist + innerFrameWidth);
	let graphLeft = (posX) + (div_dist + innerFrameWidth);
	let graphRght = (posX + width) - (div_dist + innerFrameWidth);

	let graphHgt = Math.abs(graphTop - graphBot);
	let graphWdt = Math.abs(graphRght - graphLeft); // 4? Something isn't right here...

	//Draw edges of graph.
	ctx.strokeStyle = pallete.paneTx;
	ctx.beginPath();
	ctx.lineTo(graphLeft, graphTop);
	ctx.lineTo(graphLeft, graphBot);
	ctx.lineTo(graphRght, graphBot);
	ctx.stroke();

	// Calibrate Time Scale.
	let minDate = 99999999; //Set to largest possible value on our date code.
	let maxDate = 0;

	for(type = 0; type < types.length - 1; type++)
	{	
		if(types[type] != 'goal')
		{
			let rows = data[types[type]];
			
			for (row = 0; row < rows.length; row++ )
			{
				let currentDate = rows[row].date_signature;

				if(maxDate < currentDate)
				{
					maxDate = currentDate;
				}

				if(minDate > currentDate)
				{
					minDate = currentDate;
				}
			}
		}
	}

	let firstDate = statUtils.dateSigToDate(minDate);
	let lastDate = statUtils.dateSigToDate(maxDate);

	let firstYear = firstDate.year;
	let lastYear = lastDate.year + 1;

	actualFirstDate = new Date(`${firstDate.month}/${firstDate.day}/${firstDate.year}`);
	actualLastDate = new Date(`${lastDate.month}/${lastDate.day}/${lastDate.year}`);

	let Difference_In_Time = actualLastDate.getTime() - actualFirstDate.getTime(); 
	
	// Calculate ranges.
	let dateRangeDays = Difference_In_Time / (1000 * 3600 * 24);
	let dateRangeMonths = dateRangeDays / 30.4167;
	let dateRangeYears = dateRangeMonths / 12;

	let visibleYears = Math.ceil(dateRangeYears) + 1;

	// Calculate scalefactors.
	let yearScale = graphWdt / visibleYears;
	let monthScale = yearScale / 12;
	let dayScale = monthScale / 30.45;

	// Draw TimeScale.
	for(year = 0; year <= visibleYears; year++)
	{
		let posX = Math.round(graphLeft + (year * yearScale));

		ctx.strokeStyle = pallete.gridFg;
		ctx.font = '10px Arial';
		ctx.fillStyle = pallete.paneTx;

		if(posX <= graphRght)
		{
			if((year > 0) && (monthScale > 10))
			{
				for(month = 0; month < 12; month ++)
				{
					let monthPosX = Math.round(posX - (monthScale * month));

					if((month > 0) && (dayScale > 10))
					{
						for(day = 0; day < 12; day ++)
						{
							let dayPosX = Math.round(monthPosX - (dayScale * day));

							ctx.beginPath();

							ctx.lineTo(dayPosX, graphTop);
							ctx.lineTo(dayPosX, graphBot);

							ctx.stroke();
						}
					}

					ctx.beginPath();

					ctx.lineTo(monthPosX, graphTop);
					ctx.lineTo(monthPosX, graphBot);

					ctx.stroke();
				}
			}

			ctx.beginPath();

			ctx.lineTo(posX, graphTop);
			ctx.lineTo(posX, graphBot);

			if(year < visibleYears)
			{
				ctx.fillText(firstYear + year, posX + 2, graphBot + 10);
			} else {
				ctx.fillText(firstYear + year, posX - 25, graphBot + 10);
			}

			ctx.strokeStyle = 'rgba(255, 255, 255, 255)';
			ctx.lineTo(posX, graphBot);
			ctx.lineTo(posX, graphBot + 10);

			ctx.stroke();
		}
	}

	// Calibrate measurement scale.
	let maxMeasure = 0;
	for(type = 0; type < types.length - 1; type++)
	{
		let rows = data[types[type]];

		for (row = 0; row < rows.length; row++ )
		{
			let currentMeasure = rows[row].measurement_value;

			if(maxMeasure < currentMeasure)
			{
				maxMeasure = currentMeasure;
			}
		}
	}
	maxMeasure = 1 + Math.ceil(maxMeasure); // Chop off those floating point values
	
	let inchScale = graphHgt / maxMeasure;
	let subInchScale = inchScale / 2;

	// Draw Measure Scale.
	for(inch = 0; inch <= maxMeasure; inch++)
	{
		let posY = graphBot - (inch * inchScale);

		if((inch > 0) && (subInchScale > 10))
		{
			for(subInch = 0; subInch < 2; subInch ++)
			{
				let subInchPosY = posY + (subInch * subInchScale)

				ctx.strokeStyle = pallete.gridFg;

				ctx.beginPath();
				ctx.lineTo(graphLeft, subInchPosY);
				ctx.lineTo(graphRght, subInchPosY);
				ctx.stroke();
			}
		}

		ctx.beginPath();
		ctx.lineTo(graphLeft - 10, posY);
		ctx.lineTo(graphRght, posY);

		ctx.fillStyle = pallete.paneTx;
		ctx.fillText(inch, graphLeft - 15, posY - 2);

		ctx.stroke();
	}


	let dataKeys = Object.keys(data).slice(0, -1);
	let colorCodes = ['rgba(255, 255, 255, 255)', 'rgba(255, 0, 0, 255)', 'rgba(0, 0, 255, 255)', 'rgba(0, 255, 0, 255)', 'rgba(255, 125, 125, 255)', 'rgba(125, 125, 255, 255)', 'rgba(80, 255, 125, 255)'];
	ctx.lineWidth = 2;

	for(dataKey = 0; dataKey < dataKeys.length; dataKey++)
	{
		let key = dataKeys[dataKey];
		let col = colorCodes[dataKey];
		let dataSet = data[key];
		
		// if the key does not equal goal, draw this keying label.
		if(key != 'goal')
		{
			colorLabel(ctx, col, key, graphLeft + 230 + (50 * dataKey), graphBot - 12);
		}
		
		ctx.strokeStyle = col;


		ctx.beginPath();
		ctx.strokeStyle = col;
		for(point = 0; point < dataSet.length; point++)
		{
			let pointObj = dataSet[point];
			let measurement = pointObj.measurement_value;
			
			ErrLog.log("DateSignature: " + pointObj.date_signature);
			
			let dateSignature = statUtils.dateSigToDate(pointObj.date_signature);
			dateSignature.year -= firstYear;
			
			ErrLog.log("" + JSON.stringify(dateSignature));
			
			// Convert date signature to offsets :)
			dateSignature.year = dateSignature.year * yearScale;
			dateSignature.month = (dateSignature.month - 1) * monthScale;
			dateSignature.day = (dateSignature.day - 1) * dayScale;

			// Find coordinates.
			let posX = graphLeft + (dateSignature.year + (dateSignature.month) + (dateSignature.day));
			let posY = graphBot - (measurement * inchScale);

			if(point == 0)
			{
				ctx.lineTo(posX, posY);
			}

			ctx.lineTo(posX, posY);
			ctx.strokeStyle = col;
			
			ErrLog.log("" + measurement + ` | X: ${posX}, Y: ${posY}`);
	
		}
		ctx.stroke();
	}
}