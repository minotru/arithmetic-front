import { ITopicPreview, TopicName, TopicType } from './interfaces';

export const TOPICS: ITopicPreview[] = [
  {
    name: TopicName.SIMPLE,
    caption: 'ПРОСТО',
    levels: [2, 3, 4, 5, 6, 7, 8, 9],
    formatLevel: (level: number) => level.toString(),
    topicType: TopicType.PLUS_MINUS,
  },
  {
    name: TopicName.BROTHER,
    caption: 'БРАТ',
    levels: [4, 3, 2, 1],
    formatLevel: (level: number) => level.toString(),
    topicType: TopicType.PLUS_MINUS,
  },
  {
    name: TopicName.FRIEND,
    caption: 'ДРУГ',
    levels: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    formatLevel: (level: number) => level.toString(),
    topicType: TopicType.PLUS_MINUS,
  },
  {
    name: TopicName.FRIEND_PLUS_BROTHER,
    caption: 'ДРУГ+БРАТ',
    levels: [6, 7, 8, 9],
    formatLevel: (level: number) => level.toString(),
    topicType: TopicType.PLUS_MINUS,
  },
];

export const ALL_TOPICS: ITopicPreview[] = [
  ...TOPICS,
  {
    name: TopicName.MULTIPLICATION,
    caption: 'УМНОЖЕНИЕ',
    formatLevel: (level: number) => `${level.toString()[0]}x${level.toString()[1]}`,
    levels: [
      21,
      31,
      22,
      32,
    ],
    topicType: TopicType.MULTIPLICATION,
  },
  {
    name: TopicName.DIVISION,
    caption: 'ДЕЛЕНИЕ',
    formatLevel: (level: number) => `${level.toString()[0]}/${level.toString()[1]}`,
    levels: [
      21,
      31,
      22,
      32,
    ],
    topicType: TopicType.DIVISION,
  },
];


