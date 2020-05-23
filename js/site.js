var map;
var locations = [];

function initialiseMap() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1-BT1dAzjt--Z9e62jK6P-duZZC_MdVuwhJo8QIihL-Y/values/Town%20Master!B2:X?key=AIzaSyAMjGnUY0SonztgIaWqRBdeOWfM0Fx1CVY", function(data) {
    	$(data.values).each(function() {
    		var location = {};
				location.title = this[0];
				location.alternativeName = this[2];
				location.researchArea = this[19];
				location.legacyName = this[3];
				location.subregion = this[12];
				location.region = this[10];
				location.latitude = parseFloat(this[7]);
        location.longitude = parseFloat(this[8]);
        location.areaCoordinator = this[18] || '';
        location.townLeader = this[22] || '';
        locations.push(location);
    	});

      var mapStyle = [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ];

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        mapTypeControlOptions: {
          mapTypeIds: ['mapStyle', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
        },
        mapTypeId: 'mapStyle',
        zoom: 7,
        center: new google.maps.LatLng(51.9194, 19.1451)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      map.mapTypes.set('mapStyle', new google.maps.StyledMapType(mapStyle, { name: 'Custom Map Style' }));

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
      fillColor:stringToColour(location.researchArea.replace(/aeiou/i, '')),
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 1,
      scale: 7
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>Primary Town Name</strong><br/> ' + location.title + '</p>' +
    '<p><strong>Research Area</strong><br/> ' + location.researchArea + '</p>' +
    '<p></p>' +
    '<p><strong>Subregion</strong><br/> ' + location.subregion + '</p>' +
    '<p><strong>Region</strong><br/> ' + location.region + '</p>' +
    '<p></p>' +
    '<p><strong>Area Coordinator</strong><br/> ' + location.areaCoordinator + '</p>' +
    '<p><strong>Town Leader</strong><br/> ' + location.townLeader + '</p>' +
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
