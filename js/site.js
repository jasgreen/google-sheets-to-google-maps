var map;
var locations = [];

function initialiseMap() {

  https://docs.google.com/spreadsheets/d/1-BT1dAzjt--Z9e62jK6P-duZZC_MdVuwhJo8QIihL-Y/edit?ts=5ec97a28&pli=1#gid=1278703176

  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1-BT1dAzjt--Z9e62jK6P-duZZC_MdVuwhJo8QIihL-Y/values/Town%20Master!B2:N?key=AIzaSyAMjGnUY0SonztgIaWqRBdeOWfM0Fx1CVY", function(data) {
    	// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    	// Modify the code below to suit the structure of your spreadsheet.
    	$(data.values).each(function() {
    		var location = {};
				location.title = this[0];
				location.alternativeName = this[2];
				location.legacyName = this[3];
				location.subregion = this[12];
				location.latitude = parseFloat(this[7]);
        location.longitude = parseFloat(this[8]);
	  		locations.push(location);
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(51.9194, 19.1451)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  // var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow);
    // bounds.extend(new_marker.position);
  }
  // map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: location.title,
  });
  marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      fillColor:stringToColour(location.subregion),
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 1,
      scale: 7
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>Town</strong> ' + location.title + '</p>' +
    '<p><strong>Alternative Name</strong> ' + location.alternativeName + '</p>' +
    '<p><strong>Legacy Name</strong> ' + location.legacyName + '</p>' +
    '<p><strong>Subregion Name</strong> ' + location.subregion + '</p>' +
    '</div>');
    infowindow.open(map, marker);
  });
  return marker;
}

var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
