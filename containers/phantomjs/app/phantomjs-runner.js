var webserver = require('webserver');
var webPage = require('webpage');
var system = require('system');

var settings = {
  pageUrl: system.args[1],
  outputPath: '/var/phantomjs/output.jpeg',
  outputFormat: {
    format: 'jpeg',
    quality: '100'
  },
  port: 80,
  requestTimeout: 3000
};

var page = (function createPage() {
  var p = webPage.create();
  return p;
})();

var ResponseHelper = function(response) {
  this.error = function(message, status) {
    status = status || 500;
    message = message || "Unknonw error occured";
    console.error(message, status);
    this.write(message, status);
  };

  this.json = function(data, status) {
    this.write(JSON.stringify(data), status);
  };

  this.write = function(rawData, status) {
    status = status || 200;
    response.write(rawData, status);
    response.statusCode = status;
    response.close();
  };
};

page.open(settings.pageUrl, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
    phantom.exit(1);
  }

  var phantomRunnerDefinition = page.evaluate(function() {
    return getPhantomRunnerDefinition();
  });

  console.log('Opened page', settings.pageUrl);
  console.log('phantomRunnerDefinition', JSON.stringify(phantomRunnerDefinition));

  var server = webserver.create();
  var service = server.listen(settings.port, function(request, response) {
    var responseHelper = new ResponseHelper(response);

    var timeoutId = null;
    var returnValue = null;

    timeoutId = setTimeout(function() {
      responseHelper.error('Request timed out', 408);
    }, settings.requestTimeout);

    try {
      page.onCallback = function(data) {
        var base64 = null;

        if(data.base64) {
          base64 = data.base64;
        }

        responseHelper.write(base64);
        clearTimeout(timeoutId);
        console.log('Callback fired');
      };

      returnValue = page.evaluate(function(request) {
        return execute(request);
      }, request);

      if(!!returnValue && !returnValue.async) {
        responseHelper.json(returnValue);
        clearTimeout(timeoutId);
      }

      if(!returnValue || returnValue.async) {
        console.log('Waiting for callback');
      }
    } catch(e) {
      responseHelper.error(e);
      clearTimeout(timeoutId);
    }
  });
  console.log('PhantomJs server instance is running.');
});

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};



