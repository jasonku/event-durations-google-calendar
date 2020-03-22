var formatDiff = function (diff) {
  var duration = moment.duration(diff);
  var hours = duration.hours() + 'h';
  var minutes = duration.minutes() > 0 ? duration.minutes() + 'm' : '';

  return hours + ' ' + minutes;
};
