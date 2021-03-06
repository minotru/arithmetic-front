type LevelFormatter = (level: number) => string;

export interface ITopicPreview {
  name: TopicName;
  caption: string;
  formatLevel: LevelFormatter;
  levels: number[];
  topicType: TopicType;
}

export interface ITaskConfig {
  digitsCnt: number;
  topic: TopicName;
  level: number;
  operationsCnt?: number;
  speed?: number;
  topicType?: TopicType;
  withRemainder?: boolean;
}

export interface IOperation {
  operationType: OperationType;
  operand: number;
}

export interface ITask {
  id: string;
  userId: string;
  config: ITaskConfig;
  answer: number[];
  isCorrect?: boolean;
  date: Date;
  operations: IOperation[];
}

export enum OperationType {
  PLUS = 'plus',
  MINUS = 'minus',
  MULTIPLY = 'mul',
  DIVIDE = 'div',
}

export enum TopicType {
  PLUS_MINUS = 'plus_minus',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division'
}

export enum TopicName {
  SIMPLE = 'simple',
  BROTHER = 'brother',
  FRIEND = 'friend',
  FRIEND_PLUS_BROTHER = 'friend-plus-brother',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}

export enum RulesType {
  ALLOWED = 'allowed',
  FORBIDDEN = 'forbidden',
}

export interface IRule {
  value: number;
  ranges: string[];
}

export interface IRulesByOperation {
  rulesType: RulesType;
  rules: IRule[];
}

export interface ILevel {
  levelName: string;
  maxDigit: number;
  [OperationType.MINUS]: IRulesByOperation;
  [OperationType.PLUS]: IRulesByOperation;
}

export interface ITopic {
  topicName: TopicName;
  levels: ILevel[];
}

export type IGameMap = ITopic[];
