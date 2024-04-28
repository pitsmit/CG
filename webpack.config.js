const path = require('path');
var config = {
    module: {},
};

var index = Object.assign({}, config, {
    entry: ['./src/js/index.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'index.js',
  }
});


module.exports = [
  index, 
];