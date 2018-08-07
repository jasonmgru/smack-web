
/**
 * This script sets up the whole environment for the web app. This uses the MVVM (Model-View-ViewModel)
 * architecture to handle view and business logic separately. The view consists of 
 * the ViewController (code-behind for view), index.html, any css, and custom 
 * behavior scripts (like draggable_behavior.js). The ViewModel is an abstraction 
 * layer between the View and the Model, holding the most current version of the data and
 * containing functionality to update the model. The Model is the repository (named after
 * the repository pattern), which communicates with the database (currently Firebase).
 * 
 * This script also uses the depenency injection pattern, where objects that are dependent on 
 * one another are passed through the constructor, rather than initialized inside the dependent object.
 */

var repository = new Repository(); // Model
var viewModel = new ViewModel(repository); // ViewModel
var viewController = new ViewController(viewModel); // View