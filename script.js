  var cityID = 6167865;
  var key = 'fe692e6f7fc6afc8b2dde67841dbabe0';
  var url = 'https://api.openweathermap.org/data/2.5/weather?id='+cityID+'&appid='+key;

  var xhr = new XMLHttpRequest();	  // Create XMLHttpRequest object
  
  xhr.onload = function()			      // When readystate changes
  {
  	if(xhr.status === 200)			    //If server status was ok
    {
    	responseObject = JSON.parse(xhr.responseText);
        
      // Build up string with new content (could also use DOM manipulation)
      var fahrenheit = Math.round(((parseFloat(responseObject.main.temp)-273.15)*1.8)+32);
      var newContent = "";

      newContent += '<div >';
      newContent += '<p>' + responseObject.weather[0].description + '</p>';
      newContent += '<p>' + fahrenheit + '</p>';
      newContent += '</div>';

      //update the page with the new content
      document.getElementById('description').innerHTML = newContent;
    }
  };
  
  xhr.open('GET', url, true);	  // prepare the request
  xhr.send(null);				        // send the request

