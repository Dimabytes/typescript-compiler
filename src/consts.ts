import { MemoryObject } from './Variable';

export const END_ARG = ')';
export const START_ARG = '(';
export const END_GROUP = '}';
export const START_GROUP = '{';
export const SPACE = ' ';
export const END_STATEMENT = ';';
export const END_STRING = '\n';
export const ELSE = 'else';
export const TOKEN_SEPARATION = '<>=+-*/%&|^,!()[]{}\t\n; ';

export const END_PARSING_STR = SPACE + END_GROUP + END_STATEMENT + END_STRING;

interface GlobalVariables {
  setValue: (item: string, value: number) => void;
  getValue: (item: string) => number;
  variables: Record<string, number>;
}

export const globalVariables: GlobalVariables = {
  setValue: (item, value) => {
    globalVariables.variables[item.replace(/ /g, '')] = value;
  },
  getValue: (item) => {
    return globalVariables.variables[item.replace(/ /g, '')];
  },
  variables: {},
};
