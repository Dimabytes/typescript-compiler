// import path from 'path';
// import fs from 'fs';
import { calculateExpression } from '../parser';

// const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename: string) => fs.readFileSync(getFixturePath(filename), 'utf-8');
//
// const expectedValue = JSON.parse(readFile('expect.json'));

describe('calculateExpression', () => {
  test.each([
    ['2+2', 4],
    ['1+2*3', 7],
    ['10^3/2', 500],
    ['(10-5)*(5^2)', 125],
    ['0+0', 0],
  ])('expression %s is equal %i', (expression, expected) => {
    expect(calculateExpression(expression)).toBe(expected);
  });
});
