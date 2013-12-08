var oldErrorFunc = window.console.error.bind(console);

window.console.error = function(object){
		console.log("new error type");
		oldErrorFunc(object);
};
