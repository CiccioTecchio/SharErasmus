mapboxgl.accessToken = 'pk.eyJ1Ijoicy1jb3Jzbzk4IiwiYSI6ImNqcWUyMnpvZzRwOWg0M3VsMzN3djNmb28ifQ.lRDdx5jejV_1ULgERCxArg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/s-corso98/cjqe23vvqg4562sn1oiiwyi5f',
center: [9.57478,42.92919],
zoom: 1.9
});

//GEOCODING 
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
    }); 
map.addControl(geocoder);

function length(obj) {
    return Object.keys(obj).length;
}

function createMarkers(){
    $.get("/coordinatore/createMarkers",function(data){
     
        var size = length(data);
        var i;
        var j;
        for(i=0;i<size;i++)
        {
            let help = data[i].citta;
            let help2 = data[i].nazione;
           // let help3 = data[i].studente.nome;
           // let help4 = data[i].studente.cognome;
            //FORWARD GEOCODING
            var mapboxClient = mapboxSdk({accessToken: mapboxgl.accessToken})
            mapboxClient.geocoding.forwardGeocode({
            query: help+","+help2,
            autocomplete: false,
            limit: 1
            })
            .send()
            .then(function (response) {
              if (response && response.body && response.body.features && response.body.features.length) {
              var feature = response.body.features[0];
              var marker = new mapboxgl.Marker()
              marker.setLngLat(feature.center)
              .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML('<h3>' + help + '</h3><span onclick="studentsNumber()"><u>Numero studenti che sono stati o sono qui?Clicca qui</u></span>'))
              .addTo(map);
              }
            });
            
        }
    })

  }


  function studentsNumber(){
    var citt = $("h3").text();
    $.get("/coordinatore/obtainNumber?city="+citt,function(data){
      $("u").html("<h3>"+data+"</h3>");
    })
    
      
  };
  
