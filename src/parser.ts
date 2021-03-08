import { Cell, isStillCollecting, isActionValid, merge } from './cell';
import { END_ARG, START_ARG } from './consts';

type ParserFunction = (data: string, item: string) => number;

const stringToNumber: ParserFunction = (data, item) => {
  const number = +item;
  if (Number.isNaN(number)) {
    throw new Error(`Error parsing number from string ${item}`);
  }
  return number;
};

export const calculateExpression = (expression: string, defaultTo = '\0'): number => {
  let from = 0;

  const updateAction = (item: string, ch: string, to: string) => {
    if (from >= item.length || item[from] === END_ARG || item[from] === to) {
      return END_ARG;
    }

    let index = from;
    let res = ch;
    while (!isActionValid(res) && index < item.length) {
      // смотрим на следующий символ в строке,
      // пока не найдем допустимое действие
      res = item[index];
      index += 1;
    }
    if (isActionValid(res)) {
      from = index;
    } else if (index > from) {
      from = index - 1;
    }
    return res;
  };

  const getParserFunction = (data: string, item: string, ch: string): ParserFunction => {
    if (item.length === 0 && ch === START_ARG) {
      // eslint-disable-next-line no-use-before-define
      return () => loadAndCalculate(data, END_ARG);
    }
    return stringToNumber;
  };

  const loadAndCalculate = (data: string, to: string): number => {
    const listToMerge: Cell[] = [];
    let item = '';

    do {
      const ch = data[from];
      from += 1;

      if (isStillCollecting(item, ch, to, defaultTo)) {
        item += ch;
        if (from < data.length && data[from] !== to) {
          continue;
        }
      }
      const fn = getParserFunction(data, item, ch);

      const value = fn(data, item);

      const action = isActionValid(ch) ? ch : updateAction(data, ch, to);
      listToMerge.push(new Cell(value, action));
      item = '';
    } while (from < data.length && data[from] !== to);

    if (from < data.length && (data[from] === END_ARG || data[from] === to)) {
      from += 1;
    }

    return merge(listToMerge);
  };

  return loadAndCalculate(expression, defaultTo);
};
