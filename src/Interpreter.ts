import { ParsingScript } from './ParsingScript';
import { loadAndCalculate } from './parser';
import { ELSE, END_ARG, END_GROUP, END_STATEMENT, START_GROUP, END_PARSING_STR } from './consts';
import { getNextToken, goToNextStatement } from './utils';

export const process = (scriptData: string): number => {
  let result = 0;
  const script = new ParsingScript(scriptData);

  while (script.stillValid()) {
    result = loadAndCalculate(script, END_STATEMENT).getValue();

    goToNextStatement(script);
  }

  return result;
};

const processBlock = (script: ParsingScript): number => {
  let result = null;

  while (script.stillValid()) {
    const endGroupRead = goToNextStatement(script);
    if (endGroupRead > 0) {
      return result !== null ? result : 0;
    }

    if (!script.stillValid()) {
      throw new Error("Couldn't process block");
    }
    result = loadAndCalculate(script, END_PARSING_STR).getValue(); // ХЗ
  }
  if (result === null) {
    throw new Error("Couldn't process block 2");
  }
  return result;
};
const skipBlock = (script: ParsingScript) => {
  let startCount = 0;
  let endCount = 0;
  while (startCount === 0 || startCount > endCount) {
    if (!script.stillValid()) {
      throw Error("Couldn't skip block []");
    }
    const currentChar = script.getCurrentChar();
    script.forward();
    switch (currentChar) {
      case START_GROUP:
        startCount += 1;
        break;
      case END_GROUP:
        endCount += 1;
        break;
      default:
        break;
    }
  }

  if (startCount !== endCount) {
    throw Error('Mismatched parentheses');
  }
};

const skipRestBlocks = (script: ParsingScript) => {
  while (script.stillValid()) {
    const nextData = new ParsingScript(script.data, script.from);
    const nextToken = getNextToken(nextData);
    if (nextToken !== ELSE) {
      return;
    }
    script.from = nextData.from;
    skipBlock(script);
  }
};

export const processIf = (script: ParsingScript): number => {
  const statementResult = loadAndCalculate(script, END_ARG).getValue();
  const isTrue = !!statementResult;

  if (isTrue) {
    const result = processBlock(script);
    skipRestBlocks(script);
    return result;
  }
  skipBlock(script);

  const nextData = new ParsingScript(script.data, script.from);
  const nextToken = getNextToken(nextData);
  if (nextToken === ELSE) {
    script.from = nextData.from + 1;
    return processBlock(script);
  }
  return 0;
};

export const processWhile = (script: ParsingScript): number => {
  const conditionStart = script.from;
  let stillValid = true;
  while (stillValid) {
    script.from = conditionStart;
    const res = loadAndCalculate(script, END_ARG).getValue();
    stillValid = !!res;
    if (!stillValid) {
      break;
    }

    processBlock(script);
  }
  skipBlock(script);

  return 0;
};

const getBodyBefore = (script: ParsingScript, end: string) => {
  const elIndex = script.data.slice(script.from).indexOf(end);
  const res = script.data.slice(script.from, script.from + elIndex);
  script.from = elIndex + 1;
  return res;
};

export const processFor = (script: ParsingScript): number => {
  const forString = getBodyBefore(script, ') ');
  const forTokens = forString.split(END_STATEMENT);

  const initScript = new ParsingScript(forTokens[0].trim());
  const condScript = new ParsingScript(forTokens[1].trim());
  const loopScript = new ParsingScript(forTokens[2].trim());
  loadAndCalculate(initScript, END_ARG);
  const startForCondition = script.from;
  let stillValid = true;

  while (stillValid) {
    condScript.from = 0;
    loopScript.from = 0;
    const condResult = loadAndCalculate(condScript, END_ARG);
    stillValid = condResult.getValue() !== 0;
    if (!stillValid) {
      break;
    }
    script.from = startForCondition;
    processBlock(script);
    loadAndCalculate(loopScript, END_ARG);
  }
  return 0;
};
