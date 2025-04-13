export interface CrisisKeyword {
  keyword: string;
  title: string;
  description: string;
  contacts: {
    name: string;
    phone: string;
    url: string;
  }[];
}

export const crisisKeywords: CrisisKeyword[] = [
  {
    keyword: '가출',
    title: '가출 청소년 지원',
    description: '가출 청소년을 위한 보호 및 상담 지원',
    contacts: [
      {
        name: '청소년상담복지센터',
        phone: '1388',
        url: 'https://www.1388.or.kr'
      }
    ]
  },
  {
    keyword: '가정폭력',
    title: '가정폭력 피해자 지원',
    description: '가정폭력 피해자를 위한 보호 및 법률 지원',
    contacts: [
      {
        name: '가정폭력상담소',
        phone: '1366',
        url: 'https://www.women1366.kr'
      }
    ]
  },
  {
    keyword: '학교폭력',
    title: '학교폭력 피해자 지원',
    description: '학교폭력 피해자를 위한 상담 및 법률 지원',
    contacts: [
      {
        name: '학교폭력신고센터',
        phone: '117',
        url: 'https://www.schoolsafe.kr'
      }
    ]
  },
  {
    keyword: '자살충동',
    title: '자살예방 상담',
    description: '자살 위기 상황에 대한 전문 상담 지원',
    contacts: [
      {
        name: '자살예방상담전화',
        phone: '1393',
        url: 'https://www.spckorea.or.kr'
      }
    ]
  },
  {
    keyword: '사이버폭력',
    title: '사이버폭력 피해자 지원',
    description: '사이버폭력 피해자를 위한 상담 및 법률 지원',
    contacts: [
      {
        name: '사이버폭력신고센터',
        phone: '118',
        url: 'https://www.cyberbullying.or.kr'
      }
    ]
  },
  {
    keyword: '직장내괴롭힘',
    title: '직장내 괴롭힘 상담',
    description: '직장내 괴롭힘 피해자를 위한 상담 및 법률 지원',
    contacts: [
      {
        name: '고용노동부 상담센터',
        phone: '1350',
        url: 'https://www.moel.go.kr'
      }
    ]
  },
  {
    keyword: '정신건강',
    title: '정신건강 상담',
    description: '정신건강 문제에 대한 전문 상담 지원',
    contacts: [
      {
        name: '정신건강상담전화',
        phone: '1577-0199',
        url: 'https://www.mohw.go.kr'
      }
    ]
  }
]; 