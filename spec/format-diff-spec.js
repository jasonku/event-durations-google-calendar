describe("formatDiff", () => {
  const testCases = [
    {
      diff: 15300000,
      expectedHourMinuteFormat: '4h 15m',
      expectedDecimalHourFormat: '4.25 hours',
    },
    {
      diff: 4500000,
      expectedHourMinuteFormat: '1h 15m',
      expectedDecimalHourFormat: '1.25 hours',
    },
    {
      diff: 9456789,
      expectedHourMinuteFormat: '2h 37m',
      expectedDecimalHourFormat: '2.62 hours',
    },
    {
      diff: 123456789,
      expectedHourMinuteFormat: '34h 17m',
      expectedDecimalHourFormat: '34.29 hours',
    },
    {
      diff: 3600000,
      expectedHourMinuteFormat: '1h 0m',
      expectedDecimalHourFormat: '1 hour',
    },
  ];

  testCases.forEach((testCase) => {
    it(`should format diff with default format for ${testCase.diff}`, () => {
      expect(formatDiff(testCase.diff)).toEqual(testCase.expectedHourMinuteFormat);
    });

    it(`should format diff with hourMinutes for ${testCase.diff}`, () => {
      expect(formatDiff(testCase.diff, 'hourMinutes')).toEqual(testCase.expectedHourMinuteFormat);
    });

    it(`should format diff with decimalHours for ${testCase.diff}`, () => {
      expect(formatDiff(testCase.diff, 'decimalHours')).toEqual(testCase.expectedDecimalHourFormat);
    });
  });
});
