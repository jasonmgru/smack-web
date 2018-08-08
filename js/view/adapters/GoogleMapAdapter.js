class GoogleMapAdapter {

    openInfoWindow(infowindow, marker) {
        if (this.infowindow != null) this.infowindow.close();
        this.infowindow = infowindow;
        this.infowindow.open(this.map, marker);
    }

    centerMapOnEvent(event) {
        this.map.panTo({lat: event.lat, lng: event.lng});
        var infowindow = this.markers[event.key].infowindow;
        var marker = this.markers[event.key].marker;
        this.openInfoWindow(infowindow, marker);
    }

    centerMapOnLocation(location) {
        if (location === "mpls") {
            this.map.panTo(MINNEAPOLIS.center);
            this.map.setZoom(MINNEAPOLIS.zoom);
        } else if (location === "stpl") {
            this.map.panTo(ST_PAUL.center);
            this.map.setZoom(ST_PAUL.zoom);
        }
    }
    
    addMarker(event, onInfoWindowClicked = ((event) => {})) {
        var position = {lat: parseFloat(event.lat), lng: parseFloat(event.lng)};
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: event.title
        });
        var clickable = document.createElement("div");
        clickable.addEventListener("click", () => onInfoWindowClicked(event));
        clickable.classList.add("infowindow");
        var header = document.createElement("h6");
        header.style.fontFamily = "smack-sub";
        header.style.fontWeight = "bold";
        header.style.margin = 0;
        header.innerHTML = event.title;
        clickable.appendChild(header);
        clickable.innerHTML += event.address.split(",")[0] + "<br>" + 
            "<span style='color: gray;'>" +
                event.host + "<br>" + event.time + 
            "</span>"

        var infowindow = new google.maps.InfoWindow({
            content:clickable
        });
        marker.addListener("click", () => this.openInfoWindow(infowindow, marker));
        this.markers[event.key] = {marker: marker, infowindow: infowindow};
    }

    constructor(map) {
        this.map = map;
        this.infowindow = null;
        
        this.markers = {}
    }
}