MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var handleEventDrag = function (mutation) {
  $(mutation.target).find('.chip-caption').each(function () {
    var eventTimeElement = $(this.parentNode);
    var nextSibling = eventTimeElement.next();

    if (!eventTimeElement.hasClass('event-duration') && !nextSibling.hasClass('event-duration')) {
      var durationElement = $('<dt class="event-duration"><span class="chip-caption">1 hr</span></dt>');

      durationElement.insertAfter(eventTimeElement);
    }
  });
};

var observer = new MutationObserver(function(mutations, observer) {
  mutations.forEach(function (mutation) {
    if (mutation.target.className.includes('cbrd')) {
      handleEventDrag(mutation);
    }
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true,
});
