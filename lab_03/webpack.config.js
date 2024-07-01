const path = require('path');
var config = {
    module: {},
};

var index = Object.assign({}, config, {
    entry: ['./src/js/defaultmain.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'index.js',
  }
});

var diagram = Object.assign({}, config,{
    entry: ['./src/js/diagram.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'diagram1.js',
  }
});

var step = Object.assign({}, config,{
    entry: ['./src/js/steps.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'step.js',
  }
});

var degree = Object.assign({}, config,{
    entry: ['./src/js/degree_research.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'degree.js',
  }
});





module.exports = [
  degree, index, step, diagram,
];