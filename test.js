/**
 * Created by user1 on 10.12.16.
 */
var fs = require('fs');
var filename = 'readme.txt';


fs.stat(filename, function(err, info){
    console.log(info);
});
