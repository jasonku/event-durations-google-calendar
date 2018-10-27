describe("calculateDiff", () => {
  const testCases = [
    {
      desc: 'english',
      eventTime: '10:15am – 2:30pm',
      expectedDiff: 15300000,
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
      desc: 'short events with a location with dash-numbers',
      eventTime: '10:30am, DUR-5-Hey',
      expectedDiff: NaN,
    },
  ];

  testCases.forEach((testCase) => {
    it(`should calculate diff for ${testCase.desc}`, () => {
      const diff = calculateDiff(testCase.eventTime);
      expect(diff).toEqual(testCase.expectedDiff);
    });
  });
});
