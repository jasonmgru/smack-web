
const MINNEAPOLIS = {center: {lat: 44.975297, lng: -93.233003}, zoom: 15.5}
const ST_PAUL = {center: {lat: 44.984923, lng: -93.183673}, zoom: 16.0}
const ALL = {center: {lat: 44.976859, lng: -93.215119}, zoom: 13.0}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: MINNEAPOLIS.center,
    zoom: MINNEAPOLIS.zoom
  });
}