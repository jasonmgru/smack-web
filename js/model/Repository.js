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
        this.databaseReference.push(event);
    }

    /**
     * Adds a user to Firebase Authentication. I'm pretty sure Google handles
     * password encryption, so I don't.
     * 
     * @param {String} email 
     * @param {String} password 
     */
    signInWithEmailAndPassword(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            console.log("CODE: " + error.code + ", MSG: " + error.message);
            if (error.code === "auth/user-not-found") {
                firebase.auth().createUserWithEmailAndPassword(email, password)
            }
        });
    }

    /**
     * Callback, called when the user's auth state changes 
     * (i.e. user is logged in/out).
     * 
     * @param {firebase.User} user 
     */
    onAuthStateChanged(user) {
        if (user) {
            this.user.set({
                email: user.email
            });
        } else {
            this.user.set(null);
        }
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
        this.user = new Observable(firebase.auth().currentUser);
        this.addUserError = new Observable("");

        this.databaseReference = firebase.database().ref("events");
        this.databaseReference.on("child_added", data => {
            var event = data.val();
            event.key = data.key;
            this.events.add(event.key, event);
            console.log(event);
        }, error => {
            console.log("Client does not have permission to read from database.");
        });

        firebase.auth().onAuthStateChanged((user) => this.onAuthStateChanged(user));

        console.log("Repository initialized.");
    }
}