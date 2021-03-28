import path from 'path';
import { process } from '../Interpreter';

const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename: string) => fs.readFileSync(getFixturePath(filename), 'utf-8');

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

  it('calculate sin', async () => {
    expect(process('sin(PI/2)')).toBe(1);
  });

  it('calculate pow', async () => {
    expect(process('pow(5, 2)')).toBe(25);
  });

  // it('calculate expression from file', async () => {
  //   const res = await calculateFileExpression(getFixturePath('expressionExample.txt'));
  //   expect(res).toBe(900);
  // });

  it('calculate if statement from file', async () => {
    expect(process('if(100) {5} else {10}')).toBe(5);
  });
});
