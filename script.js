const inputTxt = document.getElementById("inputText");
const searchBtn = document.getElementById("search"); 
const searchedList = document.getElementById("searchedGroup");
const key = 'fe692e6f7fc6afc8b2dde67841dbabe0';

var cityName = '';
var mFirst = true;

var mLat = '';
var mLon = '';
var mName = '';
var mDate = '';
var mCurIcon='';
var mTemp = '';
var mHumidity = '';
var mWindSp = '';
var mUV = '';
var curConditions = "";
var curList = "";
var cityArray = JSON.parse(localStorage.getItem("cityArray") || "[]");

updateList();

// Create event listeners
inputTxt.addEventListener("keyup", function(event) 
{
  if (event.keyCode === 13) 
  {
   event.preventDefault();
   searchBtn.click();
  }
});

searchBtn.addEventListener('click', submitSearch);

function submitSearch()
{
    cityName = inputTxt.value;
    
    if(cityName.length > 0)
    {
        for (i = 0; i < cityArray.length; i++)
  	{
            // Remove any duplicates of the city just entered
            if (cityArray[i] == cityName)
            {
            	cityArray.splice(i, 1);
            }
        }
    
    	// Add the city just entered to the top of the list
        cityArray.splice(0, 0, cityName);
        
        // If there are more then nine items in the array, remove the last item
        if (cityArray.length > 9)
        {
        	cityArray.pop();
        }
        updateList();
    }
    getCurConditions();
}

function updateList()
{
  curList = "";
  for (i = 0; i < cityArray.length; i++)
     if(cityArray[i].length > 0)
     {
        curList += '<a href="#" class="list-group-item list-group-item-action">' + cityArray[i] + '</a>';
     }
  }
  
  searchedList.innerHTML = curList;
  localStorage.setItem("cityArray", JSON.stringify(cityArray));

  // If application startup
  if(mFirst === true)
  {
     if(cityArray[i].length > 0)
     {
        cityName = cityArray[0];
        getCurConditions();
     }
     mFirst = false;
  }
  
  // Get the parent DIV, add click listener...
  document.getElementById("searchedGroup").addEventListener("click",function(e) 
  {
      // e.target was the clicked element. Make sure the element tag = <a>
      if (e.target && e.target.tagName === 'A') 
      {
          document.getElementById('inputText').value = e.target.text;
          submitSearch();
      }
  });
}

function getCurConditions()
{
    var xhr = new XMLHttpRequest();  // Create XMLHttpRequest object

    // Current conditions URL
    // Include '&units=imperial' to get temperature returned in fahrenheit
    urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&units=imperial&appid='+key;

    xhr.open('GET', urlWeather, true);	// prepare the request

    xhr.onload = function()  // When readystate changes
    {
         if(xhr.readyState === 4)  // Finished
         {
	     if (xhr.status === 200) // If server status was ok
             {
	         responseObject = JSON.parse(xhr.responseText);
		 mLat = responseObject.coord.lat;
		 mLon = responseObject.coord.lon;
		 mName = responseObject.name;
            
                 var dateObj = new Date();
		 var momentObj = moment(dateObj);
		 mDate = momentObj.format('MM/DD/YYYY');
                 mCurIcon = 'http://openweathermap.org/img/wn/'+ responseObject.weather[0].icon +'.png';
	         mTemp = responseObject.main.temp;
		 mHumidity = responseObject.main.humidity;
		 mWindSp = responseObject.wind.speed;

		 // Get the UV value
		 getUV();
             }
             else
             {
                 cityArray.splice(0, 1);
		 updateList();
             }
         }
    };
    xhr.send(null);
}

function getUV()
{
    var xhr2 = new XMLHttpRequest();
    // UV URL
    urlUV = 'https://api.openweathermap.org/data/2.5/uvi?lat='+mLat+'&lon='+mLon+'&appid='+key;

    xhr2.open('GET', urlUV, true);
    xhr2.onload = function()
    {
        if(xhr2.readyState === 4) // Finished
	{
	    responseObject2 = JSON.parse(xhr2.responseText);
	    mUV = responseObject2.value;
	    // Get the 5 day forecast then display the data
	    get5Day();
        }
    };
    xhr2.send(null);
}

function get5Day()
{
    var xhr3 = new XMLHttpRequest();

    // 5-Day Forecast URL
    // Include '&units=imperial' to get temperature returned in fahrenheit
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
	        var iconUrl = 'http://openweathermap.org/img/wn/'+iconId+'.png';
	        var dayArray = [];
	        var forecastArray = [];

		// The forecast list includes weather data every 3 hours.
		// To get one forecast every 24 hours, we need every 8th record
		// because 24 / 3 = 8 entries per day. We only want one per day.
		for (i = 0; i < responseObject3.list.length; i+=8)
                {
		    iconId = responseObject3.list[i].weather[0].icon;
		    iconUrl = 'http://openweathermap.org/img/wn/'+iconId+'.png';

                    var dateString = responseObject3.list[i].dt_txt;
                    var dateObj = new Date(dateString);
		    var momentObj = moment(dateObj);
		    var dtText = momentObj.format('MM/DD/YYYY');

		    dayArray = [dtText,
				iconUrl,
				responseObject3.list[i].main.temp,
				responseObject3.list[i].main.humidity];

		    forecastArray.push(dayArray);
                }
	        // Build up string with new content (could also use DOM manipulation)
	        curConditions = "";
                curConditions += '<div class="container p-3 my-3 border">'    
 	        curConditions += '<h3>' + mName + ' (' + mDate + ')  ' + '<Img src=' + mCurIcon + '></h3>';

	        curConditions += '<ul class="list-unstyled">';
	        curConditions += '<li class="list-item pt-3">Temperature: '+ mTemp + '&degF</li>';
	        curConditions += '<li class="list-item pt-3">Humidity: ' + mHumidity + '%</li>';
	        curConditions += '<li class="list-item pt-3">Wind Speed: ' + mWindSp + ' MPH</li>';
	        curConditions += '<li class="list-item pt-3">UV Index: ' + '<span>' + mUV + '</span></li>';
	        curConditions += '</ul>';
	        curConditions += '</div>';
            
	        curConditions += '<div class="card">';
	        curConditions += '<h5 class="card-header">5-Day Forecast:</h5>';
	        curConditions += '<div class="card-body">';
	        curConditions += '<div class="card-deck">';

		for (i = 0; i < forecastArray.length; i++)
	        {
		    curConditions += '<div class="card bg-primary">';
      		    curConditions += '<div class="card-body text-left" style="color:white;">';
		    curConditions += '<h5 class="card-text">' + forecastArray[i][0] + '</h5>';
		    curConditions += '<img src=' + forecastArray[i][1] + '>';
		    curConditions += '<p class="card-text">Temp: ' + forecastArray[i][2] + ' &degF</p>';
		    curConditions += '<p class="card-text">Humidity: ' + forecastArray[i][3] + '%</p>';
		    curConditions += '</div>';
		    curConditions += '</div>';
		}

                curConditions += '</div>';
                curConditions += '</div>';
                curConditions += '</div>';
      
		//update the page with the new content
	        document.getElementById('curConditions').innerHTML = curConditions;
            
                // Clear the search box and give it focus
		document.getElementById('inputText').value = "";
   		document.getElementById('inputText').focus();
	    }
	}
    };
    xhr3.send(null);
}
