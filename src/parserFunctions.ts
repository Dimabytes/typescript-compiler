import { MemoryObject, MemoryVariable, MemoryNumber } from './Variable';
import { processFor, processIf, processWhile } from './Interpreter';
import { END_ARG, START_ARG } from './consts';
import { ParsingScript } from './ParsingScript';
import { loadAndCalculate } from './parser';

type ParserFunction = (script: ParsingScript) => MemoryObject;

const parserFunctions: Record<string, ParserFunction> = {
  sin: (script) => {
    const arg = loadAndCalculate(script, END_ARG);
    return new MemoryNumber(Math.sin(arg.getValue()));
  },
  PI: () => {
    return new MemoryNumber(Math.PI);
  },
  pow: (script) => {
    const arg1 = loadAndCalculate(script, ',');
    const arg2 = loadAndCalculate(script, END_ARG);
    return new MemoryNumber(arg1.getValue() ** arg2.getValue());
  },
  less: (script) => {
    const arg1 = loadAndCalculate(script, ',');
    const arg2 = loadAndCalculate(script, END_ARG);
    if (arg1.getValue() < arg2.getValue()) {
      return new MemoryNumber(1);
    }
    return new MemoryNumber(0);
  },
  if: (script) => {
    return new MemoryNumber(processIf(script));
  },
  while: (script) => {
    return new MemoryNumber(processWhile(script));
  },
  for: (script) => {
    return new MemoryNumber(processFor(script));
  },
  log: (script) => {
    const arg = loadAndCalculate(script, END_ARG);
    console.log(arg.getValue());
    return new MemoryNumber(0);
  },
};

const stringToNumber: (item: string) => ParserFunction = (item) => () => {
  const number = +item;
  if (Number.isNaN(number)) {
    return new MemoryVariable(item);
  }
  return new MemoryNumber(number);
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
