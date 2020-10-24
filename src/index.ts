import Model from "./Model/Model";
import View from "./View/View";

/**
 * Start the app when windows has loaded.
 */
window.addEventListener("load", () => {
   new View(new Model());
});
