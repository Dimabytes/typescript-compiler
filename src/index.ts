import fs from 'fs/promises';
import { process } from './Interpreter';

export const calculateFileExpression = async (filepath: string): Promise<number> => {
  const expression = await fs.readFile(filepath, 'utf-8');
  const res = process(expression);
  return res;
};

calculateFileExpression('src/__fixtures__/VariablesExample.txt').then((res) => {
  console.log(res);
});
