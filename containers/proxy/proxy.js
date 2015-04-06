var http = require('http');
var PngCrush = require('pngcrush');
var URL = require('url');
var stream = require('stream');

var settings = {
  bindPort: 80,
  PngCrush: ['-res', 300, '-rle']
};

http.createServer(function (req, res) {
  try {
    var url = URL.parse(req.url, true);

    if(url.pathname === "/chart") {
      var json = JSON.parse(JSON.stringify(url.query.json));

      http.request({
        host: 'phantomjs',
        path: req.url
      }, function(response) {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=600',
          });

          var bin = new Buffer(str, 'base64');
          var bufferStream = new stream.PassThrough();
          var crusher = new PngCrush(settings.PngCrush);
          bufferStream.push(bin);
          bufferStream.pipe(new PngCrush(['-res', 300, '-rle'])).pipe(res);
          bufferStream.end();
        });
      }).end();
    } else {
      res.writeHead(404);
      res.end();
    }
  } catch(e) {
    console.error(e);
    res.writeHead(500);
    res.end(e.message);
  }
}).listen(settings.bindPort);

