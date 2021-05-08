// eslint-disable-next-line max-classes-per-file
import { globalVariables } from './consts';

export abstract class MemoryObject {
  abstract getValue(): number;

  abstract setValue(newValue: number): void;
}

export class MemoryNumber extends MemoryObject {
  private value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  setValue(newValue: number): void {
    this.value = newValue;
  }
}

export class MemoryVariable extends MemoryObject {
  private key: string;

  constructor(key: string) {
    super();
    this.key = key;
    if (globalVariables.getValue(key) === undefined) {
      globalVariables.setValue(key, 0);
    }
  }

  getValue(): number {
    return globalVariables.getValue(this.key);
  }

  setValue(newValue: number): void {
    globalVariables.setValue(this.key, newValue);
  }
}
