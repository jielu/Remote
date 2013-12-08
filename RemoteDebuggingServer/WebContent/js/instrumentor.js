var updateServletUrl = 'http://localhost:8080/RemoteDebuggingServer/RecordingUpdaterServlet';
var codeVersion = '1.0.0.0';

// Use a mocked ip address here, because we'd like to get the real client ip in servlet
var ipAddress = '127.0.0.1';

// Capture unhandled exceptions. And only send updates to server if with exceptions
var withException = false;

// Override window.onerror function to get unhandled exceptions
var oldOnError = window.onerror;
window.onerror = function(message, url, line){
	withException = true;
	
	if(oldOnError){
		return oldOnError(message, url, line);
	}
	
	return false;
};

// Override console.error function to get errors
var oldErrorFunc = window.console.error.bind(console);

window.console.error = function(object){
	withException = true;
	oldErrorFunc(object);
};


(function () {
  console.log("# Application is instrumented by Reanimator.");
  var REPLAY_TOKEN = '?replay=';
  var query = location.search;
  var id = Date.now();
  var nativeSetInterval = setInterval;

  if (query.indexOf(REPLAY_TOKEN) >= 0) {
    query = query.split(REPLAY_TOKEN);
    log = localStorage['reanimator-' + query[1]];
    len = log.length;
    
    console.log("# Replay log length: " + (len / 1024).toFixed(2) + "KB");
    
    Reanimator.replay(JSON.parse(log), {
      delay: 'realtime'
    });
  } else{
	console.log("# Start capturing log with id: " + id);
    nativeSetInterval.call(window, function () {
      // Save captured log to local storage every 0.5 seconds
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
    }, 500);
    
    nativeSetInterval.call(window, function(){
        // Send record update to server every 5 seconds. Only update if with exceptions.
    	console.log("# With exception: " + withException);
    	$.get(updateServletUrl, {targetMachine: ipAddress, logId: id, withException:false, codeVersion: codeVersion});

    }, 5000);

    localStorage.clear();
    Reanimator.capture();
  }
  }());

