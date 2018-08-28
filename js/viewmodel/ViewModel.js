/**
 * ViewModel is the abstraction layer between the view (ViewController and index.html) 
 * and the model (Repository). This is really nice because what if I want to switch 
 * from Firebase to Azure? This code doesn't need to change at all.
 */
/* SINGLETON */ class ViewModel {
    /**
     * Gets a newly created from UI, adds some fields behind the scenes, and 
     * passes it to Repository to add to database.
     * 
     * @param {object} event The event to be added.
     */
    addEvent(event) {
        if (this.lat === undefined || this.lng === undefined || this.lat === null || this.lng === null) {
            this.error.set("Invalid address!: That address could not be found. Try clicking on one of the suggested addresses while typing.");
            return;
        }
        if (!this.positionIsValid()) {
            console.log(this.lat);
            console.log(this.lng);
            this.error.set("Invalid address!: That address is too far away from the University, and won't recieve enough attention. " + 
                           "Remember, you can still privately host events wherever you want, and your friends can still see them!");
            return;
        }

        event["lat"] = this.lat;
        event["lng"] = this.lng;
        this.lat = undefined;
        this.lng = undefined;

        // If everything checks out, tell repo to add event
        this.repository.addEvent(event);
        this.success.set("Success: Added event '" + event.title + "'");
    }

    /**
     * Checks the lat and lng values stored in the viewmodel to see if the 
     * position is close to the University. Returns true if close, false otherwise
     * 
     * @returns true if close to U, false otherwise.
     */
    positionIsValid() {
        // Checks if event is close to Minneapolis campus
        // TODO: check for St. Paul campus too
        return this.lat > 44.964674 && this.lat < 44.988374 &&
               this.lng > -93.251052 && this.lng < -93.206549
    }

    /**
     * Sets the latitude and longitude stored in memory.
     * 
     * @param {number} lat Latitude.
     * @param {number} lng Longitude.
     */
    setLatLng(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        console.log(lat + ", " + lng);
    }

    /**
     * Constructor.
     * 
     * @param {EventRepository} repository The EventRepository that connects to the database.
     */
    constructor(eventRepository) {
        this.data = eventRepository.events; // This is a pass-through observable list from repo
        this.error = new Observable("");
        this.success = new Observable("");

        this.eventRepository = eventRepository;

        this.lat = undefined;
        this.lng = undefined;

        console.log("ViewModel initialized.");
    }
}