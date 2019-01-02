const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

mapboxgl.accessToken = 'pk.eyJ1Ijoicy1jb3Jzbzk4IiwiYSI6ImNqcWUyMnpvZzRwOWg0M3VsMzN3djNmb28ifQ.lRDdx5jejV_1ULgERCxArg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/s-corso98/cjqe23vvqg4562sn1oiiwyi5f',
center: [9.57478,42.92919],
zoom: 1.9
});


const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoicy1jb3Jzbzk4IiwiYSI6ImNqcWUyMnpvZzRwOWg0M3VsMzN3djNmb28ifQ.lRDdx5jejV_1ULgERCxArg' });


var geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }]
  };


  // add markers to map
geojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map 
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    .addTo(map);
  });

  map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));

function length(obj) {
    return Object.keys(obj).length;
}

function createMarkers(){
    $.get("/coordinatore/createMarkers",function(data){
        var size = length(data);
        var i;
        for(i=0;i<size;i++)
        {
            var help = data[i].citta;
            var help2 = data[i].nazione;
            var help3 = data[i].studente.nome;
            var help4 = data[i].studente.cognome;
            
        }
    })

    }
