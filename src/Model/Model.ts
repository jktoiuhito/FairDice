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
    * @param facecount Facecount of the dice.
    */
   public readonly Roll = (facecount: number): void => {
      this.CurrentRolls.Rolls.push(
         new Roll(facecount, Model.RandomNumber(facecount))
      );
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

   /**
    * Return a random number between 1 and the given maximum number.
    * @param max Maximum number returned.
    * @throws max is under one.
    */
   public static readonly RandomNumber = (max: number): number => {
      if (max <= 0) {
         throw new Error("'max' cannot be under one");
      } else if (max === 1) {
         return 1;
      }
      /**
       * Numbers are easily converted to the given range with modulo-operator.
       * Example with a max of 4:
       * 0 4 8  % max -> 0
       * 1 5 9  % max -> 1
       * 2 6 10 % max -> 2
       * 3 7 11 % max -> 3
       *
       * Maximum value generated is 2^32 (or 2^32 - 1). The chances that this
       * number is exactly at the border of a "block" (its modulo operation with
       * max would produce max - 1) is nonexistent. Therefore there is a very
       * small amount of numbers which can be generated more frequently than
       * others. To eliminate this possibility, the maximum number should be
       * 2^32 - (2^32 % max) - 1.
       */
      const array = new Uint32Array(1);
      const maxValue = 2 ** 32 - (2 ** 32 % max) - 1;
      // ...
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
      while (true) {
         window.crypto.getRandomValues(array);
         const val = array[0];
         if (val <= maxValue) {
            break;
         }
      }
      const value = array[0];
      return (value % max) + 1;
   };
}
