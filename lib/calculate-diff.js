var intlDashes = Object.values({
  deutsch: 'bis',
  francais: 'à',
  portugues: 'até',
  eastAsian: '～',
  korean: '~',
}).join('|');
var dashesRegex = new RegExp('[-–]|' + intlDashes);

var eastAsianAms = new RegExp([
  '午前',
  '上午',
  '오전',
].join('|'));
var eastAsianPms = new RegExp([
  '午後',
  '下午',
  '오후',
].join('|'));

var normalizeHanziAmPms = function (raw) {
  if (raw.match(eastAsianAms)) {
    raw = raw.replace(eastAsianAms, '');
    raw += 'am';
  }
  if (raw.match(eastAsianPms)) {
    raw = raw.replace(eastAsianPms, '');
    raw += 'pm';
  }
  return raw;
};

var calculateDiff = function (eventTime) {
  // Short (one hour or less) events show as "7:30am, <location>".
  // Sometimes these locations have numbers and throw off the diff.
  // Strip off those locations.
  eventTime = eventTime.replace(/,[\s\S]*/, '');
  var split = eventTime.split(dashesRegex);

  var startRaw = split[0];
  if (startRaw) {
    startRaw = startRaw.trim();
    startRaw = normalizeHanziAmPms(startRaw);
  }

  var endRaw = split[1];
  if (endRaw) {
    endRaw = endRaw.trim();
    endRaw = normalizeHanziAmPms(endRaw);
  }

  // New calendar omits am/pm on the start if both start and end are the same am/pm.
  if (!startRaw.match(/[a-z]/i) && endRaw.match(/pm$/i)) {
    startRaw += 'pm';
  }

  // Hanzi languages omits am/pm on the end if both start and end are the same am/pm.
  if (endRaw && !endRaw.match(/[a-z]/i) && startRaw.match(/pm$/i)) {
    endRaw += 'pm';
  }

  var start = moment(startRaw, 'h:ma');
  var end = moment(endRaw, 'h:ma');

  if (start > end) {
    // Assume it's an overnight event, and spanning no more than 24 hours.
    // Calendar events 24 hours or longer render in the top section, with the "All Day" events.
    end.add(24, 'hours');
  }

  return end.diff(start);
};

