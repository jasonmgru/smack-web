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
     * Signs up a new user with an email and password.
     * 
     * @param {string} email The email to sign the user up with.
     * @param {string} password The password to sign the user up with.
     */
    signUpWithEmailAndPassword(first, last, email, password) {
        var user = {
            first: first,
            last: last,
            email: email
        }
        var key = firebase.database().ref("users").push().key;
        firebase.database().ref("/users/"+key).set(user, error => {if (error) console.log(error)});

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
            console.log(error);
        });
    }

    /**
     * This function signs the user in with a standard email and password
     * combination.
     * 
     * @param {String} email The email to sign in with.
     * @param {String} password The user's password.
     */
    signInWithEmailAndPassword(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
            console.log(error);
        });
    }

    /**
     * Sends an email to the given email address to reset the password.
     * 
     * @param {string} email 
     */
    resetPassword(email) {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            console.log("email sent.");
        }).catch(error => {
            console.log(error);
        });
    }

    /**
     * Signs out.
     */
    signOut() {
        firebase.auth().signOut().catch(error => {
            console.log(error);
        });
    }

    /**
     * Called when the auth state changes. Updates the user object so other
     * elements of the program can deal with it. The user is a fleshed out 
     * object if someone is signed in, otherwise the user is set to null.
     * 
     * @param {object} user The user object to be observed.
     */
    onAuthStateChanged(user) {
        if (user) {
            this.user.set({
                uid: user.uid,
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
        this.user = new Observable(null);

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

        firebase.auth().onAuthStateChanged(user => this.onAuthStateChanged(user));


        console.log("Repository initialized.");
    }
}