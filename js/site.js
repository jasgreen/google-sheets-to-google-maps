// 0: "Primary Town Name (Plain Text)"
// 1: "Primary Town Name (Diacritical)"
// 2: "Alternate Names"
// 3: "Legacy Name"
// 4: "USBGN"
// 5: "Latitude"
// 6: "Longitude"
// 7: "Lat #"
// 8: "Lon #"
// 9: "Existing Region"
// 10: "Region Vlookup based on N"
// 11: "KL Conflict"
// 12: "Existing Subregion"
// 13: "Subregion Vlookup based on U SUBREGION IS NO LONGER BASED ON RESEARCH AREA"
// 14: "N-O Conflict"
// 15: "Review Region/Subregion"
// 16: "Gubernia / Kingdom/ Prussian Provinz 1907"
// 17: "Uyezd-District (Congress Poland) / County (Galicia) / 1907"
// 18: "Area Coordinator Autofill based on Q"
// 19: "Research Area"
// 20: "Area Coordinator 1 discrepencies from P"
// 21: "Area Coordinator  2  (auto fill)"
// 22: "Town Leader 1"

var map;
var locations = [];
var columns = {};

function initialiseMap() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1-BT1dAzjt--Z9e62jK6P-duZZC_MdVuwhJo8QIihL-Y/values/Town%20Master!B2:AF?key=AIzaSyAMjGnUY0SonztgIaWqRBdeOWfM0Fx1CVY", function(data) {
    	$(data.values).each(function(i) {
        if(i === 0){
          this.forEach(function(column, colIndex) {
            switch (column) {
              case 'Primary Town Name (Plain Text)':
                columns.title = colIndex;
                break;
              case 'Alternate Names':
                columns.alternativeName = colIndex;
                break;
              case 'Research Area':
                columns.researchArea = colIndex;
                break;
              case 'Legacy Name':
                columns.legacyName = colIndex;
                break;
              case 'Existing Subregion':
                columns.subregion = colIndex;
                break;
              case 'Region Vlookup based on N':
                columns.region = colIndex;
                break;
              case 'Lat #':
                columns.latitude = colIndex;
                break;
              case 'Lon #':
                columns.longitude = colIndex;
                break;
              case 'Area Coordinator Autofill based on Research Area':
                columns.areaCoordinator = colIndex;
                break;
              case 'Town Leader 1':
                columns.townLeader = colIndex;
                break;
              default:
                break;
            }
          });
          // console.log(columns);
        } else {
      		var location = {};
  				location.id = i+1; // add one to normalize zero-index array
  				location.title = this[columns.title];
  				location.alternativeName = this[columns.alternativeName];
  				location.researchArea = this[columns.researchArea];
  				location.legacyName = this[columns.legacyName];
  				location.subregion = this[columns.subregion];
  				location.region = this[columns.region];
  				location.latitude = parseFloat(this[columns.latitude]);
          location.longitude = parseFloat(this[columns.longitude]);
          location.areaCoordinator = this[columns.areaCoordinator] || '';
          location.townLeader = this[columns.townLeader] || '';
          locations.push(location);
        }
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
      fillColor:stringToColour("ZZ" + location.researchArea.replace(/aeiou/i, '')),
      fillOpacity: 1,
      strokeColor: stringToColour("AA" + location.researchArea.replace(/aeiou/i, '')),
      strokeWeight: 1,
      scale: 7
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>Row #' + location.id + '</strong>'+
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
