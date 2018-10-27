var intlDashes = Object.values({
  deutsch: 'bis',
  francais: 'à',
  portugues: 'até',
}).join('|');
var dashesRegex = new RegExp('[-–]|' + intlDashes);

var calculateDiff = function (eventTime) {
  // Short (one hour or less) events show as "7:30am, <location>".
  // Sometimes these locations have numbers and throw off the diff.
  // Strip off those locations.
  eventTime = eventTime.replace(/,[\s\S]*/, '');
  var split = eventTime.split(dashesRegex);

  var startRaw = split[0];
  if (startRaw) {
    startRaw = startRaw.trim();
  }
  var endRaw = split[1];
  if (endRaw) {
    endRaw = endRaw.trim();
  }

  // New calendar omits am/pm on the start if both start and end are the same am/pm.
  if (!startRaw.match(/[a-z]/i) && endRaw.endsWith('pm')) {
    startRaw += 'pm';
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

