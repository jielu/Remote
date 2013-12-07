(function () {
  console.log("Application is instrumented by Reanimator.")
  var REPLAY_TOKEN = '?replay=';
  var query = location.search;
  var CAPTURE_TOKEN = '?capture';
  var hash = location.hash;
  var id = Date.now();
  var nativeSetInterval = setInterval;
  var idEl, log, len;

  if (query.indexOf(REPLAY_TOKEN) >= 0) {
    query = query.split(REPLAY_TOKEN);
    log = localStorage['reanimator-' + query[1]];
    len = log.length;

    setTimeout(function () {
      var el = document.createElement('p');
      el.innerHTML =
        'Replaying log ' + id + ' (' + (len / 1024).toFixed(2) + 'KB)';
      document.querySelector('#info').appendChild(el);
    }, 500);

    console.log(JSON.parse(log));
    Reanimator.replay(JSON.parse(log), {
      delay: 'realtime'
    });
  } else if (query.indexOf(CAPTURE_TOKEN) >= 0) {
    query = query.split(CAPTURE_TOKEN);
    location.query = query[0];
    console.log(id);
    nativeSetInterval.call(window, function () {
      if (!idEl) {
        idEl = document.createElement('p');
        idEl.innerHTML =
          '<a href="game.html?capture=' + id + '">' + 'Reanimator ID: ' + id + '<\/a>';
        document.querySelector('#info').appendChild(idEl);
      }
      localStorage['reanimator-' + id] = JSON.stringify(Reanimator.flush());

      // Send update recording request to server
//      $.ajax({
//    	  url: "http://localhost:8080/RemoteDebuggingServer/RecordingUpdaterServlet",
//    	  type: 'GET',
//    	  dataType: 'json',
//    	  data: {targetMachine: "127.0.0.1", logId: id, withException:false, codeVersion: "1.0.0.0"},
//    	  contentType: 'application/json',
//    	  mimeType: 'application/json',
//    	  
//    	  success: function(data){
//    		  console.log("Update recording successfully!");
//    	  }
//    	  
//      });
      $.get("http://localhost:8080/RemoteDebuggingServer/RecordingUpdaterServlet", {targetMachine: "127.0.0.1", logId: id, withException:false, codeVersion: "1.0.0.0"});


    }, 500);

    localStorage.clear();
    Reanimator.capture();
  }
  }());

