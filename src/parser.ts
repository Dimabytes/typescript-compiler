import { Cell, isStillCollecting, isActionValid, merge } from './cell';
import { END_ARG, START_ARG } from './consts';

// eslint-disable-next-line no-use-before-define
type ParserFunction = (instance: ExpressionCalculator) => number;

const parserFunctions: Record<string, ParserFunction> = {
  sin: (instance) => {
    const arg = instance.loadAndCalculate(END_ARG);
    return Math.sin(arg);
  },
  PI: () => {
    return Math.PI;
  },
  pow: (instance) => {
    const arg1 = instance.loadAndCalculate(',');
    const arg2 = instance.loadAndCalculate(END_ARG);
    return arg1 ** arg2;
  },
};

const stringToNumber: (item: string) => ParserFunction = (item) => () => {
  const number = +item;
  if (Number.isNaN(number)) {
    throw new Error(`Error parsing number from string ${item}`);
  }
  return number;
};

export class ExpressionCalculator {
  from: number;

  data: string;

  defaultTo: string;

  constructor(data: string, defaultTo = '\0') {
    this.data = data;
    this.from = 0;
    this.defaultTo = defaultTo;
  }

  updateAction(item: string, ch: string, to: string): string {
    if (this.from >= item.length || item[this.from] === END_ARG || item[this.from] === to) {
      return END_ARG;
    }

    let index = this.from;
    let res = ch;
    while (!isActionValid(res) && index < item.length) {
      // смотрим на следующий символ в строке,
      // пока не найдем допустимое действие
      res = item[index];
      index += 1;
    }
    if (isActionValid(res)) {
      this.from = index;
    } else if (index > this.from) {
      this.from = index - 1;
    }
    return res;
  }

  getParserFunction(data: string, item: string, ch: string): ParserFunction {
    if (item.length === 0 && ch === START_ARG) {
      return () => this.loadAndCalculate(END_ARG);
    }

    if (parserFunctions[item] !== undefined) {
      return parserFunctions[item];
    }
    return stringToNumber(item);
  }

  loadAndCalculate(to = this.defaultTo): number {
    const listToMerge: Cell[] = [];
    let item = '';

    do {
      const ch = this.data[this.from];
      this.from += 1;

      if (isStillCollecting(item, ch, to, this.defaultTo)) {
        item += ch;
        if (this.from < this.data.length && this.data[this.from] !== to) {
          continue;
        }
      }
      const fn = this.getParserFunction(this.data, item, ch);

      const value = fn(this);

      const action = isActionValid(ch) ? ch : this.updateAction(this.data, ch, to);
      listToMerge.push(new Cell(value, action));
      item = '';
    } while (this.from < this.data.length && this.data[this.from] !== to);

    if (
      this.from < this.data.length &&
      (this.data[this.from] === END_ARG || this.data[this.from] === to)
    ) {
      this.from += 1;
    }

    return merge(listToMerge);
  }
}
