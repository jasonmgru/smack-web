/**
 * The repository is responsible for accessing the database and putting data in a nice, abstracted 
 * layer for the rest of the program. The idea is that all of the database-specific code goes here,
 * so I could create a different repository for a different database (say Azure) and the rest of 
 * the code would work the same. Also, the repo is responsible for caching data and seamlessly
 * integrating the cached data with the data fetched from the database.
 */
/* SINGLETON */ class Repository {
    /**
     * Adds an event to the database.
     * 
     * @param {object} event The event to be added. 
     */
    addEvent(event) {
        var key = firebase.database().ref("events").push().key;
        firebase.database().ref("/events/"+key).set(event, error => {if (error) console.log(error)});
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
            this.events.add(event.key, event);
            console.log(event);
        }, error => {
            console.log(error);
        });
        this.databaseReference.on("child_removed", data => {
            this.events.remove(data.key);
        }, error => {
            console.log(error);
        });


        console.log("Repository initialized.");
    }
}