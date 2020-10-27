/**
 * Cancellation token used in the long-running Benchmark task.
 */
export default class CancellationToken {
   private _isCancelled = false;

   public get isCancelled(): boolean {
      return this._isCancelled;
   }

   public set isCancelled(cancelled: boolean) {
      this._isCancelled = cancelled;
   }
}
