var intlDashes = Object.values({
  deutsch: 'bis',
  francais: 'à',
  portugues: 'até',
  japanese: '～',
}).join('|');
var dashesRegex = new RegExp('[-–]|' + intlDashes);

var hanziAms = new RegExp([
  '午前',
  '上午',
].join('|'));
var hanziPms = new RegExp([
  '午後',
  '下午',
].join('|'));

var normalizeHanziAmPms = function (raw) {
  if (raw.match(hanziAms)) {
    raw = raw.replace(hanziAms, '');
    raw += 'am';
  }
  if (raw.match(hanziPms)) {
    raw = raw.replace(hanziPms, '');
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

