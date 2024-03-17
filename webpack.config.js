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
    entry: ['./src/diagram.js', './src/algho_runner.js', './src/events.js', './src/info-functions.js', './src/Chart.min.js', './src/konva.min.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'diagram1.js',
  }
});

var step = Object.assign({}, config,{
    entry: ['./src/steps.js', './src/algho_runner.js', './src/events.js', './src/info-functions.js', './src/Chart.min.js', './src/konva.min.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'step.js',
  }
});

var degree = Object.assign({}, config,{
    entry: ['./src/degree_research.js', './src/algho_runner.js', './src/events.js', './src/info-functions.js', './src/geometrical_objects.js'],
    output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'degree.js',
  }
});


module.exports = [
  degree, index, diagram, step,
];