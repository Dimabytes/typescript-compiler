import path from 'path';
import { calculateFileExpression } from '../index';
import { process } from '../Interpreter';

const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);

describe('calculateExpression', () => {
  test.each([
    ['2+2', 4],
    ['1+2*3', 7],
    ['10^3/2', 500],
    ['(10-5)*(5^2)', 125],
    ['0+0', 0],
  ])('expression %s is equal %i', (expression, expected) => {
    expect(process(expression)).toBe(expected);
  });

  it('calculate expression from file', async () => {
    const res = await calculateFileExpression(getFixturePath('expressionExample.txt'));
    expect(res).toBe(900);
  });
});

describe('functions with arguments', () => {
  it('sin and PI fn', async () => {
    expect(process('sin(PI/2)')).toBe(1);
  });

  it('pow fn', async () => {
    expect(process('pow(5, 2)')).toBe(25);
  });

  it('log fn', async () => {
    console.log = jest.fn();
    process('log(123)');
    expect(console.log).toHaveBeenCalledWith(123);
  });
});

describe('if statement', () => {
  it('statement from string', async () => {
    expect(process('if(0) {5} else {10}')).toBe(10);
  });

  it('false if statement from file', async () => {
    console.log = jest.fn();
    await calculateFileExpression(getFixturePath('ifFalseExample.txt'));
    expect(console.log).toHaveBeenCalledWith(10);
  });

  it('true if statement from file', async () => {
    console.log = jest.fn();
    await calculateFileExpression(getFixturePath('ifTrueExample.txt'));
    expect(console.log).toHaveBeenCalledWith(5);
  });
});

it('variable test', async () => {
  console.log = jest.fn();
  await calculateFileExpression(getFixturePath('VariablesExample.txt'));
  expect(console.log).toHaveBeenCalledTimes(16);
});
