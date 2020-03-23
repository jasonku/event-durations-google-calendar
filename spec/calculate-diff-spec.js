describe("calculateDiff", () => {
  const testCases = [
    {
      desc: 'english',
      eventMetadata: '10:15am to 2:30pm, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'english with only am times',
      eventMetadata: '10:15am to 11:30am, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with only pm times',
      eventMetadata: '2:15pm to 3:30pm, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with only am times that start at midnight hour',
      eventMetadata: '12am to 1:15am, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with military time',
      eventMetadata: '10:15 to 14:30, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'english with only am times with military time',
      eventMetadata: '10:15 to 11:30, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with only pm times',
      eventMetadata: '14:15pm to 15:30pm, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'english with only am times that start at midnight hour',
      eventMetadata: '00:00 to 01:15, one event, Event Durations, Accepted, Location: some location, March 24, 2020',
      expectedDiff: 4500000,
    },
    {
      desc: 'dansk',
      eventMetadata: '10:15am til 2:30pm, one event, Event Durations, Accepteret, Placering: some location, 24. marts 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'deutsch',
      eventMetadata: '10:15AM bis 2:30PM, one event, Event Durations, Angenommen, Ort: some location, 24. März 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'deutsch with only pm times',
      eventMetadata: '3PM bis 5:45PM, one event, Event Durations, Angenommen, Ort: some location, 24. März 2020',
      expectedDiff: 9900000,
    },
    {
      desc: 'francais',
      eventMetadata: 'de 10:15am à 2:30pm, one event, Event Durations, Accepté, Lieu : some location, 24 mars 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'portugues brasil',
      eventMetadata: '10:15am - 2:30pm, one event, Event Durations, Aceito, Local: some location, 24 de março de 2020',
      expectedDiff: 15300000,
    },
    {
      desc: 'japanese spanning am-pm',
      eventMetadata: '午前10:15～午後2:30、one event、Event Durations、承諾済み、場所: some location、2020年 3月 24日',
      expectedDiff: 15300000,
    },
    {
      desc: 'japanese only pm starting on an even hour',
      eventMetadata: '午後3時～午後4:45、one event、Event Durations、承諾済み、場所: some location、2020年 3月 24日',
      expectedDiff: 6300000,
    },
    {
      desc: 'chinese spanning am-pm',
      eventMetadata: '上午11:45至下午2:45，one event，Event Durations，已接受，地点：some location，2020年3月24日',
      expectedDiff: 10800000,
    },
    {
      desc: 'chinese am',
      eventMetadata: '上午9点至上午10:15，one event，Event Durations，已接受，地点：some-location-5，2020年3月24',
      expectedDiff: 4500000,
    },
    {
      desc: 'chinese pm',
      eventMetadata: '下午3点至下午5:30，one event，Event Durations，已接受，地点：some-location-5，2020年3月24日',
      expectedDiff: 9000000,
    },
    {
      desc: 'korean spanning am-pm',
      eventMetadata: '오전 11:45~오후 2:45, one event, Event Durations, 수락함, 위치: some-location-5, 2020년 3월 24일',
      expectedDiff: 10800000,
    },
    {
      desc: 'korean am',
      eventMetadata: '오전 9시~오전 10:15, one event, Event Durations, 수락함, 위치: some-location-5, 2020년 3월 24일',
      expectedDiff: 4500000,
    },
    {
      desc: 'korean pm',
      eventMetadata: '오후 3시~오후 5:45, one event, Event Durations, 수락함, 위치: some-location-5, 2020년 3월 24일',
      expectedDiff: 9900000,
    },
    {
      desc: 'bahasa indonesian',
      eventMetadata: '11am sampai 1pm, one event, Event Durations, Diterima, Lokasi: some-location-5, 24 Maret 2020',
      expectedDiff: 7200000,
    },
    {
      desc: 'catala',
      eventMetadata: 'De les 11am a les 1pm, one event, Event Durations, Acceptat, Lloc: some-location-5, 24 de de març de 2020',
      expectedDiff: 7200000,
    },
    {
      desc: 'espanol',
      eventMetadata: 'De 11am a 1pm, one event, Event Durations, Aceptado, Ubicación: some-location-5, 24 de marzo de 2020',
      expectedDiff: 7200000,
    },
    {
      desc: 'filipino',
      eventMetadata: '11AM hanggang 1PM, one event, Event Durations, Tinanggap, Lokasyon: some-location-5, 24 Marso 2020',
      expectedDiff: 7200000,
    },
    {
      desc: 'portugues portugal',
      eventMetadata: '11am às 1pm, one event, Event Durations, Aceite, Localização: some-location-5, 24 de março de 2020',
      expectedDiff: 7200000,
    },
    {
      desc: 'svenska',
      eventMetadata: '11am till 1pm, one event, Event Durations, Tackat ja, Plats: some-location-5, den 24 mars 2020',
      expectedDiff: 7200000,
    },
  ];

  testCases.forEach((testCase) => {
    it(`should calculate diff for ${testCase.desc}`, () => {
      const diff = calculateDiff(testCase.eventMetadata);
      expect(diff).toEqual(testCase.expectedDiff);
    });
  });
});
