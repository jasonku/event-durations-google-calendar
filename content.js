MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var calculateDuration = function (eventTime) {
  var split = eventTime.split(' – ');
  var start = moment(split[0], 'h:ma');
  var end = moment(split[1], 'h:ma');

  var duration = moment.duration(end.diff(start));

  var hours = duration.hours() + 'h';
  var minutes = duration.minutes() > 0 ? duration.minutes() + 'm' : '';

  return hours + ' ' + minutes;
};

var injectDuration = function (mutation) {
  $(mutation.target).find('.chip-caption').each(function () {
    var eventTimeElement = $(this.parentNode);
    var nextSibling = eventTimeElement.next();

    if (eventTimeElement.hasClass('event-duration')) {
      return;
    }

    if (nextSibling.hasClass('event-duration')) {
      nextSibling.remove();
    }

    var eventTime = this.innerText;
    var duration = calculateDuration(eventTime);
    var durationElement = $('<dt class="event-duration"><span class="chip-caption">' + duration + '</span></dt>');

    durationElement.insertAfter(eventTimeElement);
  });
};

var observer = new MutationObserver(function(mutations, observer) {
  mutations.forEach(function (mutation) {
    injectDuration(mutation);
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true,
});
