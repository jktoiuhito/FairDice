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
   private readonly _rolls: number[];

   private readonly _expectedRollCount: number;
   private readonly _expectedMean: number;
   private readonly _meanPrecision: number;

   public constructor(facecount: number) {
      super();

      this.className = "table table-bordered";

      this._facecount = facecount;
      // rolls needs to be filled, otherwise contains NaN:s
      this._rolls = new Array<number>(this._facecount).fill(0);
      this._expectedMean = this._facecount / 2 + 0.5;
      this._meanPrecision = (this._facecount / 2).toString().length + 3;
      this._expectedRollCount = View.BENCHMARK_ROUNDS_PER_FACE * facecount;

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
      ).format(this._expectedRollCount);

      // mean
      const meanRow = document.createElement("tr");
      const meanHeader = document.createElement("td");
      this._meanValue = document.createElement("td");
      const meanExpected = document.createElement("td");
      meanRow.append(meanHeader, this._meanValue, meanExpected);
      meanHeader.textContent = "Mean";
      this._meanValue.textContent = "0";
      meanExpected.textContent = this._expectedMean.toPrecision(
         this._meanPrecision
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
      if (count === this._expectedRollCount) {
         // is never null.
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         this._countValue.parentElement!.className = "table-success";
      }

      const mean = this.Mean;
      this._meanValue.textContent = mean.toPrecision(this._meanPrecision + 1);
      const meanDifference = Math.abs(mean - this._expectedMean);
      // is never null.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._meanValue.parentElement!.className =
         meanDifference < 0.001
            ? "table-success"
            : meanDifference < 0.01
            ? "table-warning"
            : "table-danger";

      const standardDeviation = this.StandardDeviation;
      this._standardDeviationValue.textContent = Math.round(
         standardDeviation
      ).toString();
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
      return Math.sqrt(
         this._rolls.reduce(
            (a, v) => a + (v - View.BENCHMARK_ROUNDS_PER_FACE) ** 2,
            0
         ) / this._facecount
      );
   }
}
customElements.define(BenchmarkResultTable.ELEMENT_NAME, BenchmarkResultTable, {
   extends: "table",
});
