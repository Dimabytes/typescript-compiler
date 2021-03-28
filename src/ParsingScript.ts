import { END_STATEMENT } from './consts';
import { loadAndCalculate } from './parser';

export class ParsingScript {
  data: string;

  from: number;

  constructor(data: string, from = 0) {
    this.data = data;
    this.from = from;
  }

  stillValid(): boolean {
    return this.from < this.data.length;
  }

  getCurrentChar(): string {
    return this.data[this.from];
  }

  forward(): void {
    this.from += 1;
  }

  execute(to: string) {
    if (this.data[this.data.length - 1] !== END_STATEMENT) {
      this.data += END_STATEMENT;
    }

    return loadAndCalculate(this, to);
  }
  //
  // processBlock(): number {
  //   let result = null;
  //
  //   while (this.stillValid()) {
  //     const endGroupRead = this.goToNextStatement();
  //     if (endGroupRead > 0) {
  //       return result !== null ? result : 0;
  //     }
  //
  //     if (!this.stillValid()) {
  //       throw new Error("Couldn't process block");
  //     }
  //
  //     result = this.loadAndCalculate();
  //   }
  //   if (result === null) {
  //     throw new Error("Couldn't process block 2");
  //   }
  //   return result;
  // }
}
