import { ParsingScript } from 'ParsingScript';
import { MemoryObject } from 'Variable';
import { getParserFunction } from './parserFunctions';
import { Cell, isStillCollecting, isActionValid, merge } from './cell';
import { END_ARG, END_PARSING_STR } from './consts';

const updateAction = (script: ParsingScript, ch: string, to: string): string => {
  if (
    script.from >= script.data.length ||
    END_PARSING_STR.includes(script.getCurrentChar()) ||
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

export const loadAndCalculate = (script: ParsingScript, to: string): MemoryObject => {
  const listToMerge: Cell[] = [];
  let item = '';

  do {
    const ch = script.getCurrentChar();
    script.forward();
    if (isStillCollecting(item, ch, to, '')) {
      item += ch;
      if (script.from < script.data.length && !to.includes(script.getCurrentChar())) {
        continue;
      }
    }
    const fn = getParserFunction(script, item, ch);

    const value = fn(script);

    const action = isActionValid(ch) ? ch : updateAction(script, ch, to);
    listToMerge.push(new Cell(value, action));
    item = '';
  } while (script.from < script.data.length && !to.includes(script.getCurrentChar()));
  if (
    script.from < script.data.length &&
    (script.getCurrentChar() === END_ARG || to.includes(script.getCurrentChar()))
  ) {
    script.forward();
  }

  return merge(listToMerge);
};
