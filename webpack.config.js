const path = require('path');
var config = {
    module: {},
};

var index = Object.assign({}, config, {
    entry: ['./src/main.js', './src/geometrical_objects.js', './src/mover.js', './src/scaler.js', './src/rotator.js', './src/info-functions.js', './src/events.js', './src/stack.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    }
});


module.exports = [
  index
];