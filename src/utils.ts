import { ParsingScript } from './ParsingScript';
import { END_ARG, END_GROUP, START_GROUP } from './consts';

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
        script.forward();
        break;
      default:
        return endGroupRead;
    }
  }
  return endGroupRead;
};
