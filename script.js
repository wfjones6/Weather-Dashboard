const searchBtn = document.getElementById("search");  
const key = 'fe692e6f7fc6afc8b2dde67841dbabe0';

var cityName = '';
var curDate = new Date();
var nDate = curDate.toDateString();

var mLat = '';
var mLon = '';
var mName = '';
var mTemp = '';
var mHumidity = '';
var mWindSp = '';
var mUV = '';

// Create event listener
searchBtn.addEventListener('click', submitSearch);

function submitSearch()
{
	var xhr = new XMLHttpRequest();	// Create XMLHttpRequest object
	cityName = document.getElementById('inputText').value;

	// Current conditions URL
	// Use '&units=imperial' to get temperature returned in fahrenheit
	urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&units=imperial&appid='+key;

	xhr.open('GET', urlWeather, true);	// prepare the request
	xhr.onload = function()			// When readystate changes
	{
 	    if(xhr.readyState === 4)  // Finished
	    {
		if (xhr.status === 200) // If server status was ok
		{
		    responseObject = JSON.parse(xhr.responseText);

		    mLat = responseObject.coord.lat;
		    mLon = responseObject.coord.lon;
		    mName = responseObject.name;
		    mTemp = responseObject.main.temp;
		    mHumidity = responseObject.main.humidity;
		    mWindSp = responseObject.wind.speed;

		    // Get the UV value
		    getUV();
		}
	    }
	};

	xhr.send(null);
}


function getUV()
{
	var xhr2 = new XMLHttpRequest();
	urlUV = 'https://api.openweathermap.org/data/2.5/uvi?lat='+mLat+'&lon='+mLon+'&appid='+key;

	xhr2.open('GET', urlUV, true);
	xhr2.onload = function()
	{
	    if(xhr2.readyState === 4) // Finished
	    {
		if (xhr2.status === 200) // If server status was ok
		{
		    responseObject2 = JSON.parse(xhr2.responseText);
		    mUV = responseObject2.value;

		    // Get the 5 day forecast then display the data
		    get5Day();
		}
	    }
	};
	
	xhr2.send(null);
}


function get5Day()
{
	var xhr3 = new XMLHttpRequest();
	urlForecast = 'https://api.openweathermap.org/data/2.5/forecast?q='+cityName+'&units=imperial&appid='+key;

	xhr3.open('GET', urlForecast, true);
	xhr3.onload = function()
	{
	    if(xhr3.readyState === 4) 
	    {
		if (xhr3.status === 200 || xhr3.status === 0)//If server status was ok
		{
		    responseObject3 = JSON.parse(xhr3.responseText);
		    var iconId = responseObject3.list[0].weather[0].icon;
		    var iconUrl = 'http://openweathermap.org/img/wn/'+iconId+'@2x.png';
		    var dayArray = [];
		    var forecastArray = [];

		    // The forecast list includes weather data every 3 hours.
		    // To get one forecast every 24 hours, we need every 8th record
		    // because 24 / 3 = 8 entries per day. We only want one per day.
		    for (i = 0; i < responseObject3.list.length; i+=8)
		    {
			iconId = responseObject3.list[i].weather[0].icon;
			iconUrl = 'http://openweathermap.org/img/wn/'+iconId+'@2x.png';

			dayArray = [responseObject3.list[i].dt_txt,
							iconUrl,
					responseObject3.list[i].main.temp,
					responseObject3.list[i].main.humidity];

		       forecastArray.push(dayArray);
		    }

  		    // Build up string with new content (could also use DOM manipulation)
		    var curConditions = "";

		    curConditions += '<div>';
		    curConditions += '<h3>' + mName + ' (' + nDate + ')</h3>';
		    curConditions += '<p>Temperature: ' + mTemp + ' &degF</p>';
		    curConditions += '<p>Humidity: ' + mHumidity + '%</p>';
		    curConditions += '<p>Wind Speed: ' + mWindSp + ' MPH</p>';
		    curConditions += '<p>UV Index: '+ mUV + '</p>';
		    curConditions += '<h4>5-Day Forecast:</h4>';

		    for (i = 0; i < forecastArray.length; i++)
		    {
		      curConditions += '<p>Day-'+ (i+1) +' Date: '+ forecastArray[i][0] + '</p>';
		      curConditions += '<p>Icon URL: '+ forecastArray[i][1] + '</p>';
		      curConditions += '<p>Temp: '+ forecastArray[i][2] + ' &degF</p>';
		      curConditions += '<p>Humidity: '+ forecastArray[i][3] + '%</p>';
		      curConditions += '</br>';
		    }

		    curConditions += '</div>';

		    //update the page with the new content
		    document.getElementById('curConditions').innerHTML = curConditions;
		}
	    }
	};
	
	xhr3.send(null);
}
