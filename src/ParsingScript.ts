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
}
