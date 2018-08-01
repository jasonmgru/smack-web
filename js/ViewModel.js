/**
 * ViewModel is the abstraction layer between the view (ViewController and index.html) 
 * and the model (Repository). This is really nice because what if I want to switch 
 * from Firebase to Azure? This code doesn't need to change at all.
 */
class ViewModel {

    /**
     * Listens for new events being added to the database.
     * 
     * @param {DatabaseSnapshot} data The data being added to the database.
     */
    eventAddedHandler(data) {
        console.log(JSON.stringify(data.val()));
    } 

    /**
     * Gets a newly created from UI, adds some fields behind the scenes, and 
     * passes it to Repository to add to database.
     * 
     * @param {object} event The event to be added.
     */
    addEvent(event) {
        event["latutide"] = this.lat;
        event["longitude"] = this.lng;
        this.lat = null;
        this.lng = null;

        this.repository.databaseReference.push(event);
    }

    /**
     * Constructor.
     * 
     * @param {Repository} repository The Repository that connects to the database.
     */
    constructor(repository) {
        this.repository = repository;
        this.repository.databaseReference.on("child_added", (data) => this.eventAddedHandler(data));

        this.lat = null;
        this.lng = null;

        console.log("ViewModel initialized.");
    }
}