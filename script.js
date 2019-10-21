const searchBtn = document.getElementById("search");  
const key = 'fe692e6f7fc6afc8b2dde67841dbabe0';

var cityName = '';
var url = '';
var curDate = new Date();
var nDate = curDate.toDateString();

var xhr = new XMLHttpRequest();	// Create XMLHttpRequest object

xhr.onload = function()			// When readystate changes
{
  if(xhr.status === 200)			//If server status was ok
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

      //update the page with the new content
      document.getElementById('curConditions').innerHTML = curConditions;
  }
};

searchBtn.addEventListener('click', function () 
{
  cityName = document.getElementById('inputText').value;
  
  // Current conditions URL
  url = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;

  xhr.open('GET', url, true);	// prepare the request
  xhr.send(null);				// send the request
				// send the request
})
