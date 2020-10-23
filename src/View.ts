import { Assert } from "@jktoiuhito/utility";
import Model from "./Model";
import Rolls from "./Rolls";

const enum Id {
   Dice = "dice",
   Results = "results",
   Controls = "controls",
   BenchmarkButton = "button-benchmark",
   PreviousButton = "button-previous",
   NextButton = "button-next",
   NewThrowButton = "button-new",
}

/**
 * TODO: Update counters when this.CurrentRolls changes.
 *
 * When this.CurrentRolls changes:
 *
 * rollCount.removeChild(rollCount.firstChild!);
 *    rollCount.appendChild(
 *       document.createTextNode(
 *          c.Rolls.filter((r) => r.Dice === d).length.toString()));
 */

/**
 * Object responsible for managing the DOM.
 */
export default class View {
   private static readonly Dice: number[] = [4, 6, 8, 10, 12, 20, 100];

   private readonly DiceContainer: HTMLDivElement;
   private readonly ResultsContainer: HTMLDivElement;
   private readonly ControlsContainer: HTMLElement; // <footer>

   private readonly BenchmarkButton: HTMLButtonElement;
   private readonly PreviousButton: HTMLButtonElement;
   private readonly NextButton: HTMLButtonElement;
   private readonly NewRollButton: HTMLButtonElement;

   private CurrentRolls: Rolls;

   // object cannot be marked with the 'readonly' type modifier.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   public constructor(model: Model) {
      // Get references to UI elements
      this.DiceContainer = this.GetElementById<HTMLDivElement>(Id.Dice);
      this.ResultsContainer = this.GetElementById<HTMLDivElement>(Id.Results);
      this.ControlsContainer = this.GetElementById<HTMLElement>(Id.Controls);
      this.BenchmarkButton = this.GetElementById<HTMLButtonElement>(
         Id.BenchmarkButton
      );
      this.PreviousButton = this.GetElementById<HTMLButtonElement>(
         Id.PreviousButton
      );
      this.NextButton = this.GetElementById<HTMLButtonElement>(Id.NextButton);
      this.NewRollButton = this.GetElementById<HTMLButtonElement>(
         Id.NewThrowButton
      );

      // Display hidden elements
      this.DiceContainer.hidden = false;
      this.ResultsContainer.hidden = false;
      this.ControlsContainer.hidden = false;
      this.BenchmarkButton.hidden = false;

      // Register model event listener
      model.onCurrentRollsChange(this.DisplayCurrentRolls);

      // Create dice
      View.Dice.forEach((d) => {
         // Create base
         const button = document.createElement("button");
         button.type = "button";
         button.className = "btn btn-primary m-2";
         button.style.width = "4em";

         // Face count
         const faceCount = document.createElement("p");
         faceCount.className = "m-0 p-0";
         faceCount.append(document.createTextNode("D" + d.toString()));
         button.appendChild(faceCount);

         // Roll count
         const rollCount = document.createElement("span");
         rollCount.className = "m-0 p-0 badge";
         rollCount.append(document.createTextNode("0"));
         button.appendChild(rollCount);

         // Add event
         button.addEventListener("click", () => {
            model.Roll(d);
         });

         // Add element to container
         this.DiceContainer.appendChild(button);
      });

      // Add event listeners to buttons
      this.PreviousButton.addEventListener("click", () => {
         // Only callable if previous rolls exist.
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         this.DisplayCurrentRolls(this.CurrentRolls.Previous!);
      });
      this.NextButton.addEventListener("click", () => {
         // Only callable if next rolls exist.
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         this.DisplayCurrentRolls(this.CurrentRolls.Next!);
      });
      this.NewRollButton.addEventListener("click", () => {
         model.Reset();
      });
      this.BenchmarkButton.addEventListener("click", () => {
         // TODO: benchmark display
         throw new Error("not implemented");
      });

      // Assign CurrentRolls (properly assigned on first model update)
      this.CurrentRolls = new Rolls([]);

      // Reset display
      this.DisplayCurrentRolls(this.CurrentRolls);
   }

   // Cannot be readonly.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   private readonly DisplayCurrentRolls = (current: Rolls): void => {
      // Assign as current rolls
      this.CurrentRolls = current;

      // Clear previous rolls
      while (this.ResultsContainer.firstChild !== null) {
         this.ResultsContainer.removeChild(this.ResultsContainer.firstChild);
      }

      // Print current rolls
      current.Rolls.forEach((r) => {
         // Create base element
         const card = document.createElement("div");
         card.className = "card m-1";
         card.style.width = "4em";
         card.style.height = "4em";

         // Dice name
         const dice = document.createElement("h5");
         dice.className = "badge text-muted";
         dice.appendChild(document.createTextNode("d" + r.Dice.toString()));
         card.appendChild(dice);

         // Rolled value
         const roll = document.createElement("span");
         roll.appendChild(document.createTextNode(r.Value.toString()));
         card.appendChild(roll);

         // Add element to page
         this.ResultsContainer.appendChild(card);
      });

      // Toggle button state
      this.NewRollButton.disabled = current.Rolls.length <= 0;
      this.PreviousButton.disabled = current.Previous === undefined;
      this.NextButton.disabled = current.Next === undefined;
   };

   private readonly GetElementById = <T extends HTMLElement>(id: Id): T => {
      return Assert(
         document.getElementById(id)
      ).isObject.isNotNull.isInstanceOf(HTMLElement).value as T;
   };
}
