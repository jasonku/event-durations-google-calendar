describe("calculateDiff", () => {
  const testCases = [
    {
      desc: 'english',
      eventTime: '10:15am – 2:30pm',
      expectedDiff: 15300000,
    },
    {
      desc: 'english with only am times',
      eventTime: '10:15 – 11:30am',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with only pm times',
      eventTime: '2:15 - 3:30pm',
      expectedDiff: 4500000,
    },
    {
      desc: 'dansk',
      eventTime: '10:15am-2:30pm',
      expectedDiff: 15300000,
    },
    {
      desc: 'deutsch',
      eventTime: '10:15AM bis 2:30PM',
      expectedDiff: 15300000,
    },
    {
      desc: 'deutsch with only pm times',
      eventTime: '3:00 bis 5:45PM',
      expectedDiff: 9900000,
    },
    {
      desc: 'francais',
      eventTime: '10:15am à 2:30pm',
      expectedDiff: 15300000,
    },
    {
      desc: 'portugues',
      eventTime: '10:15am até 2:30pm',
      expectedDiff: 15300000,
    },
    {
      desc: 'japanese spanning am-pm',
      eventTime: '午前10:15～午後2:30',
      expectedDiff: 15300000,
    },
    {
      desc: 'japanese only pm starting on an even hour',
      eventTime: '午後3:00～4:45',
      expectedDiff: 6300000,
    },
    {
      desc: 'short events with a location with dash-numbers',
      eventTime: '10:30am, DUR-5-Hey',
      expectedDiff: NaN,
    },
    {
      desc: 'chinese spanning am-pm',
      eventTime: '上午11:45 - 下午2:45',
      expectedDiff: 10800000,
    },
    {
      desc: 'chinese am',
      eventTime: '上午9:00 - 10:15',
      expectedDiff: 4500000,
    },
    {
      desc: 'chinese pm',
      eventTime: '下午3:00 - 5:30',
      expectedDiff: 9000000,
    },
    {
      desc: 'korean spanning am-pm',
      eventTime: '오전 11:45~오후 2:45',
      expectedDiff: 10800000,
    },
    {
      desc: 'korean am',
      eventTime: '오전 9:00~ 10:15',
      expectedDiff: 4500000,
    },
    {
      desc: 'korean pm',
      eventTime: '오후 3:00~ 5:45',
      expectedDiff: 9900000,
    },
  ];

  testCases.forEach((testCase) => {
    it(`should calculate diff for ${testCase.desc}`, () => {
      const diff = calculateDiff(testCase.eventTime);
      expect(diff).toEqual(testCase.expectedDiff);
    });
  });
});
