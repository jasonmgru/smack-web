/**
 * Class which holds data and also notifies any observing functions
 * of a data change.
 */
class Observable {
    /**
     * Adds a function to the observers list. Whenever the data in this object is 
     * updated, all observers are called with the new value passed in as a
     * parameter.
     * 
     * @param {(*) => void} observer The observer to be added.
     * @param {boolean} notifyOnSubscribe Whether or not to notify the subscriber on subscribe.
     */
    subscribe(observer, notifyOnSubscribe = true) {
        this.observers.push(observer);
        if (notifyOnSubscribe) observer(this.value);
    }

    /**
     * Removes a function from the observers list.
     * 
     * @param {(*) => void} observer The observer to be removed.
     */
    unsubscribe(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    /**
     * Sets the value of the data and notifies observers.
     * 
     * @param {*} newValue The new value for the data.
     */
    set(newValue) {
        if (newValue !== this.value) {
            this.value = newValue;
            this.observers.forEach((observer) => observer(this.value));
        }
    }

    constructor(value) {
        this.value = value;
        this.observers = [];
    }
}

/**
 * Class which holds lists of data and also notifies any observing functions
 * of a data change.
 */
class ObservableList {
    /**
     * Adds a function to the observers list. Whenever the data in this object is 
     * updated, all observers are called with the new value passed in as a
     * parameter.
     * 
     * @param {(number, *) => void} observer The observer to be added.
     * @param {boolean} notifyOnSubscribe Whether or not to notify the subscriber on subscribe.
     */
    subscribe(observer, notifyOnSubscribe = true) {
        this.observers.push(observer);
        if (notifyOnSubscribe) {
            this.value.forEach( (value, index) => {
                observer(index, value);
            });
        }
    }

    /**
     * Removes a function from the observers list.
     * 
     * @param {(number, *) => void} observer The observer to be removed.
     */
    unsubscribe(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    /**
     * Pushes a new value to the list and notifies observers of the index of the change.
     * 
     * @param {*} newValue The new value for the data.
     */
    push(newValue) {
        this.value.push(newValue);
        this.observers.forEach((observer) => observer(this.value.length-1, newValue));
    }

    constructor() {
        this.value = [];
        this.observers = [];
    }
}

/**
 * Class which holds assiciative maps of data and also notifies any observing functions
 * of a data change.
 */
class ObservableMap {
    /**
     * Adds a function to the observers list. Whenever the data in this object is 
     * updated, all observers are called with the new value passed in as a
     * parameter.
     * 
     * @param {(String, *) => void} observer The observer to be added.
     * @param {boolean} notifyOnSubscribe Whether or not to notify the subscriber on subscribe.
     */
    subscribe(observer, onRemoveObserver = null, notifyOnSubscribe = true) {
        this.observers.push(observer);
        if (onRemoveObserver !== null) this.onRemoveObservers.push(onRemoveObserver);
        if (notifyOnSubscribe) {
            Object.entries(this.value).forEach(([key, value]) => {
                observer(key, value);
            });
        }
    }

    /**
     * Removes a function from the observers list.
     * 
     * @param {(String, *) => void} observer The observer to be removed.
     */
    unsubscribe(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) this.observers.splice(index, 1);
    }

    /**
     * Pushes a new value to the map at specified key and notifies observers of the key of the change.
     * 
     * @param {*} newKey The key to push to.
     * @param {*} newValue The new value for the data.
     */
    add(newKey, newValue) {
        this.value[newKey] = newValue;
        this.observers.forEach((observer) => observer(newKey, newValue));
    }

    /**
     * When an item is removed from the map, the "on remove" observers are
     * called to handle an item being removed.
     * 
     * @param {String} key 
     */
    remove(key) {
        this.onRemoveObservers.forEach(onRemoveObserver => onRemoveObserver(key, this.value[key]));
    }

    constructor() {
        this.value = {};
        this.observers = [];
        this.onRemoveObservers = [];
    }
}