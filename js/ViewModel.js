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
        event["lat"] = this.lat;
        event["lng"] = this.lng;
        this.lat = null;
        this.lng = null;

        this.repository.addEvent(event);
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

        this.repository = repository;

        this.lat;
        this.lng;

        console.log("ViewModel initialized.");
    }
}