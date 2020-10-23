import { Assert } from "@jktoiuhito/utility";
import Roll from "./Roll";

/**
 * Collection of multiple Roll-values.
 */
export default class Rolls {
   /**
    * Stored individual rolls.
    */
   public readonly Rolls: Roll[];

   /**
    * Rolls previous to this one.
    */
   public Previous: Rolls | undefined;

   /**
    * Rolls coming after this one.
    */
   public Next: Rolls | undefined;

   public constructor(
      rolls: readonly Roll[],
      previous: Rolls | undefined = undefined,
      next: Rolls | undefined = undefined
   ) {
      this.Rolls = Assert(rolls).isObject.isNotNull.isInstanceOf(Array)
         .value as Roll[];
      this.Previous = previous;
      this.Next = next;
   }
}
