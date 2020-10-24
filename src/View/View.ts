import { Assert } from "@jktoiuhito/utility";
import DiceButton from "./DiceButton";
import Model from "../Model/Model";
import Rolls from "../Model/Rolls";

const enum Id {
   Dice = "dice-container",
   Results = "results-container",
   Controls = "controls-container",
   BenchmarkButton = "button-benchmark",
   PreviousButton = "button-previous",
   NextButton = "button-next",
   NewThrowButton = "button-new",
   RunBenchmarkButton = "run-benchmark-button",
   ScoreCounter = "score-counter",
}

/**
 * Object responsible for managing the DOM.
 */
export default class View {
   private static readonly Dice: number[] = [4, 6, 8, 10, 12, 20, 100];

   private readonly DiceContainer: HTMLDivElement;
   private readonly Dice: DiceButton[];
   private readonly ResultsContainer: HTMLDivElement;
   private readonly ScoreCounter: HTMLHeadingElement;
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
      this.ScoreCounter = this.GetElementById<HTMLHeadingElement>(
         Id.ScoreCounter
      );
      const ControlsContainer = this.GetElementById<HTMLElement>(Id.Controls);
      const BenchmarkButton = this.GetElementById<HTMLButtonElement>(
         Id.BenchmarkButton
      );
      this.PreviousButton = this.GetElementById<HTMLButtonElement>(
         Id.PreviousButton
      );
      this.NextButton = this.GetElementById<HTMLButtonElement>(Id.NextButton);
      this.NewRollButton = this.GetElementById<HTMLButtonElement>(
         Id.NewThrowButton
      );
      const RunBenchmarkButton = this.GetElementById<HTMLButtonElement>(
         Id.RunBenchmarkButton
      );

      // Display hidden elements
      this.DiceContainer.hidden = false;
      this.ResultsContainer.hidden = false;
      ControlsContainer.hidden = false;
      BenchmarkButton.hidden = false;
      this.ScoreCounter.hidden = false;

      // Register model event listener
      model.onCurrentRollsChange(this.DisplayCurrentRolls);

      // Create dice
      this.Dice = [];
      View.Dice.forEach((d) => {
         const diceButton = new DiceButton(d);
         diceButton.addEventListener("click", () => {
            model.Roll(d);
         });
         this.DiceContainer.appendChild(diceButton);
         this.Dice.push(diceButton);
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
      RunBenchmarkButton.addEventListener("click", () => {
         // TODO: benchmark
         throw new Error("not implemented");
      });

      // Assign CurrentRolls (properly assigned on first model update)
      this.CurrentRolls = new Rolls([]);

      // Initialize display
      this.DisplayCurrentRolls(this.CurrentRolls);
   }

   // Cannot be readonly.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   private readonly DisplayCurrentRolls = (current: Rolls): void => {
      // Assign as current rolls
      this.CurrentRolls = current;

      // Clear previous results
      while (this.ResultsContainer.firstChild !== null) {
         this.ResultsContainer.removeChild(this.ResultsContainer.firstChild);
      }

      // Print current rolls and their score
      let score = 0;
      current.Rolls.forEach((r) => {
         score += r.Value;

         // Create base element
         const card = document.createElement("div");
         card.className = "card m-1";
         card.style.width = "4em";
         card.style.height = "4em";

         // Dice name
         const dice = document.createElement("h5");
         dice.className = "badge text-muted";
         dice.appendChild(
            document.createTextNode("d" + r.Facecount.toString())
         );
         card.appendChild(dice);

         // Rolled value
         const roll = document.createElement("span");
         roll.appendChild(document.createTextNode(r.Value.toString()));
         card.appendChild(roll);

         // Add element to page
         this.ResultsContainer.appendChild(card);
      });
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.ScoreCounter.removeChild(this.ScoreCounter.firstChild!);
      this.ScoreCounter.appendChild(document.createTextNode(score.toString()));

      // Update dice-buttons counters
      this.Dice.forEach(
         // cannot be a readonly type.
         // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
         (d) =>
            (d.Rollcount = this.CurrentRolls.Rolls.filter(
               (r) => r.Facecount === d.Facecount
            ).length)
      );

      // Toggle button state
      this.NewRollButton.disabled = current.Rolls.length <= 0;
      this.PreviousButton.disabled = current.Previous === undefined;
      this.NextButton.disabled = current.Next === undefined;
   };

   private readonly GetElementById = <T extends HTMLElement>(id: Id): T => {
      return Assert(
         document.getElementById(id),
         id
      ).isObject.isNotNull.isInstanceOf(HTMLElement).value as T;
   };
}
