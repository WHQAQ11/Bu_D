/**
 * 易经64卦象数据
 */

export interface Hexagram {
  number: number;
  name: string;
  pinyin: string;
  upperTrigram: string;
  lowerTrigram: string;
  guaci: string;
  tuanCI?: string;
  xiangCI?: string;
}

export const HEXAGRAMS: Hexagram[] = [
  {
    number: 1,
    name: '乾',
    pinyin: 'qián',
    upperTrigram: '乾',
    lowerTrigram: '乾',
    guaci: '乾：元，亨，利，贞。',
    tuanCI: '《彖》曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成，时乘六龙以御天。乾道变化，各正性命，保合太和，乃利贞。首出庶物，万国咸宁。',
  },
  {
    number: 2,
    name: '坤',
    pinyin: 'kūn',
    upperTrigram: '坤',
    lowerTrigram: '坤',
    guaci: '坤：元，亨，利牝马之贞。',
    tuanCI: '《彖》曰：至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。含弘光大，品物咸亨。牝马地类，行地无疆，柔顺利贞。君子攸行，先迷失道，后顺得常。西南得朋，东北丧朋，安贞吉。',
  },
  {
    number: 3,
    name: '屯',
    pinyin: 'zhūn',
    upperTrigram: '坎',
    lowerTrigram: '震',
    guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。',
  },
  {
    number: 4,
    name: '蒙',
    pinyin: 'méng',
    upperTrigram: '艮',
    lowerTrigram: '坎',
    guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
  },
  {
    number: 5,
    name: '需',
    pinyin: 'xū',
    upperTrigram: '坎',
    lowerTrigram: '乾',
    guaci: '需：有孚，光亨，贞吉。利涉大川。',
  },
  {
    number: 6,
    name: '讼',
    pinyin: 'sòng',
    upperTrigram: '乾',
    lowerTrigram: '坎',
    guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。',
  },
  {
    number: 7,
    name: '师',
    pinyin: 'shī',
    upperTrigram: '坤',
    lowerTrigram: '坎',
    guaci: '师：贞，丈人吉，无咎。',
  },
  {
    number: 8,
    name: '比',
    pinyin: 'bǐ',
    upperTrigram: '坎',
    lowerTrigram: '坤',
    guaci: '比：吉。原筮元永贞，无咎。不宁方来，后夫凶。',
  },
];

export function getHexagramByNumber(number: number): Hexagram | undefined {
  return HEXAGRAMS.find((h) => h.number === number);
}

export function getHexagramByName(name: string): Hexagram | undefined {
  return HEXAGRAMS.find((h) => h.name === name);
}
