import Model from "./Model";
import View from "./View";

/**
 * Start the app when windows has loaded.
 */
window.addEventListener("load", () => {
   new View(new Model());
});
