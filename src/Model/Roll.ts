import { Assert } from "@jktoiuhito/utility";

/**
 * Data of a single roll of a single dice.
 */
export default class Roll {
   /**
    * How many faces the dice has.
    * Is never under one.
    */
   public readonly Facecount: number;

   /**
    * What was the rolled value.
    * Is never under one or over the facecount of the dice.
    */
   public readonly Value: number;

   /**
    * Create a new roll of a single dice.
    * @param facecount How many faces the dice has.
    * @param value What was the rolled value.
    * @throws Dice is under one. Value is under one or over the eye-count of the
    * dice.
    */
   public constructor(facecount: number, value: number) {
      if (Assert(facecount).isNumber.isNotNaN.isSafeInteger.value < 1) {
         throw new Error("'facecount' cannot be under one");
      } else if (Assert(value).isNumber.isNotNaN.isSafeInteger.value < 1) {
         throw new Error("'facecount' cannot be under one");
      } else if (value > facecount) {
         throw new Error("'value' cannot be greater than 'facecount'");
      }
      this.Facecount = facecount;
      this.Value = value;
      Object.freeze(this);
   }
}
