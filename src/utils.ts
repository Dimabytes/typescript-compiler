import { ParsingScript } from './ParsingScript';
import { END_ARG, END_GROUP, SPACE, START_GROUP, TOKEN_SEPARATION, END_STRING } from './consts';

export const goToNextStatement = (script: ParsingScript): number => {
  let endGroupRead = 0;

  while (script.stillValid()) {
    const currentChar = script.getCurrentChar();
    switch (currentChar) {
      case END_GROUP:
        endGroupRead += 1;
        script.forward();
        return endGroupRead;
      case START_GROUP:
      case END_ARG:
      case END_STRING:
      case SPACE:
        script.forward();
        break;
      default:
        return endGroupRead;
    }
  }
  return endGroupRead;
};

export const getNextToken = (script: ParsingScript): string => {
  if (!script.stillValid()) {
    return '';
  }

  const end = script.data
    .split('')
    .slice(script.from + 1)
    .findIndex((el) => TOKEN_SEPARATION.includes(el));

  if (end === undefined) {
    return '';
  }
  const variable = script.data.slice(script.from + 1, script.from + end + 1);
  script.from += end;
  return variable;
};
