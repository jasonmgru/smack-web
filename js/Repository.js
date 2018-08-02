class Repository {
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

        this.databaseReference = firebase.database().ref("events");
        this.events = new ObservableList();
        this.databaseReference.on("child_added", (data) => this.events.push(data.val()));

        console.log("Repository initialized.");
    }
}