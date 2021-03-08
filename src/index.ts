import fs from 'fs/promises';
import { calculateExpression } from './parser';

export const calculateFileExpression = async (filepath: string): Promise<number> => {
  const expression = await fs.readFile(filepath, 'utf-8');

  return calculateExpression(expression);
};
