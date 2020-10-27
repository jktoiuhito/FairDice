/**
 * Element containing a single dices benchmark results.
 */
export default class BenchmarkResultTable extends HTMLTableElement {
   /**
    * Name of the custom elements HTML tag.
    */
   public static readonly ELEMENT_NAME = "benchmark-result-table";

   private readonly _meanValue: HTMLTableDataCellElement;
   private readonly _standardDeviationValue: HTMLTableDataCellElement;

   public constructor(facecount: number) {
      super();

      // header
      const headerRow = document.createElement("tr");
      const headerHeader = document.createElement("th");
      const valueHeader = document.createElement("th");
      headerRow.append(headerHeader, valueHeader);
      headerHeader.textContent = "D" + facecount.toString();
      valueHeader.textContent = "Value";

      // mean
      const meanRow = document.createElement("tr");
      const meanHeader = document.createElement("td");
      this._meanValue = document.createElement("td");
      meanRow.append(meanHeader, this._meanValue);
      meanHeader.textContent = "Mean";
      this._meanValue.textContent = "0";

      // standard deviation
      const standardDeviationRow = document.createElement("tr");
      const standardDeviationHeader = document.createElement("td");
      this._standardDeviationValue = document.createElement("td");
      standardDeviationRow.append(
         standardDeviationHeader,
         this._standardDeviationValue
      );
      standardDeviationHeader.textContent = "Standard Deviation";
      this._standardDeviationValue.textContent = "0";
   }

   public set Mean(mean: number) {
      this._meanValue.textContent = mean.toString();
   }

   public set StandardDeviation(standardDeviation: number) {
      this._standardDeviationValue.textContent = standardDeviation.toString();
   }
}
customElements.define(BenchmarkResultTable.ELEMENT_NAME, BenchmarkResultTable, {
   extends: "table",
});
