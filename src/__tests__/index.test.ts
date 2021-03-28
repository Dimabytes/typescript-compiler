import path from 'path';
import { Interpreter } from '../Interpreter';

const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename: string) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// describe('calculateExpression', () => {
//   test.each([
//     ['2+2', 4],
//     ['1+2*3', 7],
//     ['10^3/2', 500],
//     ['(10-5)*(5^2)', 125],
//     ['0+0', 0],
//   ])('expression %s is equal %i', (expression, expected) => {
//     const calculator = new ExpressionCalculator(expression);
//     expect(calculator.loadAndCalculate()).toBe(expected);
//   });
//
//   it('calculate sin', async () => {
//     const calculator = new ExpressionCalculator('sin(PI/2)');
//     expect(calculator.loadAndCalculate()).toBe(1);
//   });
//
//   it('calculate pow', async () => {
//     const calculator = new ExpressionCalculator('pow(5, 2)');
//     expect(calculator.loadAndCalculate()).toBe(25);
//   });
//
//   it('calculate expression from file', async () => {
//     const res = await calculateFileExpression(getFixturePath('expressionExample.txt'));
//     expect(res).toBe(900);
//   });
//
//   it('calculate if statement from file', async () => {
//     const calculator = new ExpressionCalculator('if(100) {5} else {10}');
//     expect(calculator.loadAndCalculate()).toBe(5);
//   });
// });

describe('test', () => {
  it('calculate', () => {
    const data = 'pow(2,5)';
    const res = Interpreter.process(data);

    expect(res).toBe(8);
  });
});
