import View from "./View";

/**
 * Element containing a single dices benchmark results.
 */
export default class BenchmarkResultTable extends HTMLTableElement {
   /**
    * Name of the custom elements HTML tag.
    */
   public static readonly ELEMENT_NAME = "benchmark-result-table";

   private static readonly NUMBER_LOCALE = "en-us";

   private readonly _countValue: HTMLTableDataCellElement;
   private readonly _meanValue: HTMLTableDataCellElement;
   private readonly _standardDeviationValue: HTMLTableDataCellElement;
   private readonly _facecount: number;
   private readonly _precision: number;
   private readonly _expectedMean: number;
   private readonly _rolls: number[];

   public constructor(facecount: number) {
      super();

      this._facecount = facecount;
      this._expectedMean = this._facecount / 2 + 0.5;
      this._precision = (this._facecount / 2).toString().length + 2;
      this.className = "table table-bordered";

      // initialize rolls (otherwise filled with NaN:s)
      this._rolls = new Array<number>(this._facecount).fill(0);

      // header
      const headerRow = document.createElement("tr");
      const headerHeader = document.createElement("th");
      const valueHeader = document.createElement("th");
      const expectedHeader = document.createElement("th");
      headerRow.append(headerHeader, valueHeader, expectedHeader);
      headerHeader.textContent = "D" + facecount.toString();
      valueHeader.textContent = "Value";
      expectedHeader.textContent = "Expected";

      // count
      const countRow = document.createElement("tr");
      const countHeader = document.createElement("td");
      this._countValue = document.createElement("td");
      const countExpected = document.createElement("td");
      countRow.append(countHeader, this._countValue, countExpected);
      countHeader.textContent = "Count";
      this._countValue.textContent = "0";
      countExpected.textContent = new Intl.NumberFormat(
         BenchmarkResultTable.NUMBER_LOCALE
      ).format(View.BENCHMARK_ROUNDS);

      // mean
      const meanRow = document.createElement("tr");
      const meanHeader = document.createElement("td");
      this._meanValue = document.createElement("td");
      const meanExpected = document.createElement("td");
      meanRow.append(meanHeader, this._meanValue, meanExpected);
      meanHeader.textContent = "Mean";
      this._meanValue.textContent = "0";
      meanExpected.textContent = this._expectedMean.toPrecision(
         this._precision
      );

      // standard deviation
      const standardDeviationRow = document.createElement("tr");
      const standardDeviationHeader = document.createElement("td");
      this._standardDeviationValue = document.createElement("td");
      const standardDeviationExpected = document.createElement("td");
      standardDeviationRow.append(
         standardDeviationHeader,
         this._standardDeviationValue,
         standardDeviationExpected
      );
      standardDeviationHeader.textContent = "Standard Deviation";
      this._standardDeviationValue.textContent = "0";
      standardDeviationExpected.textContent = "0";

      this.append(headerRow, countRow, meanRow, standardDeviationRow);
   }

   /**
    * Add a rolled value to the results.
    * @param value Value which was rolled.
    */
   public readonly AddRoll = (value: number): void => {
      if (value <= 0) {
         throw new Error("value cannot be under one");
      } else if (value > this._facecount) {
         throw new Error("value cannot be greater than facecount");
      }
      this._rolls[value - 1] += 1;
   };

   /**
    * Update the elements DOM partion.
    */
   public readonly Update = (): void => {
      const count = this.Count;
      this._countValue.textContent = new Intl.NumberFormat(
         BenchmarkResultTable.NUMBER_LOCALE
      ).format(count);
      if (count === View.BENCHMARK_ROUNDS) {
         // is never null.
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         this._countValue.parentElement!.className = "table-success";
      }

      const meanString = this.Mean.toPrecision(this._precision + 2);
      this._meanValue.textContent = meanString;
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._meanValue.parentElement!.className = meanString.startsWith(
         this._expectedMean.toPrecision(this._precision)
      )
         ? "table-success"
         : "table-danger";

      const standardDeviation = this.StandardDeviation;
      const standardDeviationString = standardDeviation.toPrecision(
         this._precision
      );
      this._standardDeviationValue.textContent = standardDeviationString;
   };

   /**
    * How many rolls have been made.
    */
   public get Count(): number {
      return this._rolls.reduce((c, v) => c + v, 0);
   }

   private get Mean(): number {
      let sum = 0;
      for (let i = 0; i < this._facecount; i++) {
         sum += this._rolls[i] * (i + 1);
      }
      return sum / this.Count;
   }

   private get StandardDeviation(): number {
      // TODO: implement
      return 0;
   }
}
customElements.define(BenchmarkResultTable.ELEMENT_NAME, BenchmarkResultTable, {
   extends: "table",
});
