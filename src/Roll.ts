import { Assert } from "@jktoiuhito/utility";

/**
 * Data of a single roll of a single dice.
 */
export default class Roll {
   /**
    * How many eyes / faces the dice has.
    * Is never under one.
    */
   public readonly Dice: number;

   /**
    * What was the rolled value.
    * Is never under one or over the eye-count of the dice.
    */
   public readonly Value: number;

   /**
    * Create a new roll of a single dice.
    * @param dice How many eyes / faces the dice has.
    * @param value What was the rolled value.
    * @throws Dice is under one. Value is under one or over the eye-count of the
    * dice.
    */
   public constructor(dice: number, value: number) {
      if (Assert(dice).isNumber.isNotNaN.isSafeInteger.value < 1) {
         throw new Error("'dice' cannot be under one");
      } else if (Assert(value).isNumber.isNotNaN.isSafeInteger.value < 1) {
         throw new Error("'value' cannot be under one");
      } else if (value > dice) {
         throw new Error("'value' cannot be greater than 'dice'");
      }
      this.Dice = dice;
      this.Value = value;
      Object.freeze(this);
   }
}
