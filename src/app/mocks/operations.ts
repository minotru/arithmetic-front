import { IOperation, OperationType } from '../interfaces/task';

export const OPERATIONS: IOperation[] = [
  {
    operationType: OperationType.PLUS,
    operand: 8,
  },
  {
    operationType: OperationType.PLUS,
    operand: 3,
  },
  {
    operationType: OperationType.MINUS,
    operand: 5,
  },
  {
    operationType: OperationType.PLUS,
    operand: 12,
  },
  {
    operationType: OperationType.PLUS,
    operand: 4,
  },
  {
    operationType: OperationType.PLUS,
    operand: 2,
  },
  {
    operationType: OperationType.MINUS,
    operand: 2,
  },
  {
    operationType: OperationType.PLUS,
    operand: 6,
  },
];
