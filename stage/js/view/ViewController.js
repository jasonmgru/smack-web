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
        this.mapAdapter = new GoogleMapAdapter(
            new google.maps.Map(document.getElementById('map'), {
                center: MINNEAPOLIS.center,
                zoom: MINNEAPOLIS.zoom,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [{
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                              { visibility: "off" }
                        ]
                    }]
            }
        ));

        // Add markers to map
        this.viewModel.events.subscribe( (key, event) => {
            this.mapAdapter.addMarker(event, (event) => this.openDetailWindow(event));
            this.addListItem(event);
        }, (key, event) => {
            this.mapAdapter.removeMarker(event);
            this.removeListItem(event);
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
     * Adds a list item to the list for a given event.
     * This function is pretty long, but it's mostly UI formatting.
     * 
     * @param {object} event The event to be added.
     */
    addListItem(event) {
        var title = document.createElement("span");
        var location = document.createElement("img");
        title.style.fontFamily = "smack-sub";
        title.innerHTML = event.title;
        location.classList.add("location-icon-detail");
        location.src = "img/location.svg";
        location.addEventListener("click", (e) => {
            this.mapAdapter.centerMapOnEvent(event);
            e.stopPropagation();
        });
        var li = document.createElement("li");
        li.addEventListener("click", () => {
            this.mapAdapter.centerMapOnEvent(event);
            this.openDetailWindow(event);
        });
        li.classList.add("list-group-item");
        li.classList.add("list-group-item-action");
        li.id = event.key+"li";
        li.appendChild(title);
        li.appendChild(location);
        document.getElementById("events-list").appendChild(li);
    }

    /**
     * Removes an event from the events list.
     * 
     * @param {object} event The event to be removed.
     */
    removeListItem(event) {
        var li = document.getElementById(event.key+"li");
        li.parentNode.removeChild(li);
    }

    /**
     * Called when a list item or info window is clicked. Opens a modal
     * to display event details.
     * 
     * @param {object} event 
     */
    openDetailWindow(event) {
        document.getElementById("address-display").innerHTML = event.address;
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
        this.mapAdapter.centerMapOnLocation(target.id);
    }

    /**
     * Called when the user presses submit to create a new event.
     * 
     * @param {Event} e The event triggering this function.
     */
    onAddEventSubmitButtonPressed(e) {
        e.preventDefault();
        var event = {}
        document.getElementsByName("add-event-input").forEach(function(element){
            event[element.id] = element.value;
        });
        this.viewModel.addEvent(event);
    }

    /**
     * Called when the user presses reset in add event form.
     * 
     * @param {Event} e 
     */
    onAddEventResetButtonPressed(e) {
        this.viewModel.addEventError.value = ""
        $('#add-event-alert-collapse').collapse("hide");
    }

    /**
     * Called when the user presses either the events label or the more-less
     * button next to it.
     * 
     * @param {Event} e
     */
    onEventsHeaderPressed(e) {
        var button = document.getElementById("more-less");
        if (button.classList.contains("more-less-transition")) {
            button.classList.remove("more-less-transition");
        } else {
            button.classList.add("more-less-transition");
        }

        $("#events-list-collapse").collapse("toggle");
    }

    /**
     * Called when the authorization state changes. If the user is logged in, 
     * displays the application. If the user is not logged in, displays the 
     * login page. 
     * 
     * @param {object} user 
     */
    onAuthStateChanged(user) {
        if (user) {
            document.getElementById("main-page-container").hidden = false;
            document.getElementById("login-page-container").style.opacity = "0";
            document.getElementById("login-page-container").style.zIndex = "-1";
        } else {
            document.getElementById("login-page-container").style.opacity = "1";
            document.getElementById("login-page-container").style.zIndex = "100";
            document.getElementById("main-page-container").hidden = true;
        }
    }

    /**
     * Constructor. This is fairly long, but it is mostly setting up various UI elements.
     * 
     * @param {ViewModel} viewModel the view model that this view observes.
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.mapAdapter;

        // Hook up error alerts to error in viewModel
        this.viewModel.addEventError.subscribe((errorMessage) => {
            document.getElementById("add-event-alert-title").innerHTML = errorMessage.split(": ")[0];
            document.getElementById("add-event-alert-body").innerHTML = " " + errorMessage.split(": ")[1];
            $("#add-event-alert-collapse").collapse("show");
        }, false);

        // Hook up the datetimepickers to each other
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
        
        document.onkeyup = (event) => {
            if (event.keyCode == 32)
                this.onAuthStateChanged({name: "Jason"});
        };

        console.log("ViewController initialized.");
    }
}