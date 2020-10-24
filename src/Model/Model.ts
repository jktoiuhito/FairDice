import { Assert } from "@jktoiuhito/utility";
import Rolls from "./Rolls";
import Roll from "./Roll";

/**
 * Object responsible for throwing the dice and keeping track of history.
 */
export default class Model {
   // Cannot be readonly type.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   private readonly Listeners: { (rolls: Rolls): void }[];
   private readonly History: Rolls[];
   private CurrentRolls: Rolls;

   public constructor() {
      this.Listeners = [];
      this.CurrentRolls = new Rolls([]);
      this.History = [];
      this.History.push(this.CurrentRolls);
   }

   /**
    *
    * @param callback Function to call when the current rolls change.
    */
   public readonly onCurrentRollsChange = (
      // Cannot be readonly type.
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      callback: (rolls: Rolls) => void
   ): void => {
      this.Listeners.push(
         // Cannot be readonly type.
         // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
         Assert(callback).isFunction.value as { (rolls: Rolls): void }
      );
   };

   /**
    * Roll a dice.
    * @param dice Face-count of the dice.
    */
   public readonly Roll = (dice: number): void => {
      // TODO: crypto rng
      this.CurrentRolls.Rolls.push(new Roll(dice, 1));
      this.Changed(this.CurrentRolls);
   };

   /**
    * Saves current rolls to the head of history and then resets them.
    */
   public readonly Reset = (): void => {
      if (this.CurrentRolls.Rolls.length > 0) {
         const old = this.CurrentRolls;
         const neww = new Rolls([]);
         old.Next = neww;
         neww.Previous = old;
         Object.freeze(old);
         this.History.push(neww);
         this.CurrentRolls = neww;
      }
      this.Changed(this.CurrentRolls);
   };

   // Cannot be readonly type.
   // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
   private readonly Changed = (rolls: Rolls): void => {
      this.Listeners.forEach((l) => l(rolls));
   };
}
