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

        this.repository.addEvent(event);
        this.success.set("Success: Added event '" + event.title + "'");
    }

    positionIsValid() {
        return false;
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
     * @param {Repository} repository The Repository that connects to the database.
     */
    constructor(repository) {
        this.data = repository.events; // This is a pass-through observable list from repo
        this.error = new Observable("");
        this.success = new Observable("");

        this.repository = repository;

        this.lat = undefined;
        this.lng = undefined;

        console.log("ViewModel initialized.");
    }
}