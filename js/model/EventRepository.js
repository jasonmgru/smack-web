/**
 * The repository is responsible for accessing the database and putting data in a nice, abstracted 
 * layer for the rest of the program. The idea is that all of the database-specific code goes here,
 * so I could create a different repository for a different database (say Azure) and the rest of 
 * the code would work the same. Also, the repo is responsible for caching data and seamlessly
 * integrating the cached data with the data fetched from the database.
 */
/* SINGLETON */ class EventRepository {
    /**
     * Adds an event to the database.
     * 
     * @param {object} event The event to be added. 
     */
    addEvent(event) {
        this.databaseReference.push(event);
    }

    /**
     * Returns a "pretty" time field for the incoming event objects. The first
     * item is the date, then the time range. If the start and end of the 
     * event are on the same day, it removes the date from the second 
     * half of the time range.
     * 
     * @param {String} start The start datetime
     * @param {String} end The end datetime
     * 
     * @returns {String} The newly formatted time range.
     */
    getPrettyTimeRange(start, end) {
        var startParts = start.split(" ");
        var endParts = end.split(" ");

        if (startParts[0] === endParts[0]) {
            return (startParts[0] + " " + startParts[1] + startParts[2] + 
                " - " + endParts[1] + endParts[2]).toLowerCase();
        }
        return (startParts[0] + " " + startParts[1] + startParts[2] + 
        " - " + endParts[0] + " " + endParts[1] + endParts[2]).toLowerCase();
    }

    /**
     * Constructor.
     */
    constructor() {
        var config = {
            apiKey: "AIzaSyAcPFkXHGIUYA9S0QQ6ZJwuO4x3VGrwF4g",
            authDomain: "smack-211603.firebaseapp.com",
            databaseURL: "https://smack-211603.firebaseio.com",
            projectId: "smack-211603",
            storageBucket: "smack-211603.appspot.com",
            messagingSenderId: "658435394848"
        };
        firebase.initializeApp(config);

        this.events = new ObservableMap();
        this.databaseReference = firebase.database().ref("events");
        this.databaseReference.on("child_added", data => {
            var event = data.val();
            event.key = data.key;
            event.time = this.getPrettyTimeRange(event.start, event.end);
            this.events.add(event.key, event);
            console.log(event);
        }, error => {
            console.log("Client does not have permission to read from database.");
        });

        console.log("EventRepository initialized.");
    }
}