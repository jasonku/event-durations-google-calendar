MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var minimumDurationMs = 60 * 60 * 1000;
var durationFormat = 'hourMinutes';

chrome.storage.sync.get({
  minimumDuration: 61,
  durationFormat: 'hourMinutes',
}, function (items) {
  minimumDurationMs = parseInt(items.minimumDuration, 10) * 60 * 1000;
  durationFormat = items.durationFormat;
});

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
      var duration = formatDiff(diff, durationFormat);

      var durationElement = $('<dt class="event-duration"><span class="chip-caption">' + duration + '</span></dt>');

      durationElement.insertAfter(eventTimeElement);
    }
  });
}

var annotateNewCalendarEvents = function (rootEl) {
  $(rootEl.getElementsByClassName('Jmftzc gVNoLb  EiZ8Dd')).each(function () {
    var eventTimeElement = $(this);
    var nextSibling = eventTimeElement.next();

    var eventMetadata = eventTimeElement.parent().parent().prev().text();
    var diff = calculateDiff(eventMetadata);

    if (diff >= minimumDurationMs) {
      var duration = formatDiff(diff, durationFormat);

      if (nextSibling.hasClass('event-duration')) {
        if (nextSibling[0].innerText === duration) {
          return;
        }

        nextSibling[0].innerText = duration;
      } else {
        var durationElement = eventTimeElement.clone()
          .addClass('event-duration')
          .removeClass('gVNoLb')
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

