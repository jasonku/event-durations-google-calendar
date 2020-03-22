function saveOptions() {
  var minimumDuration = document.getElementById('minimumDuration').value;
  var durationFormat = document.querySelector('input[name="durationFormat"]:checked').value;

  chrome.storage.sync.set({
    minimumDuration: minimumDuration,
    durationFormat: durationFormat,
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved, please refresh your calendar window.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    minimumDuration: 61,
    durationFormat: 'hourMinutes',
  }, function(items) {
    document.getElementById('minimumDuration').value = items.minimumDuration;
    document.getElementById(items.durationFormat).checked = true;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
