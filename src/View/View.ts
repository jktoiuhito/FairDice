import { Assert } from "@jktoiuhito/utility";
import DiceButton from "./DiceButton";
import Model from "../Model/Model";
import Rolls from "../Model/Rolls";
import { Id } from "./Id";

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
   private BenchmarkWorker: Worker | undefined;
   private BenchmarkTimerId: number | undefined;

   // object cannot be marked with the 'readonly' type modifier.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   public constructor(model: Model) {
      // Get references to UI elements
      this.DiceContainer = this.GetElementById<HTMLDivElement>(
         Id.DiceContainer
      );
      this.ResultsContainer = this.GetElementById<HTMLDivElement>(
         Id.ResultsContainer
      );
      this.ScoreCounter = this.GetElementById<HTMLHeadingElement>(
         Id.ResultsScoreCounter
      );
      const ControlsContainer = this.GetElementById<HTMLElement>(
         Id.ControlsContainer
      );
      this.PreviousButton = this.GetElementById<HTMLButtonElement>(
         Id.ControlsPreviousButton
      );
      this.NextButton = this.GetElementById<HTMLButtonElement>(
         Id.ControlsNextButton
      );
      this.NewRollButton = this.GetElementById<HTMLButtonElement>(
         Id.ControlsNewThrowButton
      );
      const BenchmarkButton = this.GetElementById<HTMLButtonElement>(
         Id.BenchmarkButton
      );
      const BenchmarkModal = this.GetElementById<HTMLDivElement>(
         Id.BenchmarkModal
      );
      const BenchmarkRunButton = this.GetElementById<HTMLButtonElement>(
         Id.BenchmarkRunButton
      );
      const BenchmarkStopButton = this.GetElementById<HTMLButtonElement>(
         Id.BenchmarkStopButton
      );
      const BenchmarkIntro = this.GetElementById<HTMLDivElement>(
         Id.BenchmarkModalIntro
      );
      const BenchmarkTest = this.GetElementById<HTMLDivElement>(
         Id.BenchmarkModalTest
      );

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

      // Register model event listener
      model.onCurrentRollsChange(this.DisplayCurrentRolls);

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
      // Cannot be readonly type.
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      BenchmarkRunButton.addEventListener("click", () => {
         // start benchmark
         this.BenchmarkWorker = this.CreateBenchmarkWorker();
         this.BenchmarkTimerId = window.setInterval(() => {
            // TODO: update DOM with the result.
            // Just assigned above...
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.BenchmarkWorker!.postMessage(null);
            throw new Error("not implemented");
         }, 250);

         // toggle buttons, display benchmark
         BenchmarkIntro.hidden = BenchmarkRunButton.hidden = true;
         BenchmarkTest.hidden = BenchmarkStopButton.hidden = false;
      });
      BenchmarkStopButton.addEventListener("click", () => {
         // terminate and reset worker, reset timer
         window.clearInterval(this.BenchmarkTimerId);
         this.BenchmarkWorker?.terminate();
         this.BenchmarkTimerId = 0;
         this.BenchmarkWorker = undefined;

         // clean up results from DOM
         while (BenchmarkTest.firstChild !== null) {
            BenchmarkTest.removeChild(BenchmarkTest.firstChild);
         }

         // toggle buttons, display info
         BenchmarkIntro.hidden = BenchmarkRunButton.hidden = false;
         BenchmarkTest.hidden = BenchmarkStopButton.hidden = true;
      });

      // Assign CurrentRolls (properly assigned on first model update)
      this.CurrentRolls = new Rolls([]);

      // No benchmark is running at start, so worker and timer are undefined
      this.BenchmarkWorker = undefined;
      this.BenchmarkTimerId = undefined;

      // Initialize display
      this.DisplayCurrentRolls(this.CurrentRolls);

      // Display hidden elements
      this.DiceContainer.hidden = false;
      this.ResultsContainer.hidden = false;
      ControlsContainer.hidden = false;
      BenchmarkButton.hidden = false;
      this.ScoreCounter.hidden = false;
      BenchmarkModal.hidden = false;
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.querySelector("hr")!.hidden = false;
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
         dice.textContent = "d" + r.Facecount.toString();
         card.appendChild(dice);

         // Rolled value
         const roll = document.createElement("span");
         roll.textContent = r.Value.toString();
         card.appendChild(roll);

         // Add element to page
         this.ResultsContainer.appendChild(card);
      });
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.ScoreCounter.removeChild(this.ScoreCounter.firstChild!);
      this.ScoreCounter.textContent = score.toString();

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

   private readonly CreateBenchmarkWorker = (): Worker => {
      function benchmark(): void {
         // TODO: benchmark function implementation
         throw new Error("not implemented");
      }

      //https://gist.github.com/SunboX/5849664
      let code = benchmark.toString();
      code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
      const blob = new Blob([code], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));
      // Cannot be readonly type.
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      worker.onerror = (e): void => console.error(e);
      worker.onmessage = (): string => "not implemented";
      return worker;
   };
}
