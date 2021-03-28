/* eslint-disable */
import { ParsingScript } from 'ParsingScript';
import { Cell, isStillCollecting, isActionValid, merge } from './cell';
import { END_ARG, START_ARG } from './consts';

// eslint-disable-next-line no-use-before-define
type ParserFunction = (script: ParsingScript) => number;

const parserFunctions: Record<string, ParserFunction> = {
  sin: (script) => {
    // eslint-disable-next-line no-use-before-define
    const arg = loadAndCalculate(script, END_ARG);
    return Math.sin(arg);
  },
  PI: () => {
    return Math.PI;
  },
  pow: (script) => {
    // eslint-disable-next-line no-use-before-define
    const arg1 = loadAndCalculate(script, ',');
    // eslint-disable-next-line no-use-before-define
    const arg2 = loadAndCalculate(script, END_ARG);
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

const getParserFunction = (script: ParsingScript, item: string, ch: string): ParserFunction => {
  if (item.length === 0 && ch === START_ARG) {
    // eslint-disable-next-line no-use-before-define
    return () => loadAndCalculate(script, END_ARG);
  }

  if (parserFunctions[item] !== undefined) {
    return parserFunctions[item];
  }
  return stringToNumber(item);
};

const updateAction = (script: ParsingScript, ch: string, to: string): string => {
  if (
    script.from >= script.data.length ||
    script.data[script.from] === END_ARG ||
    script.data[script.from] === to
  ) {
    return END_ARG;
  }

  let index = script.from;
  let res = ch;
  while (!isActionValid(res) && index < script.data.length) {
    // смотрим на следующий символ в строке,
    // пока не найдем допустимое действие
    res = script.data[index];
    index += 1;
  }
  if (isActionValid(res)) {
    script.from = index;
  } else if (index > script.from) {
    script.from = index - 1;
  }
  return res;
};

export const loadAndCalculate = (script: ParsingScript, to: string): number => {
  const listToMerge: Cell[] = [];
  let item = '';

  do {
    const ch = script.data[script.from];
    script.from += 1;

    if (isStillCollecting(item, ch, to, '')) {
      item += ch;
      if (script.from < script.data.length && script.data[script.from] !== to) {
        continue;
      }
    }
    const fn = getParserFunction(script, item, ch);

    const value = fn(script);

    const action = isActionValid(ch) ? ch : updateAction(script, ch, to);
    listToMerge.push(new Cell(value, action));
    item = '';
  } while (script.from < script.data.length && script.data[script.from] !== to);

  if (
    script.from < script.data.length &&
    (script.data[script.from] === END_ARG || script.data[script.from] === to)
  ) {
    script.from += 1;
  }

  return merge(listToMerge);
};
