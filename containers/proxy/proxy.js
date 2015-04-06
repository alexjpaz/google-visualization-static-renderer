var http = require('http');
var PngCrush = require('pngcrush');
var URL = require('url');
var stream = require('stream');


http.createServer(function (req, res) {
  try {
    var url = URL.parse(req.url, true);

    if(url.pathname === "/chart") {
      console.log('hi');
      var json = JSON.parse(JSON.stringify(url.query.json));

      http.request({
        //host: 'phantomjs',
        host: '192.168.59.104',
        port: 6666,
        path: req.url
      }, function(response) {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            //'Content-Length': bin.length,
            'Cache-Control': 'public, max-age=600',
          });

          var bin = new Buffer(str, 'base64');
          var bufferStream = new stream.PassThrough();
          var crusher = new PngCrush(['-res', 300, '-rle']);
          bufferStream.pipe(crusher).pipe(res);
          //bufferStream.pipe(res);
          bufferStream.push(bin);

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
}).listen(9999);

console.log('proxy');
