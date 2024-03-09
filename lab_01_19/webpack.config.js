const path = require('path');
var config = {
    module: {},
};

var index = Object.assign({}, config, {
    entry: ['./src/main.js', './src/tables.js', './src/graphical_objects.js', './src/math.js', './src/file.js', './src/info-functions.js', './src/events.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    }
});


module.exports = [
  index
];