import { processIf } from './Interpreter';
import { END_ARG, START_ARG } from './consts';
import { ParsingScript } from './ParsingScript';
import { loadAndCalculate } from './parser';

type ParserFunction = (script: ParsingScript) => number;

const parserFunctions: Record<string, ParserFunction> = {
  sin: (script) => {
    const arg = loadAndCalculate(script, END_ARG);
    return Math.sin(arg);
  },
  PI: () => {
    return Math.PI;
  },
  pow: (script) => {
    const arg1 = loadAndCalculate(script, ',');
    const arg2 = loadAndCalculate(script, END_ARG);
    return arg1 ** arg2;
  },
  if: (script) => {
    return processIf(script);
  },
  log: (script) => {
    const arg = loadAndCalculate(script, END_ARG);
    console.log(arg);
    return 0;
  },
};

const stringToNumber: (item: string) => ParserFunction = (item) => () => {
  const number = +item;
  if (Number.isNaN(number)) {
    throw new Error(`Error parsing number from string ${item}`);
  }
  return number;
};

export const getParserFunction = (
  script: ParsingScript,
  item: string,
  ch: string
): ParserFunction => {
  if (item.length === 0 && ch === START_ARG) {
    return () => loadAndCalculate(script, END_ARG);
  }
  if (parserFunctions[item] !== undefined) {
    return parserFunctions[item];
  }
  return stringToNumber(item);
};
