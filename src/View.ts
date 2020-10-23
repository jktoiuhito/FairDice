import { Assert } from "@jktoiuhito/utility";

const enum Id {
   Dice = "dice",
   Results = "results",
   Controls = "controls",
   PreviousButton = "button-previous",
   NextButton = "button-next",
   NewThrowButton = "button-new",
}

/**
 * Object responsible for managing the DOM.
 */
export default class View {
   private readonly Dice: HTMLDivElement;
   private readonly Results: HTMLDivElement;
   private readonly Controls: HTMLElement; // <footer>

   private readonly PreviousButton: HTMLButtonElement;
   private readonly NextButton: HTMLButtonElement;
   private readonly NewThrowButton: HTMLButtonElement;

   public constructor() {
      // Get references to UI elements
      this.Dice = this.GetElementById<HTMLDivElement>(Id.Dice);
      this.Results = this.GetElementById<HTMLDivElement>(Id.Results);
      this.Controls = this.GetElementById<HTMLElement>(Id.Controls);
      this.PreviousButton = this.GetElementById<HTMLButtonElement>(
         Id.PreviousButton
      );
      this.NextButton = this.GetElementById<HTMLButtonElement>(Id.NextButton);
      this.NewThrowButton = this.GetElementById<HTMLButtonElement>(
         Id.NewThrowButton
      );

      // Display hidden elements
      this.Dice.hidden = false;
      this.Results.hidden = false;
      this.Controls.hidden = false;

      // Add event listeners to buttons (temporary!)
      this.PreviousButton.addEventListener("click", () => {
         console.log("previous");
      });
      this.NextButton.addEventListener("click", () => {
         console.log("next");
      });
      this.NewThrowButton.addEventListener("click", () => {
         console.log("new throw");
      });
   }

   private readonly GetElementById = <T extends HTMLElement>(id: Id): T => {
      return Assert(
         document.getElementById(id)
      ).isObject.isNotNull.isInstanceOf(HTMLElement).value as T;
   };
}
