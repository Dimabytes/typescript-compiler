import fs from 'fs/promises';
import { ExpressionCalculator } from './parser';

export const calculateFileExpression = async (filepath: string): Promise<number> => {
  const expression = await fs.readFile(filepath, 'utf-8');
  const calculator = new ExpressionCalculator(expression);
  return calculator.loadAndCalculate();
};
