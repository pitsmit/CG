const path = require('path');
var config = {
    module: {},
};

var index = Object.assign({}, config, {
    entry: ['./src/defaultmain.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'index.js',
  }
});

var diagram = Object.assign({}, config,{
    entry: ['./src/timer.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'timer.js',
  }
});

var degree = Object.assign({}, config,{
    entry: ['./src/degree_research.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'degree.js',
  }
});


module.exports = [
  degree, index, diagram,
];