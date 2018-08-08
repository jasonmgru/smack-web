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
        // Initialize the map
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: MINNEAPOLIS.center,
            zoom: MINNEAPOLIS.zoom
        });

        // Add markers to map
        this.viewModel.data.subscribe( (key, event) => {
            this.addMarkerAndListItem(event);
            console.log(this.viewModel.data);
        });

        // Add autocomplete to Add Event Form
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));
        var viewModelCapture = this.viewModel;
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (place) {
                viewModelCapture.lat = place.geometry.location.lat();
                viewModelCapture.lng = place.geometry.location.lng();
            }
        });
    }

    /**
     * Adds a marker to the map and a list item to the list for a given event.
     * This function is pretty long, but it's mostly UI formatting.
     * 
     * @param {object} event 
     */
    addMarkerAndListItem(event) {
        // Adds marker
        var position = {lat: parseFloat(event.lat), lng: parseFloat(event.lng)};
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: event.title
        });
        var clickable = document.createElement("div");
        clickable.addEventListener("click", () => this.onDetailClicked(event));
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

        // Adds list item
        var title = document.createElement("span");
        var time = document.createElement("span");
        var location = document.createElement("img");
        title.style.fontFamily = "smack-sub";
        title.innerHTML = event.title;
        time.classList.add("time-list-detail");
        time.innerHTML = event.time;
        location.classList.add("location-icon-detail");
        location.src = "img/location.svg";
        location.addEventListener("click", (e) => {
            this.onMarkerIconClicked(event, infowindow, marker);
            e.stopPropagation();
        });
        var li = document.createElement("li");
        li.addEventListener("click", () => {
            this.onMarkerIconClicked(event, infowindow, marker);
            this.onDetailClicked(event);
        });
        li.classList.add("list-group-item");
        li.classList.add("list-group-item-action");
        li.appendChild(title);
        li.appendChild(time);
        li.appendChild(location);
        this.list.appendChild(li);
    }

    /**
     * Opens an infowindow to the ViewController's map above a given marker.
     * If there is another infowindow open, closes it first.
     * 
     * @param {google.maps.InfoWindow} infowindow 
     * @param {google.maps.Marker} marker 
     */
    openInfoWindow(infowindow, marker) {
        if (this.infowindow != null) this.infowindow.close();
        this.infowindow = infowindow;
        this.infowindow.open(this.map, marker);
    }

    /**
     * Called when a marker on the map is clicked. Opens an infowindow
     * above the given marker and pans the map to its position.
     * 
     * @param {object} event 
     * @param {google.maps.InfoWindow} infowindow 
     * @param {google.maps.Marker} marker 
     */
    onMarkerIconClicked(event, infowindow, marker) {
        this.map.panTo({lat: event.lat, lng: event.lng});
        this.openInfoWindow(infowindow, marker);
    }

    /**
     * Called when a list item or info window is clicked. Opens a modal
     * to display event details.
     * 
     * @param {object} event 
     */
    onDetailClicked(event) {
        document.getElementById("address-display").innerHTML = event.address;
        document.getElementById("address-display").addEventListener("click", () => $('#eventDetailModal').modal('hide'));
        document.getElementById("title-display").innerHTML = event.title;
        document.getElementById("host-display").innerHTML = event.host;
        document.getElementById("time-display").innerHTML = event.time;
        document.getElementById("description-display").innerHTML = event.description;
        $('#eventDetailModal').modal('show');
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
            this.map.panTo(MINNEAPOLIS.center);
            this.map.setZoom(MINNEAPOLIS.zoom);
        } else if (target.id == "stpl") {
            this.map.panTo(ST_PAUL.center);
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

        var event = {}
        document.getElementsByName("add-event-input").forEach(function(element){
            event[element.id] = element.value;
        });
        this.viewModel.addEvent(event);
    }

    onResetButtonPressed(e) {
        $('#add-event-alert-collapse').collapse("hide");
    }

    /**
     * Constructor.
     * 
     * @param {ViewModel} viewModel the view model that this view observes.
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.map;
        this.infowindow;
        this.list = document.getElementById("events-list");
        this.addEventAlertTitle = document.getElementById("add-event-alert-title");
        this.addEventAlertBody = document.getElementById("add-event-alert-body");

        this.viewModel.error.subscribe((errorMessage) => {
            var errorTitle = errorMessage.split(": ")[0];
            var errorBody = errorMessage.split(": ")[1];

            this.addEventAlertTitle.innerHTML = errorTitle;
            this.addEventAlertBody.innerHTML = " " + errorBody;
            $('#add-event-alert-collapse').collapse("show");
            console.log("notified");
        });

        this.viewModel.success.subscribe((successMessage) => {
            $('#add-event-alert-collapse').collapse("hide");
            $("#addEventModal").modal("hide");
        });

        $('#start').datetimepicker();
        $('#end').datetimepicker({
            useCurrent: false
        });
        $("#start").on("change.datetimepicker", function (e) {
            $('#end').datetimepicker('minDate', e.date);
        });
        $("#end").on("change.datetimepicker", function (e) {
            $('#start').datetimepicker('maxDate', e.date);
        });
        
        console.log("ViewController initialized.");
    }
}