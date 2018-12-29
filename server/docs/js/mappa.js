loadJSON(function (response){
    mapboxgl.accessToken = JSON.parse(response).apikey;
});
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

function loadJSON(callback)
{
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET","../../mapbox_apikey.json",true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status=="200")
        {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}