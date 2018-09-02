import { ITopicPreview, TopicName } from './interfaces';

export const TOPICS: ITopicPreview[] = [
  {
    name: TopicName.SIMPLE,
    caption: 'ПРОСТО',
    levels: ['2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    name: TopicName.BROTHER,
    caption: 'БРАТ',
    levels: ['4', '3', '2', '1'],
  },
  {
    name: TopicName.FRIEND,
    caption: 'ДРУГ',
    levels: ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },
  {
    name: TopicName.FRIEND_PLUS_BROTHER,
    caption: 'ДРУГ+БРАТ',
    levels: ['6', '7', '8', '9'],
  },
];

export const ALL_TOPICS: ITopicPreview[] = [
  ...TOPICS,
  {
    name: TopicName.MULTIPLICATION,
    caption: 'УМНОЖЕНИЕ',
    levels: [
      '2x1',
      '3x1',
      '2x2',
      '3x2',
    ],
  },
  {
    name: TopicName.DIVISION,
    caption: 'ДЕЛЕНИЕ',
    levels: [
      '2/1',
      '3/1',
      '2/2',
      '3/2',
    ],
  },
];


