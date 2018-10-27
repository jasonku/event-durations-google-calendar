var intlDashes = Object.values({
  deutsch: 'bis',
  francais: 'à',
  portugues: 'até',
  japanese: '～',
}).join('|');
var dashesRegex = new RegExp('[-–]|' + intlDashes);

var japaneseAm = '午前';
var japanesePm = '午後';

var normalizeJapaneseAmPm = function (raw) {
  if (raw.includes(japaneseAm)) {
    raw = raw.replace(japaneseAm, '');
    raw += 'am';
  }
  if (raw.includes(japanesePm)) {
    raw = raw.replace(japanesePm, '');
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
    startRaw = normalizeJapaneseAmPm(startRaw);
  }

  var endRaw = split[1];
  if (endRaw) {
    endRaw = endRaw.trim();
    endRaw = normalizeJapaneseAmPm(endRaw);
  }

  // New calendar omits am/pm on the start if both start and end are the same am/pm.
  if (!startRaw.match(/[a-z]/i) && endRaw.endsWith('pm')) {
    startRaw += 'pm';
  }

  // Japanese omits am/pm on the end if both start and end are the same am/pm.
  if (endRaw && !endRaw.match(/[a-z]/i) && startRaw.endsWith('pm')) {
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

