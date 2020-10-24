/**
 * Button representing a single dice.
 */
export default class DiceButton extends HTMLButtonElement {
   public static readonly ElementName = "dice-button";

   /**
    * How many faces the dice has.
    */
   public readonly Facecount: number;

   private readonly _rollcountElement: HTMLParagraphElement;
   private _rollcount: number;

   public constructor(faces: number) {
      super();
      this.Facecount = faces;
      this._rollcount = 0;

      // element related
      this.type = "button";
      this.className = "btn btn-primary m-2";
      this.style.width = "4em";

      const facecountElement = document.createElement("p");
      facecountElement.className = "m-0 p-0";
      facecountElement.append(
         document.createTextNode("D" + this.Facecount.toString())
      );

      this._rollcountElement = document.createElement("p");
      this._rollcountElement.className = "m-0 p-0 badge";
      this._rollcountElement.append(
         document.createTextNode(this._rollcount.toString())
      );

      this.append(facecountElement, this._rollcountElement);
   }

   /**
    * Set the amount of times the dice has been rolled.
    */
   public set Rollcount(rollcount: number) {
      if (rollcount < 0) {
         throw new Error("'rollcount' cannot be under one");
      }
      this._rollcount = rollcount;
      // always exists.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._rollcountElement.removeChild(this._rollcountElement.firstChild!);
      this._rollcountElement.appendChild(
         document.createTextNode(this._rollcount.toString())
      );
   }
}
customElements.define(DiceButton.ElementName, DiceButton, {
   extends: "button",
});
