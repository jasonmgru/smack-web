/**
 * Technically still a part of the ViewController, I decided to create an
 * adapter (https://www.tutorialspoint.com/design_pattern/adapter_pattern.htm).
 * This adapter bridges the gap between the GoogleMap and the ViewController. 
 * 
 * This could be done inside the ViewController class, but the functionality
 * is distinct enough that it makes sense to give it its own class. Now, 
 * aside from the creation of this adapter, there is no reference to Google 
 * Maps inside the ViewController class.
 */
class GoogleMapAdapter {

    /**
     * Opens a given infowindow over a given marker. Closes previously opened 
     * InfoWindow if there was one open.
     * 
     * @param {google.maps.InfoWindow} infowindow The given InfoWindow.
     * @param {google.maps.Marker} marker The given Marker.
     */
    openInfoWindow(infowindow, marker) {
        if (infowindow === this.infowindow) return;
        if (this.infowindow != null) this.infowindow.close();
        this.infowindow = infowindow;
        this.infowindow.open(this.map, marker);
    }

    /**
     * Centers the map over an event's marker. Uses the event's lat and lng
     * to find map location. Uses internally stored map (data structure) to
     * find correct map marker and infowindow to open. 
     * 
     * @param {object} event The event to be focused on.
     */
    centerMapOnEvent(event) {
        if (!event) return;
        this.map.panTo({lat: event.lat, lng: event.lng});
        var infowindow = this.markers[event.key].infowindow;
        var marker = this.markers[event.key].marker;
        this.openInfoWindow(infowindow, marker);
    }

    /**
     * Function that centers the map on a predefined, hardcoded location.
     * 
     * @param {String} location The location to center on
     *                          NOTE: This MUST BE either "mpls" or "stpl"
     */
    centerMapOnLocation(location) {
        if (location === "mpls") {
            this.map.panTo(MINNEAPOLIS.center);
            this.map.setZoom(MINNEAPOLIS.zoom);
        } else if (location === "stpl") {
            this.map.panTo(ST_PAUL.center);
            this.map.setZoom(ST_PAUL.zoom);
        }
    }
    
    /**
     * Adds a marker to the GoogleMap and hooks it up with the right behavior.
     * This means:
     *      1. Creates the Marker on the GoogleMap
     *      2. Creates the UI for the InfoWindow
     *      3. Hooks up the Marker to the InfoWindow
     *      4. Hooks up the InfoWIndow to onInfoWindowClicked() (NOTE 1)
     *      5. Associates the Marker and InfoWindow with the event (NOTE 2)
     * 
     * NOTE 1: The onInfoWindowClicked function is externally injected 
     *         so the ViewController can open a modal when the InfoWindow is
     *         clicked.
     * 
     * NOTE 2: The Marker and the InfoWindow should be associated with the
     *         event so the ViewController can tell the GoogleMapAdapter to
     *         center the map on an event without knowing anything about 
     *         Markers or InfoWindows.
     * 
     * @param {object} event 
     * @param {(object) => void} onInfoWindowClicked 
     */
    addMarker(event, onInfoWindowClicked = ((event) => {})) {
        // Create the Marker
        var position = {lat: parseFloat(event.lat), lng: parseFloat(event.lng)};
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: event.title
        });

        // Create the UI for the InfoWindow
        var clickable = document.createElement("div");
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

        // Hook up the Marker to the InfoWindow
        marker.addListener("mouseover", () => this.openInfoWindow(infowindow, marker));
        infowindow.addListener("closeclick", () => {
            this.infowindow = null;
        });

        // Hook up the InfoWindow to the onInfoWindowClicked function
        clickable.addEventListener("click", () => onInfoWindowClicked(event));

        // Associate the Marker and InfoWindow with the event
        this.markers[event.key] = {marker: marker, infowindow: infowindow};
    }

    /**
     * Removes a marker from the map given an event associated with it.
     * 
     * @param {object} event The event whose marker should be removed.
     */
    removeMarker(event) {
        var marker = this.markers[event.key].marker;
        delete this.markers[event.key];
        marker.setMap(null);
    };

    /**
     * Constructor.
     * 
     * @param {google.maps.Map} map 
     */
    constructor(map) {
        this.map = map;
        this.infowindow = null;
        
        this.markers = {};
    }
}