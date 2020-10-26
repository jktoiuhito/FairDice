import Model from "./Model/Model";
import { Id } from "./View/Id";
import View from "./View/View";

/**
 * Start the app when windows has loaded.
 */
window.addEventListener("load", () => {
   try {
      new View(new Model());
   } catch (error) {
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById(Id.AppleError)!.hidden = false;
   }
});
