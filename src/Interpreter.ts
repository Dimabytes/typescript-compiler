import { ParsingScript } from './ParsingScript';
import { loadAndCalculate } from './parser';
import { END_STATEMENT } from './consts';
import { goToNextStatement } from './utils';

export const process = (scriptData: string): number => {
  let result = 0;
  const script = new ParsingScript(scriptData);

  while (script.stillValid()) {
    result = loadAndCalculate(script, END_STATEMENT);

    goToNextStatement(script);
  }

  return result;
};
