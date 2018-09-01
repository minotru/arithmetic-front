export interface ITaskConfig {
  digitsCnt: number;
  topic: TopicName;
  level: number;
  operationsCnt: number;
  speed: number;
  withRemainder: boolean;
}

export interface IOperation {
  operationType: OperationType;
  operand: number;
}

export interface ITask {
  id: string;
  userId: string;
  config: ITaskConfig;
  answer?: number;
  isCorrect?: boolean;
  date?: Date;
  operations?: IOperation[];
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

export enum RestrictionsType {
  ALLOWED = 'allowed',
  FORBIDDEN = 'forbidden',
}

export interface ILevel {
  [operation: string]: {
    [leftValue: string]: {
      restrictionsType: RestrictionsType,
      restrictions: string[],
    },
  };
}

export interface ITopic {
  [levelName: string]: ILevel;
}

export interface IGameMap {
  [topic: string]: ITopic;
}

export interface ITopicPreview {
  name: string;
  caption: string;
  levels: string[];
}

