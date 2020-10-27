import BenchmarkResultTable from "./BenchmarkResultTable";
import CancellationToken from "./CancellationToken";
import { Assert } from "@jktoiuhito/utility";
import DiceButton from "./DiceButton";
import Model from "../Model/Model";
import Rolls from "../Model/Rolls";
import { Id } from "./Id";

/**
 * Object responsible for managing the DOM.
 */
export default class View {
   /**
    * How many times the benchmark rolls each dice.
    */
   public static readonly BENCHMARK_ROUNDS = 1000000;

   private static readonly DICE: number[] = [4, 6, 8, 10, 12, 20, 100];
   private static readonly BENCHMARK_TIMEOUT = 200; // milliseconds

   private readonly DiceContainer: HTMLDivElement;
   private readonly Dice: DiceButton[];
   private readonly ResultsContainer: HTMLDivElement;
   private readonly ScoreCounter: HTMLHeadingElement;
   private readonly PreviousButton: HTMLButtonElement;
   private readonly NextButton: HTMLButtonElement;
   private readonly NewRollButton: HTMLButtonElement;
   private readonly BenchmarkModalResultsContainer: HTMLDivElement;

   private CurrentRolls: Rolls;
   private readonly BenchmarkCancellationToken: CancellationToken;

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
      this.BenchmarkModalResultsContainer = this.GetElementById<HTMLDivElement>(
         Id.BenchmarkModalResultsContainer
      );

      // Create dice
      this.Dice = [];
      View.DICE.forEach((d) => {
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
         // clean up possible old results from DOM
         while (this.BenchmarkModalResultsContainer.firstChild !== null) {
            this.BenchmarkModalResultsContainer.removeChild(
               this.BenchmarkModalResultsContainer.firstChild
            );
         }

         // start benchmark
         this.BenchmarkCancellationToken.isCancelled = false;
         this.RunBenchmark();

         // toggle buttons, display benchmark
         BenchmarkIntro.hidden = BenchmarkRunButton.hidden = true;
         BenchmarkTest.hidden = BenchmarkStopButton.hidden = false;
      });
      BenchmarkStopButton.addEventListener("click", () => {
         // stop execution
         this.BenchmarkCancellationToken.isCancelled = true;

         // toggle buttons
         BenchmarkRunButton.hidden = false;
         BenchmarkStopButton.hidden = true;
      });

      // Assign CurrentRolls (properly assigned on first model update) and
      // BenchmarkCancellationToken
      this.CurrentRolls = new Rolls([]);
      this.BenchmarkCancellationToken = new CancellationToken();

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

   //https://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui/10344560#10344560
   private readonly RunBenchmark = (): void => {
      View.DICE.some((d) => {
         const resultTable = new BenchmarkResultTable(d);
         this.BenchmarkModalResultsContainer.appendChild(resultTable);
         const chunk = 1000;
         const Benchmark = (): void => {
            let chnk = chunk;
            while (chnk-- > 0 && resultTable.Count < View.BENCHMARK_ROUNDS) {
               resultTable.AddRoll(Model.RandomNumber(d));
            }
            resultTable.Update();
            if (this.BenchmarkCancellationToken.isCancelled) {
               return;
            } else if (resultTable.Count < View.BENCHMARK_ROUNDS) {
               window.setTimeout(() => Benchmark(), View.BENCHMARK_TIMEOUT);
            }
         };
         Benchmark();
         return this.BenchmarkCancellationToken.isCancelled;
      });
   };
}
