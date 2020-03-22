var formatDiff = function (diff, format) {
  var duration = moment.duration(diff);
  switch (format) {
    case 'decimalHours':
      var truncateTrailingZeroes = function (durationString) {
        return parseFloat(durationString).toString();
      }

      return truncateTrailingZeroes(duration.format('h', 2)) + ' hours';
    case 'hourMinutes':
    default:
      return duration.format('h[h] m[m]');
  }
};
