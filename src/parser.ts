import { Cell, isStillCollecting, isActionValid, merge } from './cell';
import { END_ARG, START_ARG } from './consts';

type ParserFunction = (data: string, item: string) => number;

export const calculateExpression = (expression: string): number => {
  let expressionPosition = 0;

  const updateAction = (item: string, ch: string, to: string) => {
    if (
      expressionPosition >= item.length ||
      item[expressionPosition] === END_ARG ||
      item[expressionPosition] === to
    ) {
      return END_ARG;
    }

    let index = expressionPosition;
    let res = ch;
    while (!isActionValid(res) && index < item.length) {
      // смотрим на следующий символ в строке,
      // пока не найдем допустимое действие
      res = item[index];
      index += 1;
    }
    if (isActionValid(res)) {
      expressionPosition = index;
    } else if (index > expressionPosition) {
      expressionPosition = index - 1;
    }
    return res;
  };

  const identityFunction: ParserFunction = (data) => {
    // eslint-disable-next-line no-use-before-define
    return loadAndCalculate(data, END_ARG);
  };

  const strtodFunction: ParserFunction = (data, item) => {
    return +item;
  };

  const getParserFunction = (data: string, item: string, ch: string): ParserFunction => {
    if (item.length === 0 && ch === START_ARG) {
      return identityFunction;
    }
    return strtodFunction;
  };

  const loadAndCalculate = (data: string, to = ' '): number => {
    const listToMerge: Cell[] = [];
    let item = '';

    do {
      const ch = data[expressionPosition];
      expressionPosition += 1;

      if (isStillCollecting(item, ch, to)) {
        item += ch;
        if (expressionPosition < data.length && data[expressionPosition] !== to) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      const fn = getParserFunction(data, item, ch);

      const value = fn(data, item);

      const action = isActionValid(ch) ? ch : updateAction(data, ch, to);
      listToMerge.push(new Cell(value, action));
      item = '';
    } while (expressionPosition < data.length && data[expressionPosition] !== to);

    if (
      expressionPosition < data.length &&
      (data[expressionPosition] === END_ARG || data[expressionPosition] === to)
    ) {
      expressionPosition += 1;
    }

    return merge(listToMerge);
  };

  return loadAndCalculate(expression);
};
