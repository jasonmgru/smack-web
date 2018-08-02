const MINNEAPOLIS = {center: {lat: 44.975297, lng: -93.233003}, zoom: 15.5}
const ST_PAUL = {center: {lat: 44.984923, lng: -93.183673}, zoom: 16.0}
const ALL = {center: {lat: 44.976859, lng: -93.215119}, zoom: 13.0}

/**
 * ViewController class. This sort of represents the "code-behind" for the html and css.
 * The idea of this class is that it only handles the view logic. Business logic will 
 * be handled in the ViewModel, which is a dependency injected in the constructor.
 * 
 * This is the only class in all of my code which should have any reference to the 
 * document.
 */
/* SINGLETON */ class ViewController {

    /**
     * initGoogle is called after Google Maps and Places are successfully reached.
     */
    initGoogle() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: MINNEAPOLIS.center,
            zoom: MINNEAPOLIS.zoom
        });

        this.viewModel.data.subscribe( (event, index) => {
            this.addMarkerAndListItem(event);
        });
        
        this.autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('address')));
            
        var viewModelCapture = this.viewModel;
        var autocompleteCapture = this.autocomplete;
        this.autocomplete.addListener('place_changed', function() {
            var place = autocompleteCapture.getPlace();
            if (place) {
                viewModelCapture.lat = place.geometry.location.lat();
                viewModelCapture.lng = place.geometry.location.lng();
            }
        });
    }

    addMarkerAndListItem(event) {
        this.list.innerHTML += 
            "<li "+"id="+event.key+" class='list-group-item list-group-item-action'>" 
            + event.title + "</li>";
        var position = {lat: parseFloat(event.lat), lng: parseFloat(event.lng)};
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: event.title
        });
        var infowindow = new google.maps.InfoWindow({
            content: "<h5>" + event.title + "</h5>" + 
                     "<p>" + event.start + " - " + event.end + "</p>" 
        });
        marker.addListener("click", () => {
            if (this.infowindow != null) this.infowindow.close();
            this.infowindow = infowindow;
            this.infowindow.open(this.map, marker);
        });
    }
      
    /**
     * Called when the user presses one of the radio buttons in the bottom right of the screen.
     * 
     * @param {Event} event The button press event.
     */
    onRadioButtonPressed(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        if (target.id == "mpls") {
            this.map.panTo(new google.maps.LatLng(MINNEAPOLIS.center.lat, MINNEAPOLIS.center.lng));
            this.map.setZoom(MINNEAPOLIS.zoom);
        } else if (target.id == "stpl") {
            this.map.panTo(new google.maps.LatLng(ST_PAUL.center.lat, ST_PAUL.center.lng));
            this.map.setZoom(ST_PAUL.zoom);
        }
    }

    /**
     * Called when the user presses submit to create a new event.
     * 
     * @param {Event} e The event triggering this function.
     */
    onSubmitButtonPressed(e) {
        e.preventDefault();
    
        if (this.viewModel.lat == null || this.viewModel.lng == null) {
            alert("Invalid address! Try clicking on one of the suggested addresses when typing.");
            return;
        }

        var event = {}
        document.getElementsByName("add-event-input").forEach(function(element){
            event[element.id] = element.value;
        });
        this.viewModel.addEvent(event);
        $("#addEventModal").modal("toggle");
    }

    /**
     * Constructor.
     * 
     * @param {ViewModel} viewModel the view model that this view observes.
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.map;
        this.autocomplete;
        this.infowindow;
        this.list = document.getElementById("events-list");

        document.getElementById("add_event_form").addEventListener("submit", (event) => this.onSubmitButtonPressed(event));
        
        console.log("ViewController initialized.");
    }
}