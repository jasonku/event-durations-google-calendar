function saveOptions() {
  var minimumDuration = document.getElementById('minimumDuration').value;
  chrome.storage.sync.set({
    minimumDuration: minimumDuration,
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved!';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    minimumDuration: 1
  }, function(items) {
    document.getElementById('minimumDuration').value = items.minimumDuration;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
