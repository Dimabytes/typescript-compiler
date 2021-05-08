import { MemoryNumber, MemoryObject } from './Variable';
import { START_ARG, END_ARG } from './consts';

export class Cell {
  value: MemoryObject;

  action: string;

  constructor(value: MemoryObject, action: string) {
    this.value = value;
    this.action = action;
  }

  setValue(value: MemoryObject): void {
    this.value = value;
  }

  getAction(): string {
    return this.action;
  }

  setAction(action: string): void {
    this.action = action;
  }
}

const getPriority = (action: string) => {
  switch (action) {
    case '^':
      return 4;
    case '*':
    case '/':
      return 3;
    case '+':
    case '-':
      return 2;
    default:
      return 0;
  }
};

const canMergeCells = (leftCell: Cell, rightCell: Cell) => {
  return getPriority(leftCell.getAction()) >= getPriority(rightCell.getAction());
};

const mergeCells = (leftCell: Cell, rightCell: Cell) => {
  switch (leftCell.getAction()) {
    case '^':
      leftCell.setValue(new MemoryNumber(leftCell.value.getValue() ** rightCell.value.getValue()));
      break;
    case '*':
      leftCell.setValue(new MemoryNumber(leftCell.value.getValue() * rightCell.value.getValue()));
      break;
    case '/':
      leftCell.setValue(new MemoryNumber(leftCell.value.getValue() / rightCell.value.getValue()));
      break;
    case '+':
      leftCell.setValue(new MemoryNumber(leftCell.value.getValue() + rightCell.value.getValue()));
      break;
    case '-':
      leftCell.setValue(new MemoryNumber(leftCell.value.getValue() - rightCell.value.getValue()));
      break;
    case '=':
      leftCell.value.setValue(rightCell.value.getValue());
      break;
    default:
  }
  leftCell.setAction(rightCell.getAction());
};

export const merge = (listToMerge: Cell[]): MemoryObject => {
  let index = 1;

  const iter = (currentCell: Cell, mergeOneOnly: boolean) => {
    while (index < listToMerge.length) {
      const next = listToMerge[index];
      index += 1;
      while (!canMergeCells(currentCell, next)) {
        iter(next, true);
      }

      mergeCells(currentCell, next);

      if (mergeOneOnly) {
        return currentCell.value;
      }
    }
    return currentCell.value;
  };
  return iter(listToMerge[0], false);
};

export const isActionValid = (ch: string): boolean => {
  const actions = ['*', '/', '+', '-', '^', '='];
  return actions.includes(ch);
};

export const isStillCollecting = (
  item: string,
  ch: string,
  to: string,
  defaultTo: string
): boolean => {
  const stopCollecting = to === END_ARG || to === defaultTo ? END_ARG : to;
  return (
    (item.length === 0 && (ch === '-' || ch === END_ARG)) ||
    !(isActionValid(ch) || ch === START_ARG || ch === stopCollecting)
  );
};
