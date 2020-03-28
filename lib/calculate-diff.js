var commasRegex = /[,，、]/;

// Separates the day and time for multi-day events
var dayTimeSeparators = new RegExp(Object.values({
  english: ' at ',
  bahasaIndonesian: ' pukul ',
  catala: ' a les ',
}).join('|'));

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

var isolateTime = function (raw) {
  // Annoyingly, some language settings use commas, some use words, and some
  // use BOTH to separate the day and time.
  // See calculate-diff-spec.js for examples.
  //
  // First try non-comma separators, then try comma as a separator.

  // For all supported languages, the time comes after the date.
  var time = raw.split(dayTimeSeparators)[1];

  if (!time) {
    time = raw.split(',')[1];
  }

  if (time) {
    return time.trim();
  } else {
    // A single-day event that parsed correctly, didn't need the time isolated.
    return raw;
  }
}

// In certain language settings, it is ambiguous whether a separator is
// separating a day/time in a datetime, or separating the two datetimes in an
// event. Example: catala
//
// For these, need to look for a token to explicitly identify whether it's
// multiday or single day.
var multiDayTokens = new RegExp(Object.values({
  catala: ' al dia ',
}).join('|'));

var calculateDiff = function (eventMetadata) {
  var startEndSeparators = {
    english: ' to ',
    dansk: ' til ',
    deutsch: ' bis ',
    francais: ' à ',
    japanese: '～',
    chinese: '至',
    korean: '~',
    bahasaIndonesian: ' sampai ',
    filipino: ' hanggang ',
    portguesPortugal: ' às ',
    svenska: ' till ',
  };

  eventTime = eventMetadata.split(commasRegex)[0];

  if (multiDayTokens.test(eventTime)) {
    // Multi-day detected
    startEndSeparators.catala = ' al dia ';
  } else {
    // Single-day detected
    Object.assign(startEndSeparators, {
      espanol: ' a ',
      catala: ' a les ',
    });
  }

  var startEndRegex = new RegExp('[-–]|' + Object.values(startEndSeparators).join('|'));

  var split = eventTime.split(startEndRegex);

  var startRaw = split[0];
  if (startRaw) {
    startRaw = startRaw.trim();
    startRaw = isolateTime(startRaw);
    startRaw = normalizeHanziAmPms(startRaw);
  }

  var endRaw = split[1];
  if (endRaw) {
    endRaw = endRaw.trim();
    endRaw = isolateTime(endRaw);
    endRaw = normalizeHanziAmPms(endRaw);
  } else {
    // If we didn't get an endRaw, we're probably dealing with a multi-day
    // event because the metadata could have dates with commas that break the
    // split.
    //
    // Need to re-parse the event metadata.
    eventTime = eventMetadata.split(commasRegex).slice(0, 3).join();
    split = eventTime.split(startEndRegex);

    startRaw = split[0];
    if (startRaw) {
      startRaw = isolateTime(startRaw);
      startRaw = normalizeHanziAmPms(startRaw);
    }

    endRaw = split[1];
    if (endRaw) {
      endRaw = isolateTime(endRaw);
      endRaw = normalizeHanziAmPms(endRaw);
    }
  }

  // New calendar omits am/pm on the start if both start and end are the same am/pm.
  if (!startRaw.match(/[a-z]/i)) {
    if (endRaw.match(/pm$/i)) {
      startRaw += 'pm';
    } else if (endRaw.match(/am$/i)) {
      startRaw += 'am';
    }
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

