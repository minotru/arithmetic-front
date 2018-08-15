export interface ITaskConfig {
  digitsCnt: number;
  topic: TopicName;
  level: number;
  operationsCnt: number;
  speed: number;
}

export interface IOperation {
  operationType: OperationType;
  operand: number;
}

export interface ITask {
  id: string;
  userId?: string;
  config: ITaskConfig;
  answer?: number;
  isCorrect?: boolean;
  createdAt?: Date;
  operations: IOperation[];
}

export enum OperationType {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

export enum TopicName {
  SIMPLE = 'simple',
  BROTHER = 'brother',
  FRIEND = 'friend',
  FRIEND_AND_BROTHER = 'friend-plus-brother',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}

export interface ITopic {
  name: string;
  caption: string;
  levels: string[];
}
