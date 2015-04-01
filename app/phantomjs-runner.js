var webserver = require('webserver');
var webPage = require('webpage');
var system = require('system');


var settings = {
  pageUrl: system.args[1],
  outputPath: '/var/phantomjs/output.jpeg',
  outputFormat: {
    format: 'jpeg',
    quality: '100'
  }
};

var page = webPage.create();
page.open(settings.pageUrl);
console.log('Opened page', settings.pageUrl);

var server = webserver.create();
var service = server.listen(8080, function(request, response) {
  try {
    var returnValue = null;

    page.onCallback = function(data) {
      response.write(JSON.stringify(data));
      response.statusCode = 200;
      response.close();
    };

    returnValue = page.evaluate(function(request) {
      return execute(request);
    }, request);

    if(!!returnValue && !returnValue.async) {
      response.statusCode = 200;
      response.write(JSON.stringify(returnValue));
      response.close();
    }

  } catch(e) {
    response.write('ERROR: ' + e.message);
    response.statusCode = 500;
    response.close();
  }
});
console.log('PhantomJs Instance is up...');
