var replace = require('replace-in-file');
var timeStamp = new Date().toString();
var options = {
    files: [
        'src/environments/environment.ts',
        'src/environments/environment.prod.ts',
    ],
    from: /buildTimeStamp: '(.*)'/g,
    to: "buildTimeStamp: '" + timeStamp + "'",
    allowEmptyPaths: false
};

try {
    replace.sync(options);
    console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
    console.error('Error occurred: ', error);
    throw error
}