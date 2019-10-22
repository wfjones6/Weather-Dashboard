const searchBtn = document.getElementById("search");  
const key = 'fe692e6f7fc6afc8b2dde67841dbabe0';

var cityName = '';
var url = '';
var curDate = new Date();
var nDate = curDate.toDateString();
var lat;
var lon;

function getCurrent(curURL)
{
  var xhr = new XMLHttpRequest();	// Create XMLHttpRequest object
  xhr.open('GET', url, true);	// prepare the request
  xhr.onreadystatechange = function()
  {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) 
	{
	    responseObject = JSON.parse(xhr.responseText);

	    // Build up string with new content (could also use DOM manipulation)
	    var fahrenheit = Math.round(((parseFloat(responseObject.main.temp)-273.15)*1.8)+32);
	    var curConditions = "";

	    curConditions += '<div >';
	    curConditions += '<h3>' + responseObject.name + ' (' + nDate + ')</h3>';
	    curConditions += '<p>Temperature: ' + fahrenheit + ' &degF</p>';
	    curConditions += '<p>Humidity: ' + responseObject.main.humidity + '%</p>';
	    curConditions += '<p>Wind Speed: ' + responseObject.wind.speed + ' MPH</p>';
	    curConditions += '<p>UV Index: '+ 10.4 + '</p>';
	    curConditions += '</div>';

	    //Get latitude and longitude needed for UV Index
	    lat = responseObject.coord.lat;
	    lon = responseObject.coord.lon;

   	    //update the page with the new content
	    document.getElementById('curConditions').innerHTML = curConditions;
	}
  }
  xhr.send(null);		// send the request
}

function getUVIndex(uvindexURL)
{
  var xhr = new XMLHttpRequest();	// Create XMLHttpRequest object
  xhr.open('GET', url, true);	// prepare the request
  xhr.onreadystatechange = function()
  {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) 
	{
	    responseObject = JSON.parse(xhr.responseText);

	    // Build up string with new content (could also use DOM manipulation)
	    var fahrenheit = Math.round(((parseFloat(responseObject.main.temp)-273.15)*1.8)+32);
	    var curConditions = "";

	    curConditions += '<div >';
	    curConditions += '<p>UV Index: '+ responseObject.value + '</p>';
	    curConditions += '</div>';

	    //update the page with the new content
	    document.getElementById('uvIndex').innerHTML = curConditions;
	}
  }
  xhr.send(null);		// send the request
}


// Search
searchBtn.addEventListener('click', function () 
{
  cityName = document.getElementById('inputText').value;
  
  // Current conditions URL
  url = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;
  getCurrent(url);

  url = 'http://api.openweathermap.org/data/2.5/uvi?appid='+key+'&lat='+lat+'&lon='+lon'
  getUVIndex(url);
})
