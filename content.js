MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var minimumDurationMs = 60 * 60 * 1000;

chrome.storage.sync.get({
  minimumDuration: 61,
}, function (items) {
  minimumDurationMs = parseInt(items.minimumDuration, 10) * 60 * 1000;
});

var calculateDiff = function (eventTime) {
  // Short (one hour or less) events show as "7:30am, <location>".
  // Sometimes these locations have numbers and throw off the diff.
  // Strip off those locations.
  eventTime = eventTime.replace(/,[\s\S]*/, '');

  var split = eventTime.split(/[-–]/);

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

var formatDiff = function (diff) {
  var duration = moment.duration(diff);
  var hours = duration.hours() + 'h';
  var minutes = duration.minutes() > 0 ? duration.minutes() + 'm' : '';

  return hours + ' ' + minutes;
};

var annotateOldCalendarEvents = function (rootEl) {
  $(rootEl).find('.chip-caption').each(function () {
    var eventTimeElement = $(this.parentNode);
    var nextSibling = eventTimeElement.next();

    if (eventTimeElement.hasClass('event-duration')) {
      return;
    }

    if (nextSibling.hasClass('event-duration')) {
      nextSibling.remove();
    }

    var eventTime = this.innerText;
    var diff = calculateDiff(eventTime);

    if (diff >= minimumDurationMs) {
      var duration = formatDiff(diff);

      var durationElement = $('<dt class="event-duration"><span class="chip-caption">' + duration + '</span></dt>');

      durationElement.insertAfter(eventTimeElement);
    }
  });
}

var annotateNewCalendarEvents = function (rootEl) {
  $(rootEl.getElementsByClassName('Jmftzc gVNoLb  EiZ8Dd')).each(function () {
    var eventTimeElement = $(this);
    var nextSibling = eventTimeElement.next();

    var eventTime = this.innerText;
    var diff = calculateDiff(eventTime);

    if (diff >= minimumDurationMs) {
      var duration = formatDiff(diff);

      if (nextSibling.hasClass('event-duration')) {
        if (nextSibling[0].innerText === duration) {
          return;
        }

        nextSibling[0].innerText = duration;
      } else {
        var durationElement = eventTimeElement.clone()
          .addClass('event-duration')
          .text(duration);

        durationElement.insertAfter(eventTimeElement);
      }
    }
  });
};

var calendarVersion;

var injectDuration = function (mutation) {
  switch (calendarVersion) {
    case 'old':
      annotateOldCalendarEvents(mutation.target);
      break;

    case 'new':
      annotateNewCalendarEvents(mutation.target);
      break;
  }
};

var observer = new MutationObserver(function(mutations, observer) {
  mutations.forEach(function (mutation) {
    injectDuration(mutation);
  });
});

var maxCheckAttempts = 100;

var checkCalendarVersionInterval = setInterval(function () {
  switch (calendarVersion) {
    case 'old':
      console.log('Event Durations detected old Google Calendar.');
      observer.observe(document, {
        subtree: true,
        attributes: true,
      });
      clearInterval(checkCalendarVersionInterval);
      annotateOldCalendarEvents(document);
      break;

    case 'new':
      console.log('Event Durations detected new Google Calendar.');
      observer.observe(document, {
        subtree: true,
        childList: true,
      });
      clearInterval(checkCalendarVersionInterval);
      annotateNewCalendarEvents(document);
      break;

    default:
      if (maxCheckAttempts < 0) {
        console.error('Error determining calendar version, please contact eventdurations@gmail.com.');
        clearInterval(checkCalendarVersionInterval);
        return;
      }

      maxCheckAttempts--;

      var useNewCalendarButton = $('.goog-imageless-button-content:contains("Use new Calendar")');

      if (useNewCalendarButton.length > 0) {
        calendarVersion = 'old';
      } else {
        calendarVersion = 'new';
      }
      break;
  }
}, 100);

