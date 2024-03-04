// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
export var Module = typeof Module != 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary;

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  var nodeVersion = process.versions.node;
  var numericVersion = nodeVersion.split('.').slice(0, 3);
  numericVersion = (numericVersion[0] * 10000) + (numericVersion[1] * 100) + (numericVersion[2].split('-')[0] * 1);
  var minVersion = 160000;
  if (numericVersion < 160000) {
    throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
  }

  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js
read_ = (filename, binary) => {
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return fs.readFileSync(filename, binary ? undefined : 'utf8');
};

readBinary = (filename) => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, onload, onerror, binary = true) => {
  // See the comment in the `read_` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
    if (err) onerror(err);
    else onload(binary ? data.buffer : data);
  });
};
// end include: node_shell_read.js
  if (!Module['thisProgram'] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  if (typeof module != 'undefined') {
    module['exports'] = Module;
  }

  process.on('uncaughtException', (ex) => {
    // suppress ExitStatus exceptions from showing an error
    if (ex !== 'unwind' && !(ex instanceof ExitStatus) && !(ex.context instanceof ExitStatus)) {
      throw ex;
    }
  });

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  if (typeof read != 'undefined') {
    read_ = read;
  }

  readBinary = (f) => {
    if (typeof readbuffer == 'function') {
      return new Uint8Array(readbuffer(f));
    }
    let data = read(f, 'binary');
    assert(typeof data == 'object');
    return data;
  };

  readAsync = (f, onload, onerror) => {
    setTimeout(() => onload(readBinary(f)));
  };

  if (typeof clearTimeout == 'undefined') {
    globalThis.clearTimeout = (id) => {};
  }

  if (typeof setTimeout == 'undefined') {
    // spidermonkey lacks setTimeout but we use it above in readAsync.
    globalThis.setTimeout = (f) => (typeof f == 'function') ? f() : abort();
  }

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit == 'function') {
    quit_ = (status, toThrow) => {
      // Unlike node which has process.exitCode, d8 has no such mechanism. So we
      // have no way to set the exit code and then let the program exit with
      // that code when it naturally stops running (say, when all setTimeouts
      // have completed). For that reason, we must call `quit` - the only way to
      // set the exit code - but quit also halts immediately.  To increase
      // consistency with node (and the web) we schedule the actual quit call
      // using a setTimeout to give the current stack and any exception handlers
      // a chance to run.  This enables features such as addOnPostRun (which
      // expected to be able to run code after main returns).
      setTimeout(() => {
        if (!(toThrow instanceof ExitStatus)) {
          let toLog = toThrow;
          if (toThrow && typeof toThrow == 'object' && toThrow.stack) {
            toLog = [toThrow, toThrow.stack];
          }
          err(`exiting due to exception: ${toLog}`);
        }
        quit(status);
      });
      throw toThrow;
    };
  }

  if (typeof print != 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console == 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != 'undefined' ? printErr : print);
  }

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith('blob:')) {
    scriptDirectory = '';
  } else {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/')+1);
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js
read_ = (url) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

if (Module['quit']) quit_ = Module['quit'];legacyModuleProp('quit', 'quit_');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('read', 'read_');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');


// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary; 
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

// include: wasm2js.js
// wasm2js.js - enough of a polyfill for the WebAssembly object so that we can load
// wasm2js code that way.

// Emit "var WebAssembly" if definitely using wasm2js. Otherwise, in MAYBE_WASM2JS
// mode, we can't use a "var" since it would prevent normal wasm from working.
/** @suppress{duplicate, const} */
var
WebAssembly = {
  // Note that we do not use closure quoting (this['buffer'], etc.) on these
  // functions, as they are just meant for internal use. In other words, this is
  // not a fully general polyfill.
  /** @constructor */
  Memory: function(opts) {
    this.buffer = new ArrayBuffer(opts['initial'] * 65536);
  },

  Module: function(binary) {
    // TODO: use the binary and info somehow - right now the wasm2js output is embedded in
    // the main JS
  },

  /** @constructor */
  Instance: function(module, info) {
    // TODO: use the module somehow - right now the wasm2js output is embedded in
    // the main JS
    // This will be replaced by the actual wasm2js code.
    this.exports = (
function instantiate(info) {
function Table(ret) {
  // grow method not included; table is not growable
  ret.set = function(i, func) {
    this[i] = func;
  };
  ret.get = function(i) {
    return this[i];
  };
  return ret;
}

  var bufferView;
  var base64ReverseLookup = new Uint8Array(123/*'z'+1*/);
  for (var i = 25; i >= 0; --i) {
    base64ReverseLookup[48+i] = 52+i; // '0-9'
    base64ReverseLookup[65+i] = i; // 'A-Z'
    base64ReverseLookup[97+i] = 26+i; // 'a-z'
  }
  base64ReverseLookup[43] = 62; // '+'
  base64ReverseLookup[47] = 63; // '/'
  /** @noinline Inlining this function would mean expanding the base64 string 4x times in the source code, which Closure seems to be happy to do. */
  function base64DecodeToExistingUint8Array(uint8Array, offset, b64) {
    var b1, b2, i = 0, j = offset, bLength = b64.length, end = offset + (bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '=');
    for (; i < bLength; i += 4) {
      b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
      uint8Array[j++] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      if (j < end) uint8Array[j++] = b1 << 4 | b2 >> 2;
      if (j < end) uint8Array[j++] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
    }
  }
function initActiveSegments(imports) {
  base64DecodeToExistingUint8Array(bufferView, 65536, "AwAAAAQAAAAEAAAABgAAAIP5ogBETm4A/CkVANFXJwDdNPUAYtvAADyZlQBBkEMAY1H+ALveqwC3YcUAOm4kANJNQgBJBuAACeouAByS0QDrHf4AKbEcAOg+pwD1NYIARLsuAJzphAC0JnAAQX5fANaROQBTgzkAnPQ5AItfhAAo+b0A+B87AN7/lwAPmAUAES/vAApaiwBtH20Az342AAnLJwBGT7cAnmY/AC3qXwC6J3UA5evHAD178QD3OQcAklKKAPtr6gAfsV8ACF2NADADVgB7/EYA8KtrACC8zwA29JoA46kdAF5hkQAIG+YAhZllAKAUXwCNQGgAgNj/ACdzTQAGBjEAylYVAMmocwB74mAAa4zAABnERwDNZ8MACejcAFmDKgCLdsQAphyWAESv3QAZV9EApT4FAAUH/wAzfj8AwjLoAJhP3gC7fTIAJj3DAB5r7wCf+F4ANR86AH/yygDxhx0AfJAhAGokfADVbvoAMC13ABU7QwC1FMYAwxmdAK3EwgAsTUEADABdAIZ9RgDjcS0Am8aaADNiAAC00nwAtKeXADdV1QDXPvYAoxAYAE12/ABknSoAcNerAGN8+AB6sFcAFxXnAMBJVgA71tkAp4Q4ACQjywDWincAWlQjAAAfuQDxChsAGc7fAJ8x/wBmHmoAmVdhAKz7RwB+f9gAImW3ADLoiQDmv2AA78TNAGw2CQBdP9QAFt7XAFg73gDem5IA0iIoACiG6ADiWE0AxsoyAAjjFgDgfcsAF8BQAPMdpwAY4FsALhM0AIMSYgCDSAEA9Y5bAK2wfwAe6fIASEpDABBn0wCq3dgArl9CAGphzgAKKKQA05m0AAam8gBcd38Ao8KDAGE8iACKc3gAr4xaAG/XvQAtpmMA9L/LAI2B7wAmwWcAVcpFAMrZNgAoqNIAwmGNABLJdwAEJhQAEkabAMRZxADIxUQATbKRAAAX8wDUQ60AKUnlAP3VEAAAvvwAHpTMAHDO7gATPvUA7PGAALPnwwDH+CgAkwWUAMFxPgAuCbMAC0XzAIgSnACrIHsALrWfAEeSwgB7Mi8ADFVtAHKnkABr5x8AMcuWAHkWSgBBeeIA9N+JAOiUlwDi5oQAmTGXAIjtawBfXzYAu/0OAEiatABnpGwAcXJCAI1dMgCfFbgAvOUJAI0xJQD3dDkAMAUcAA0MAQBLCGgALO5YAEeqkAB05wIAvdYkAPd9pgBuSHIAnxbvAI6UpgC0kfYA0VNRAM8K8gAgmDMA9Ut+ALJjaADdPl8AQF0DAIWJfwBVUikAN2TAAG3YEAAySDIAW0x1AE5x1ABFVG4ACwnBACr1aQAUZtUAJwedAF0EUAC0O9sA6nbFAIf5FwBJa30AHSe6AJZpKQDGzKwArRRUAJDiagCI2YkALHJQAASkvgB3B5QA8zBwAAD8JwDqcagAZsJJAGTgPQCX3YMAoz+XAEOU/QANhowAMUHeAJI5nQDdcIwAF7fnAAjfOwAVNysAXICgAFqAkwAQEZIAD+jYAGyArwDb/0sAOJAPAFkYdgBipRUAYcu7AMeJuQAQQL0A0vIEAEl1JwDrtvYA2yK7AAoUqgCJJi8AZIN2AAk7MwAOlBoAUTqqAB2jwgCv7a4AXCYSAG3CTQAtepwAwFaXAAM/gwAJ8PYAK0CMAG0xmQA5tAcADCAVANjDWwD1ksQAxq1LAE7KpQCnN80A5qk2AKuSlADdQmgAGWPeAHaM7wBoi1IA/Ns3AK6hqwDfFTEAAK6hAAz72gBkTWYA7QW3ACllMABXVr8AR/86AGr5uQB1vvMAKJPfAKuAMABmjPYABMsVAPoiBgDZ5B0APbOkAFcbjwA2zQkATkLpABO+pAAzI7UA8KoaAE9lqADSwaUACz8PAFt4zQAj+XYAe4sEAIkXcgDGplMAb27iAO/rAACbSlgAxNq3AKpmugB2z88A0QIdALHxLQCMmcEAw613AIZI2gD3XaAAxoD0AKzwLwDd7JoAP1y8ANDebQCQxx8AKtu2AKMlOgAAr5oArVOTALZXBAApLbQAS4B+ANoHpwB2qg4Ae1mhABYSKgDcty0A+uX9AInb/gCJvv0A5HZsAAap/AA+gHAAhW4VAP2H/wAoPgcAYWczACoYhgBNveoAs+evAI9tbgCVZzkAMb9bAITXSAAw3xYAxy1DACVhNQDJcM4AMMu4AL9s/QCkAKIABWzkAFrdoAAhb0cAYhLSALlchABwYUkAa1bgAJlSAQBQVTcAHtW3ADPxxAATbl8AXTDkAIUuqQAdssMAoTI2AAi3pADqsdQAFvchAI9p5AAn/3cADAOAAI1ALQBPzaAAIKWZALOi0wAvXQoAtPlCABHaywB9vtAAm9vBAKsXvQDKooEACGpcAC5VFwAnAFUAfxTwAOEHhgAUC2QAlkGNAIe+3gDa/SoAayW2AHuJNAAF8/4Aub+eAGhqTwBKKqgAT8RaAC34vADXWpgA9MeVAA1NjQAgOqYApFdfABQ/sQCAOJUAzCABAHHdhgDJ3rYAv2D1AE1lEQABB2sAjLCsALLA0ABRVUgAHvsOAJVywwCjBjsAwEA1AAbcewDgRcwATin6ANbKyADo80EAfGTeAJtk2ADZvjEApJfDAHdY1ABp48UA8NoTALo6PABGGEYAVXVfANK99QBuksYArC5dAA5E7QAcPkIAYcSHACn96QDn1vMAInzKAG+RNQAI4MUA/9eNAG5q4gCw/cYAkwjBAHxddABrrbIAzW6dAD5yewDGEWoA98+pAClz3wC1yboAtwBRAOKyDQB0uiQA5X1gAHTYigANFSwAgRgMAH5mlAABKRYAn3p2AP39vgBWRe8A2X42AOzZEwCLurkAxJf8ADGoJwDxbsMAlMU2ANioVgC0qLUAz8wOABKJLQBvVzQALFaJAJnO4wDWILkAa16qAD4qnAARX8wA/QtKAOH0+wCOO20A4oYsAOnUhAD8tKkA7+7RAC41yQAvOWEAOCFEABvZyACB/AoA+0pqAC8c2ABTtIQATpmMAFQizAAqVdwAwMbWAAsZlgAacLgAaZVkACZaYAA/Uu4AfxEPAPS1EQD8y/UANLwtADS87gDoXcwA3V5gAGeOmwCSM+8AyRe4AGFYmwDhV7wAUYPGANg+EADdcUgALRzdAK8YoQAhLEYAWfPXANl6mACeVMAAT4b6AFYG/ADlea4AiSI2ADitIgBnk9wAVeiqAIImOADK55sAUQ2kAJkzsQCp1w4AaQVIAGWy8AB/iKcAiEyXAPnRNgAhkrMAe4JKAJjPIQBAn9wA3EdVAOF0OgBn60IA/p3fAF7UXwB7Z6QAuqx6AFX2ogAriCMAQbpVAFluCAAhKoYAOUeDAInj5gDlntQASftAAP9W6QAcD8oAxVmKAJT6KwDTwcUAD8XPANtargBHxYYAhUNiACGGOwAseZQAEGGHACpMewCALBoAQ78SAIgmkAB4PIkAqMTkAOXbewDEOsIAJvTqAPdnigANkr8AZaMrAD2TsQC9fAsApFHcACfdYwBp4d0AmpQZAKgplQBozigACe20AESfIABOmMoAcIJjAH58IwAPuTIAp/WOABRW5wAh8QgAtZ0qAG9+TQClGVEAtfmrAILf1gCW3WEAFjYCAMQ6nwCDoqEAcu1tADmNegCCuKkAazJcAEYnWwAANO0A0gB3APz0VQABWU0A4HGAAAAAAAAAAAAAAAAAQPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNQ==");
}

  var scratchBuffer = new ArrayBuffer(16);
  var i32ScratchView = new Int32Array(scratchBuffer);
  var f32ScratchView = new Float32Array(scratchBuffer);
  var f64ScratchView = new Float64Array(scratchBuffer);
  
  function wasm2js_scratch_load_i32(index) {
    return i32ScratchView[index];
  }
      
  function wasm2js_scratch_store_i32(index, value) {
    i32ScratchView[index] = value;
  }
      
  function wasm2js_scratch_load_f64() {
    return f64ScratchView[0];
  }
      
  function wasm2js_scratch_store_f64(value) {
    f64ScratchView[0] = value;
  }
      
function asmFunc(imports) {
 var buffer = new ArrayBuffer(16777216);
 var HEAP8 = new Int8Array(buffer);
 var HEAP16 = new Int16Array(buffer);
 var HEAP32 = new Int32Array(buffer);
 var HEAPU8 = new Uint8Array(buffer);
 var HEAPU16 = new Uint16Array(buffer);
 var HEAPU32 = new Uint32Array(buffer);
 var HEAPF32 = new Float32Array(buffer);
 var HEAPF64 = new Float64Array(buffer);
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 var global$0 = 65536;
 var global$2 = 0;
 var global$3 = 0;
 var i64toi32_i32$HIGH_BITS = 0;
 // EMSCRIPTEN_START_FUNCS
;
 function $0() {
  $16();
 }
 
 function $1($0_1, $1_1) {
  $0_1 = Math_fround($0_1);
  $1_1 = Math_fround($1_1);
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAPF32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAPF32[($4_1 + 8 | 0) >> 2] = $1_1;
  return Math_fround(Math_fround(Math_fround(HEAPF32[($4_1 + 12 | 0) >> 2]) + Math_fround(HEAPF32[($4_1 + 8 | 0) >> 2])));
 }
 
 function $2($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = Math_fround($0_1);
  $1_1 = Math_fround($1_1);
  $2_1 = Math_fround($2_1);
  $3_1 = Math_fround($3_1);
  $4_1 = Math_fround($4_1);
  var $7_1 = 0, $10_1 = Math_fround(0), $24_1 = 0.0, $27_1 = 0.0, $17_1 = Math_fround(0);
  $7_1 = global$0 - 32 | 0;
  global$0 = $7_1;
  HEAPF32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAPF32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAPF32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAPF32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAPF32[($7_1 + 12 | 0) >> 2] = $4_1;
  $10_1 = Math_fround(HEAPF32[($7_1 + 28 | 0) >> 2]);
  $24_1 = +Math_fround(HEAPF32[($7_1 + 20 | 0) >> 2]) * 3.141592653589793 / 180.0;
  $27_1 = +Math_fround(Math_fround(HEAPF32[($7_1 + 24 | 0) >> 2]) - $10_1) * +$10(+$24_1) + +$10_1;
  $17_1 = Math_fround(+Math_fround(Math_fround(HEAPF32[($7_1 + 12 | 0) >> 2]) - Math_fround(HEAPF32[($7_1 + 16 | 0) >> 2])) * +$13(+$24_1) + $27_1);
  global$0 = $7_1 + 32 | 0;
  return Math_fround($17_1);
 }
 
 function $3($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = Math_fround($0_1);
  $1_1 = Math_fround($1_1);
  $2_1 = Math_fround($2_1);
  $3_1 = Math_fround($3_1);
  $4_1 = Math_fround($4_1);
  var $7_1 = 0, $10_1 = Math_fround(0), $24_1 = 0.0, $27_1 = 0.0, $17_1 = Math_fround(0);
  $7_1 = global$0 - 32 | 0;
  global$0 = $7_1;
  HEAPF32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAPF32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAPF32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAPF32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAPF32[($7_1 + 12 | 0) >> 2] = $4_1;
  $10_1 = Math_fround(HEAPF32[($7_1 + 16 | 0) >> 2]);
  $24_1 = +Math_fround(HEAPF32[($7_1 + 20 | 0) >> 2]) * 3.141592653589793 / 180.0;
  $27_1 = +$10_1 - +Math_fround(Math_fround(HEAPF32[($7_1 + 24 | 0) >> 2]) - Math_fround(HEAPF32[($7_1 + 28 | 0) >> 2])) * +$13(+$24_1);
  $17_1 = Math_fround(+Math_fround(Math_fround(HEAPF32[($7_1 + 12 | 0) >> 2]) - $10_1) * +$10(+$24_1) + $27_1);
  global$0 = $7_1 + 32 | 0;
  return Math_fround($17_1);
 }
 
 function $4($0_1, $1_1, $2_1, $3_1) {
  $0_1 = Math_fround($0_1);
  $1_1 = Math_fround($1_1);
  $2_1 = Math_fround($2_1);
  $3_1 = Math_fround($3_1);
  var $6_1 = 0;
  $6_1 = global$0 - 16 | 0;
  HEAPF32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAPF32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAPF32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAPF32[$6_1 >> 2] = $3_1;
  return Math_fround(Math_fround(Math_fround(Math_fround(HEAPF32[($6_1 + 12 | 0) >> 2]) * Math_fround(Math_fround(HEAPF32[($6_1 + 8 | 0) >> 2]) - Math_fround(Math_fround(HEAPF32[$6_1 >> 2]) / Math_fround(2.0)))) + Math_fround(Math_fround(HEAPF32[($6_1 + 4 | 0) >> 2]) * Math_fround(Math_fround(1.0) - Math_fround(HEAPF32[($6_1 + 12 | 0) >> 2])))));
 }
 
 function $5($0_1, $1_1, $2_1, $3_1) {
  $0_1 = Math_fround($0_1);
  $1_1 = Math_fround($1_1);
  $2_1 = Math_fround($2_1);
  $3_1 = Math_fround($3_1);
  var $6_1 = 0;
  $6_1 = global$0 - 16 | 0;
  HEAPF32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAPF32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAPF32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAPF32[$6_1 >> 2] = $3_1;
  return Math_fround(Math_fround(Math_fround(Math_fround(HEAPF32[($6_1 + 12 | 0) >> 2]) * Math_fround(Math_fround(Math_fround(HEAPF32[$6_1 >> 2]) / Math_fround(2.0)) - Math_fround(HEAPF32[($6_1 + 8 | 0) >> 2]))) + Math_fround(Math_fround(HEAPF32[($6_1 + 4 | 0) >> 2]) * Math_fround(Math_fround(1.0) - Math_fround(HEAPF32[($6_1 + 12 | 0) >> 2])))));
 }
 
 function $6($0_1, $1_1) {
  $0_1 = +$0_1;
  $1_1 = +$1_1;
  var $2_1 = 0.0, $3_1 = 0.0, $4_1 = 0.0, $16_1 = 0.0;
  $2_1 = $0_1 * $0_1;
  $3_1 = $2_1 * .5;
  $4_1 = 1.0 - $3_1;
  $16_1 = 1.0 - $4_1 - $3_1;
  $3_1 = $2_1 * $2_1;
  return +($4_1 + ($16_1 + ($2_1 * ($2_1 * ($2_1 * ($2_1 * 2.480158728947673e-05 + -.001388888888887411) + .0416666666666666) + $3_1 * $3_1 * ($2_1 * ($2_1 * -1.1359647557788195e-11 + 2.087572321298175e-09) + -2.7557314351390663e-07)) - $0_1 * $1_1)));
 }
 
 function $7($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $21_1 = 0.0, $11_1 = 0, $6_1 = 0, $5_1 = 0, $22_1 = 0.0, $13_1 = 0, $8_1 = 0, $9_1 = 0, $20_1 = 0, $10_1 = 0, $14 = 0, $18_1 = 0, $12_1 = 0, $23_1 = 0.0, $7_1 = 0, $16_1 = 0, $19_1 = 0, $15 = 0, $17_1 = 0, $205 = 0, $208 = 0, $520 = 0.0, $558 = 0.0;
  $5_1 = global$0 - 560 | 0;
  global$0 = $5_1;
  $6_1 = ($2_1 + -3 | 0 | 0) / (24 | 0) | 0;
  $7_1 = ($6_1 | 0) > (0 | 0) ? $6_1 : 0;
  $8_1 = Math_imul($7_1, -24) + $2_1 | 0;
  label$1 : {
   $9_1 = HEAP32[(($4_1 << 2 | 0) + 65536 | 0) >> 2] | 0;
   $10_1 = $3_1 + -1 | 0;
   if (($9_1 + $10_1 | 0 | 0) < (0 | 0)) {
    break label$1
   }
   $11_1 = $9_1 + $3_1 | 0;
   $2_1 = $7_1 - $10_1 | 0;
   $6_1 = 0;
   label$2 : while (1) {
    label$3 : {
     label$4 : {
      if (($2_1 | 0) >= (0 | 0)) {
       break label$4
      }
      $21_1 = 0.0;
      break label$3;
     }
     $21_1 = +(HEAP32[(($2_1 << 2 | 0) + 65552 | 0) >> 2] | 0 | 0);
    }
    HEAPF64[(($5_1 + 320 | 0) + ($6_1 << 3 | 0) | 0) >> 3] = $21_1;
    $2_1 = $2_1 + 1 | 0;
    $6_1 = $6_1 + 1 | 0;
    if (($6_1 | 0) != ($11_1 | 0)) {
     continue label$2
    }
    break label$2;
   };
  }
  $12_1 = $8_1 + -24 | 0;
  $11_1 = 0;
  $13_1 = ($9_1 | 0) > (0 | 0) ? $9_1 : 0;
  $14 = ($3_1 | 0) < (1 | 0);
  label$5 : while (1) {
   label$6 : {
    label$7 : {
     if (!$14) {
      break label$7
     }
     $21_1 = 0.0;
     break label$6;
    }
    $6_1 = $11_1 + $10_1 | 0;
    $2_1 = 0;
    $21_1 = 0.0;
    label$8 : while (1) {
     $21_1 = +HEAPF64[($0_1 + ($2_1 << 3 | 0) | 0) >> 3] * +HEAPF64[(($5_1 + 320 | 0) + (($6_1 - $2_1 | 0) << 3 | 0) | 0) >> 3] + $21_1;
     $2_1 = $2_1 + 1 | 0;
     if (($2_1 | 0) != ($3_1 | 0)) {
      continue label$8
     }
     break label$8;
    };
   }
   HEAPF64[($5_1 + ($11_1 << 3 | 0) | 0) >> 3] = $21_1;
   $2_1 = ($11_1 | 0) == ($13_1 | 0);
   $11_1 = $11_1 + 1 | 0;
   if (!$2_1) {
    continue label$5
   }
   break label$5;
  };
  $15 = 47 - $8_1 | 0;
  $16_1 = 48 - $8_1 | 0;
  $17_1 = $8_1 + -25 | 0;
  $11_1 = $9_1;
  label$9 : {
   label$10 : while (1) {
    $21_1 = +HEAPF64[($5_1 + ($11_1 << 3 | 0) | 0) >> 3];
    $2_1 = 0;
    $6_1 = $11_1;
    label$11 : {
     $10_1 = ($11_1 | 0) < (1 | 0);
     if ($10_1) {
      break label$11
     }
     label$12 : while (1) {
      label$13 : {
       label$14 : {
        $22_1 = $21_1 * 5.9604644775390625e-08;
        if (!(Math_abs($22_1) < 2147483648.0)) {
         break label$14
        }
        $13_1 = ~~$22_1;
        break label$13;
       }
       $13_1 = -2147483648;
      }
      $14 = ($5_1 + 480 | 0) + ($2_1 << 2 | 0) | 0;
      label$15 : {
       label$16 : {
        $22_1 = +($13_1 | 0);
        $21_1 = $22_1 * -16777216.0 + $21_1;
        if (!(Math_abs($21_1) < 2147483648.0)) {
         break label$16
        }
        $13_1 = ~~$21_1;
        break label$15;
       }
       $13_1 = -2147483648;
      }
      HEAP32[$14 >> 2] = $13_1;
      $6_1 = $6_1 + -1 | 0;
      $21_1 = +HEAPF64[($5_1 + ($6_1 << 3 | 0) | 0) >> 3] + $22_1;
      $2_1 = $2_1 + 1 | 0;
      if (($2_1 | 0) != ($11_1 | 0)) {
       continue label$12
      }
      break label$12;
     };
    }
    $21_1 = +$12(+$21_1, $12_1 | 0);
    label$17 : {
     label$18 : {
      $21_1 = $21_1 + +$11(+($21_1 * .125)) * -8.0;
      if (!(Math_abs($21_1) < 2147483648.0)) {
       break label$18
      }
      $18_1 = ~~$21_1;
      break label$17;
     }
     $18_1 = -2147483648;
    }
    $21_1 = $21_1 - +($18_1 | 0);
    label$19 : {
     label$20 : {
      label$21 : {
       label$22 : {
        label$23 : {
         $19_1 = ($12_1 | 0) < (1 | 0);
         if ($19_1) {
          break label$23
         }
         $2_1 = (($11_1 << 2 | 0) + ($5_1 + 480 | 0) | 0) + -4 | 0;
         $205 = $2_1;
         $2_1 = HEAP32[$2_1 >> 2] | 0;
         $208 = $2_1;
         $2_1 = $2_1 >> $16_1 | 0;
         $6_1 = $208 - ($2_1 << $16_1 | 0) | 0;
         HEAP32[$205 >> 2] = $6_1;
         $20_1 = $6_1 >> $15 | 0;
         $18_1 = $2_1 + $18_1 | 0;
         break label$22;
        }
        if ($12_1) {
         break label$21
        }
        $20_1 = (HEAP32[((($11_1 << 2 | 0) + ($5_1 + 480 | 0) | 0) + -4 | 0) >> 2] | 0) >> 23 | 0;
       }
       if (($20_1 | 0) < (1 | 0)) {
        break label$19
       }
       break label$20;
      }
      $20_1 = 2;
      if ($21_1 >= .5) {
       break label$20
      }
      $20_1 = 0;
      break label$19;
     }
     $2_1 = 0;
     $14 = 0;
     label$24 : {
      if ($10_1) {
       break label$24
      }
      label$25 : while (1) {
       $10_1 = ($5_1 + 480 | 0) + ($2_1 << 2 | 0) | 0;
       $6_1 = HEAP32[$10_1 >> 2] | 0;
       $13_1 = 16777215;
       label$26 : {
        label$27 : {
         if ($14) {
          break label$27
         }
         $13_1 = 16777216;
         if ($6_1) {
          break label$27
         }
         $14 = 0;
         break label$26;
        }
        HEAP32[$10_1 >> 2] = $13_1 - $6_1 | 0;
        $14 = 1;
       }
       $2_1 = $2_1 + 1 | 0;
       if (($2_1 | 0) != ($11_1 | 0)) {
        continue label$25
       }
       break label$25;
      };
     }
     label$28 : {
      if ($19_1) {
       break label$28
      }
      $2_1 = 8388607;
      label$29 : {
       switch ($17_1 | 0) {
       case 1:
        $2_1 = 4194303;
        break;
       case 0:
        break label$29;
       default:
        break label$28;
       };
      }
      $6_1 = (($11_1 << 2 | 0) + ($5_1 + 480 | 0) | 0) + -4 | 0;
      HEAP32[$6_1 >> 2] = (HEAP32[$6_1 >> 2] | 0) & $2_1 | 0;
     }
     $18_1 = $18_1 + 1 | 0;
     if (($20_1 | 0) != (2 | 0)) {
      break label$19
     }
     $21_1 = 1.0 - $21_1;
     $20_1 = 2;
     if (!$14) {
      break label$19
     }
     $21_1 = $21_1 - +$12(+(1.0), $12_1 | 0);
    }
    label$31 : {
     if ($21_1 != 0.0) {
      break label$31
     }
     $6_1 = 0;
     $2_1 = $11_1;
     label$32 : {
      if (($2_1 | 0) <= ($9_1 | 0)) {
       break label$32
      }
      label$33 : while (1) {
       $2_1 = $2_1 + -1 | 0;
       $6_1 = HEAP32[(($5_1 + 480 | 0) + ($2_1 << 2 | 0) | 0) >> 2] | 0 | $6_1 | 0;
       if (($2_1 | 0) > ($9_1 | 0)) {
        continue label$33
       }
       break label$33;
      };
      if (!$6_1) {
       break label$32
      }
      $8_1 = $12_1;
      label$34 : while (1) {
       $8_1 = $8_1 + -24 | 0;
       $11_1 = $11_1 + -1 | 0;
       if (!(HEAP32[(($5_1 + 480 | 0) + ($11_1 << 2 | 0) | 0) >> 2] | 0)) {
        continue label$34
       }
       break label$9;
      };
     }
     $2_1 = 1;
     label$35 : while (1) {
      $6_1 = $2_1;
      $2_1 = $2_1 + 1 | 0;
      if (!(HEAP32[(($5_1 + 480 | 0) + (($9_1 - $6_1 | 0) << 2 | 0) | 0) >> 2] | 0)) {
       continue label$35
      }
      break label$35;
     };
     $13_1 = $6_1 + $11_1 | 0;
     label$36 : while (1) {
      $6_1 = $11_1 + $3_1 | 0;
      $11_1 = $11_1 + 1 | 0;
      HEAPF64[(($5_1 + 320 | 0) + ($6_1 << 3 | 0) | 0) >> 3] = +(HEAP32[((($11_1 + $7_1 | 0) << 2 | 0) + 65552 | 0) >> 2] | 0 | 0);
      $2_1 = 0;
      $21_1 = 0.0;
      label$37 : {
       if (($3_1 | 0) < (1 | 0)) {
        break label$37
       }
       label$38 : while (1) {
        $21_1 = +HEAPF64[($0_1 + ($2_1 << 3 | 0) | 0) >> 3] * +HEAPF64[(($5_1 + 320 | 0) + (($6_1 - $2_1 | 0) << 3 | 0) | 0) >> 3] + $21_1;
        $2_1 = $2_1 + 1 | 0;
        if (($2_1 | 0) != ($3_1 | 0)) {
         continue label$38
        }
        break label$38;
       };
      }
      HEAPF64[($5_1 + ($11_1 << 3 | 0) | 0) >> 3] = $21_1;
      if (($11_1 | 0) < ($13_1 | 0)) {
       continue label$36
      }
      break label$36;
     };
     $11_1 = $13_1;
     continue label$10;
    }
    break label$10;
   };
   label$39 : {
    label$40 : {
     $21_1 = +$12(+$21_1, 24 - $8_1 | 0 | 0);
     if (!($21_1 >= 16777216.0)) {
      break label$40
     }
     $3_1 = $11_1 << 2 | 0;
     label$41 : {
      label$42 : {
       $22_1 = $21_1 * 5.9604644775390625e-08;
       if (!(Math_abs($22_1) < 2147483648.0)) {
        break label$42
       }
       $2_1 = ~~$22_1;
       break label$41;
      }
      $2_1 = -2147483648;
     }
     $3_1 = ($5_1 + 480 | 0) + $3_1 | 0;
     label$43 : {
      label$44 : {
       $21_1 = +($2_1 | 0) * -16777216.0 + $21_1;
       if (!(Math_abs($21_1) < 2147483648.0)) {
        break label$44
       }
       $6_1 = ~~$21_1;
       break label$43;
      }
      $6_1 = -2147483648;
     }
     HEAP32[$3_1 >> 2] = $6_1;
     $11_1 = $11_1 + 1 | 0;
     break label$39;
    }
    label$45 : {
     label$46 : {
      if (!(Math_abs($21_1) < 2147483648.0)) {
       break label$46
      }
      $2_1 = ~~$21_1;
      break label$45;
     }
     $2_1 = -2147483648;
    }
    $8_1 = $12_1;
   }
   HEAP32[(($5_1 + 480 | 0) + ($11_1 << 2 | 0) | 0) >> 2] = $2_1;
  }
  $21_1 = +$12(+(1.0), $8_1 | 0);
  label$47 : {
   if (($11_1 | 0) <= (-1 | 0)) {
    break label$47
   }
   $3_1 = $11_1;
   label$48 : while (1) {
    $2_1 = $3_1;
    HEAPF64[($5_1 + ($2_1 << 3 | 0) | 0) >> 3] = $21_1 * +(HEAP32[(($5_1 + 480 | 0) + ($2_1 << 2 | 0) | 0) >> 2] | 0 | 0);
    $3_1 = $2_1 + -1 | 0;
    $21_1 = $21_1 * 5.9604644775390625e-08;
    if ($2_1) {
     continue label$48
    }
    break label$48;
   };
   if (($11_1 | 0) <= (-1 | 0)) {
    break label$47
   }
   $6_1 = $11_1;
   label$49 : while (1) {
    $21_1 = 0.0;
    $2_1 = 0;
    label$50 : {
     $13_1 = $11_1 - $6_1 | 0;
     $0_1 = ($9_1 | 0) < ($13_1 | 0) ? $9_1 : $13_1;
     if (($0_1 | 0) < (0 | 0)) {
      break label$50
     }
     label$51 : while (1) {
      $21_1 = +HEAPF64[(($2_1 << 3 | 0) + 68320 | 0) >> 3] * +HEAPF64[($5_1 + (($2_1 + $6_1 | 0) << 3 | 0) | 0) >> 3] + $21_1;
      $3_1 = ($2_1 | 0) != ($0_1 | 0);
      $2_1 = $2_1 + 1 | 0;
      if ($3_1) {
       continue label$51
      }
      break label$51;
     };
    }
    HEAPF64[(($5_1 + 160 | 0) + ($13_1 << 3 | 0) | 0) >> 3] = $21_1;
    $2_1 = ($6_1 | 0) > (0 | 0);
    $6_1 = $6_1 + -1 | 0;
    if ($2_1) {
     continue label$49
    }
    break label$49;
   };
  }
  label$52 : {
   label$53 : {
    label$54 : {
     switch ($4_1 | 0) {
     case 3:
      $23_1 = 0.0;
      label$57 : {
       if (($11_1 | 0) < (1 | 0)) {
        break label$57
       }
       $21_1 = +HEAPF64[(($5_1 + 160 | 0) + ($11_1 << 3 | 0) | 0) >> 3];
       $2_1 = $11_1;
       label$58 : while (1) {
        $3_1 = $2_1 + -1 | 0;
        $6_1 = ($5_1 + 160 | 0) + ($3_1 << 3 | 0) | 0;
        $22_1 = +HEAPF64[$6_1 >> 3];
        $520 = $22_1;
        $22_1 = $22_1 + $21_1;
        HEAPF64[(($5_1 + 160 | 0) + ($2_1 << 3 | 0) | 0) >> 3] = $21_1 + ($520 - $22_1);
        HEAPF64[$6_1 >> 3] = $22_1;
        $6_1 = $2_1 >>> 0 > 1 >>> 0;
        $21_1 = $22_1;
        $2_1 = $3_1;
        if ($6_1) {
         continue label$58
        }
        break label$58;
       };
       if (($11_1 | 0) == (1 | 0)) {
        break label$57
       }
       $21_1 = +HEAPF64[(($5_1 + 160 | 0) + ($11_1 << 3 | 0) | 0) >> 3];
       $2_1 = $11_1;
       label$59 : while (1) {
        $3_1 = $2_1 + -1 | 0;
        $6_1 = ($5_1 + 160 | 0) + ($3_1 << 3 | 0) | 0;
        $22_1 = +HEAPF64[$6_1 >> 3];
        $558 = $22_1;
        $22_1 = $22_1 + $21_1;
        HEAPF64[(($5_1 + 160 | 0) + ($2_1 << 3 | 0) | 0) >> 3] = $21_1 + ($558 - $22_1);
        HEAPF64[$6_1 >> 3] = $22_1;
        $6_1 = $2_1 >>> 0 > 2 >>> 0;
        $21_1 = $22_1;
        $2_1 = $3_1;
        if ($6_1) {
         continue label$59
        }
        break label$59;
       };
       $23_1 = 0.0;
       if (($11_1 | 0) == (1 | 0)) {
        break label$57
       }
       label$60 : while (1) {
        $23_1 = $23_1 + +HEAPF64[(($5_1 + 160 | 0) + ($11_1 << 3 | 0) | 0) >> 3];
        $2_1 = ($11_1 | 0) > (2 | 0);
        $11_1 = $11_1 + -1 | 0;
        if ($2_1) {
         continue label$60
        }
        break label$60;
       };
      }
      $21_1 = +HEAPF64[($5_1 + 160 | 0) >> 3];
      if ($20_1) {
       break label$53
      }
      HEAPF64[$1_1 >> 3] = $21_1;
      $21_1 = +HEAPF64[($5_1 + 168 | 0) >> 3];
      HEAPF64[($1_1 + 16 | 0) >> 3] = $23_1;
      HEAPF64[($1_1 + 8 | 0) >> 3] = $21_1;
      break label$52;
     case 0:
      $21_1 = 0.0;
      label$61 : {
       if (($11_1 | 0) < (0 | 0)) {
        break label$61
       }
       label$62 : while (1) {
        $2_1 = $11_1;
        $11_1 = $2_1 + -1 | 0;
        $21_1 = $21_1 + +HEAPF64[(($5_1 + 160 | 0) + ($2_1 << 3 | 0) | 0) >> 3];
        if ($2_1) {
         continue label$62
        }
        break label$62;
       };
      }
      HEAPF64[$1_1 >> 3] = $20_1 ? -$21_1 : $21_1;
      break label$52;
     case 1:
     case 2:
      break label$54;
     default:
      break label$52;
     };
    }
    $21_1 = 0.0;
    label$63 : {
     if (($11_1 | 0) < (0 | 0)) {
      break label$63
     }
     $3_1 = $11_1;
     label$64 : while (1) {
      $2_1 = $3_1;
      $3_1 = $2_1 + -1 | 0;
      $21_1 = $21_1 + +HEAPF64[(($5_1 + 160 | 0) + ($2_1 << 3 | 0) | 0) >> 3];
      if ($2_1) {
       continue label$64
      }
      break label$64;
     };
    }
    HEAPF64[$1_1 >> 3] = $20_1 ? -$21_1 : $21_1;
    $21_1 = +HEAPF64[($5_1 + 160 | 0) >> 3] - $21_1;
    $2_1 = 1;
    label$65 : {
     if (($11_1 | 0) < (1 | 0)) {
      break label$65
     }
     label$66 : while (1) {
      $21_1 = $21_1 + +HEAPF64[(($5_1 + 160 | 0) + ($2_1 << 3 | 0) | 0) >> 3];
      $3_1 = ($2_1 | 0) != ($11_1 | 0);
      $2_1 = $2_1 + 1 | 0;
      if ($3_1) {
       continue label$66
      }
      break label$66;
     };
    }
    HEAPF64[($1_1 + 8 | 0) >> 3] = $20_1 ? -$21_1 : $21_1;
    break label$52;
   }
   HEAPF64[$1_1 >> 3] = -$21_1;
   $21_1 = +HEAPF64[($5_1 + 168 | 0) >> 3];
   HEAPF64[($1_1 + 16 | 0) >> 3] = -$23_1;
   HEAPF64[($1_1 + 8 | 0) >> 3] = -$21_1;
  }
  global$0 = $5_1 + 560 | 0;
  return $18_1 & 7 | 0 | 0;
 }
 
 function $8($0_1, $1_1) {
  $0_1 = +$0_1;
  $1_1 = $1_1 | 0;
  var $8_1 = 0.0, $3_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, i64toi32_i32$4 = 0, $9_1 = 0.0, $2_1 = 0, $4_1 = 0, $5_1 = 0, $10_1 = 0.0, $11_1 = 0.0, $7_1 = 0, $7$hi = 0, $6_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $23_1 = 0, $24_1 = 0, $25_1 = 0, $26_1 = 0, $27_1 = 0, $28_1 = 0, $29_1 = 0, $30_1 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $188 = 0, $214 = 0;
  $2_1 = global$0 - 48 | 0;
  global$0 = $2_1;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      wasm2js_scratch_store_f64(+$0_1);
      i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
      $7_1 = wasm2js_scratch_load_i32(0 | 0) | 0;
      $7$hi = i64toi32_i32$0;
      i64toi32_i32$2 = $7_1;
      i64toi32_i32$1 = 0;
      i64toi32_i32$3 = 32;
      i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
      if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
       i64toi32_i32$1 = 0;
       $20_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
      } else {
       i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
       $20_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
      }
      $3_1 = $20_1;
      $4_1 = $3_1 & 2147483647 | 0;
      if ($4_1 >>> 0 > 1074752122 >>> 0) {
       break label$4
      }
      if (($3_1 & 1048575 | 0 | 0) == (598523 | 0)) {
       break label$3
      }
      label$5 : {
       if ($4_1 >>> 0 > 1073928572 >>> 0) {
        break label$5
       }
       label$6 : {
        i64toi32_i32$1 = $7$hi;
        i64toi32_i32$0 = $7_1;
        i64toi32_i32$2 = 0;
        i64toi32_i32$3 = 0;
        if ((i64toi32_i32$1 | 0) < (i64toi32_i32$2 | 0)) {
         $21_1 = 1
        } else {
         if ((i64toi32_i32$1 | 0) <= (i64toi32_i32$2 | 0)) {
          if (i64toi32_i32$0 >>> 0 >= i64toi32_i32$3 >>> 0) {
           $22_1 = 0
          } else {
           $22_1 = 1
          }
          $23_1 = $22_1;
         } else {
          $23_1 = 0
         }
         $21_1 = $23_1;
        }
        if ($21_1) {
         break label$6
        }
        $0_1 = $0_1 + -1.5707963267341256;
        $8_1 = $0_1 + -6.077100506506192e-11;
        HEAPF64[$1_1 >> 3] = $8_1;
        HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + -6.077100506506192e-11;
        $3_1 = 1;
        break label$1;
       }
       $0_1 = $0_1 + 1.5707963267341256;
       $8_1 = $0_1 + 6.077100506506192e-11;
       HEAPF64[$1_1 >> 3] = $8_1;
       HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + 6.077100506506192e-11;
       $3_1 = -1;
       break label$1;
      }
      label$7 : {
       i64toi32_i32$0 = $7$hi;
       i64toi32_i32$3 = $7_1;
       i64toi32_i32$1 = 0;
       i64toi32_i32$2 = 0;
       if ((i64toi32_i32$0 | 0) < (i64toi32_i32$1 | 0)) {
        $24_1 = 1
       } else {
        if ((i64toi32_i32$0 | 0) <= (i64toi32_i32$1 | 0)) {
         if (i64toi32_i32$3 >>> 0 >= i64toi32_i32$2 >>> 0) {
          $25_1 = 0
         } else {
          $25_1 = 1
         }
         $26_1 = $25_1;
        } else {
         $26_1 = 0
        }
        $24_1 = $26_1;
       }
       if ($24_1) {
        break label$7
       }
       $0_1 = $0_1 + -3.1415926534682512;
       $8_1 = $0_1 + -1.2154201013012384e-10;
       HEAPF64[$1_1 >> 3] = $8_1;
       HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + -1.2154201013012384e-10;
       $3_1 = 2;
       break label$1;
      }
      $0_1 = $0_1 + 3.1415926534682512;
      $8_1 = $0_1 + 1.2154201013012384e-10;
      HEAPF64[$1_1 >> 3] = $8_1;
      HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + 1.2154201013012384e-10;
      $3_1 = -2;
      break label$1;
     }
     label$8 : {
      if ($4_1 >>> 0 > 1075594811 >>> 0) {
       break label$8
      }
      label$9 : {
       if ($4_1 >>> 0 > 1075183036 >>> 0) {
        break label$9
       }
       if (($4_1 | 0) == (1074977148 | 0)) {
        break label$3
       }
       label$10 : {
        i64toi32_i32$3 = $7$hi;
        i64toi32_i32$2 = $7_1;
        i64toi32_i32$0 = 0;
        i64toi32_i32$1 = 0;
        if ((i64toi32_i32$3 | 0) < (i64toi32_i32$0 | 0)) {
         $27_1 = 1
        } else {
         if ((i64toi32_i32$3 | 0) <= (i64toi32_i32$0 | 0)) {
          if (i64toi32_i32$2 >>> 0 >= i64toi32_i32$1 >>> 0) {
           $28_1 = 0
          } else {
           $28_1 = 1
          }
          $29_1 = $28_1;
         } else {
          $29_1 = 0
         }
         $27_1 = $29_1;
        }
        if ($27_1) {
         break label$10
        }
        $0_1 = $0_1 + -4.712388980202377;
        $8_1 = $0_1 + -1.8231301519518578e-10;
        HEAPF64[$1_1 >> 3] = $8_1;
        HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + -1.8231301519518578e-10;
        $3_1 = 3;
        break label$1;
       }
       $0_1 = $0_1 + 4.712388980202377;
       $8_1 = $0_1 + 1.8231301519518578e-10;
       HEAPF64[$1_1 >> 3] = $8_1;
       HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + 1.8231301519518578e-10;
       $3_1 = -3;
       break label$1;
      }
      if (($4_1 | 0) == (1075388923 | 0)) {
       break label$3
      }
      label$11 : {
       i64toi32_i32$2 = $7$hi;
       i64toi32_i32$1 = $7_1;
       i64toi32_i32$3 = 0;
       i64toi32_i32$0 = 0;
       if ((i64toi32_i32$2 | 0) < (i64toi32_i32$3 | 0)) {
        $30_1 = 1
       } else {
        if ((i64toi32_i32$2 | 0) <= (i64toi32_i32$3 | 0)) {
         if (i64toi32_i32$1 >>> 0 >= i64toi32_i32$0 >>> 0) {
          $31 = 0
         } else {
          $31 = 1
         }
         $32 = $31;
        } else {
         $32 = 0
        }
        $30_1 = $32;
       }
       if ($30_1) {
        break label$11
       }
       $0_1 = $0_1 + -6.2831853069365025;
       $8_1 = $0_1 + -2.430840202602477e-10;
       HEAPF64[$1_1 >> 3] = $8_1;
       HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + -2.430840202602477e-10;
       $3_1 = 4;
       break label$1;
      }
      $0_1 = $0_1 + 6.2831853069365025;
      $8_1 = $0_1 + 2.430840202602477e-10;
      HEAPF64[$1_1 >> 3] = $8_1;
      HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1 - $8_1 + 2.430840202602477e-10;
      $3_1 = -4;
      break label$1;
     }
     if ($4_1 >>> 0 > 1094263290 >>> 0) {
      break label$2
     }
    }
    $8_1 = $0_1 * .6366197723675814 + 6755399441055744.0 + -6755399441055744.0;
    $9_1 = $0_1 + $8_1 * -1.5707963267341256;
    $10_1 = $8_1 * 6.077100506506192e-11;
    $11_1 = $9_1 - $10_1;
    $5_1 = $11_1 < -.7853981633974483;
    label$12 : {
     label$13 : {
      if (!(Math_abs($8_1) < 2147483648.0)) {
       break label$13
      }
      $3_1 = ~~$8_1;
      break label$12;
     }
     $3_1 = -2147483648;
    }
    label$14 : {
     label$15 : {
      if (!$5_1) {
       break label$15
      }
      $3_1 = $3_1 + -1 | 0;
      $8_1 = $8_1 + -1.0;
      $10_1 = $8_1 * 6.077100506506192e-11;
      $9_1 = $0_1 + $8_1 * -1.5707963267341256;
      break label$14;
     }
     if (!($11_1 > .7853981633974483)) {
      break label$14
     }
     $3_1 = $3_1 + 1 | 0;
     $8_1 = $8_1 + 1.0;
     $10_1 = $8_1 * 6.077100506506192e-11;
     $9_1 = $0_1 + $8_1 * -1.5707963267341256;
    }
    $0_1 = $9_1 - $10_1;
    HEAPF64[$1_1 >> 3] = $0_1;
    label$16 : {
     $5_1 = $4_1 >>> 20 | 0;
     $188 = $5_1;
     wasm2js_scratch_store_f64(+$0_1);
     i64toi32_i32$1 = wasm2js_scratch_load_i32(1 | 0) | 0;
     i64toi32_i32$0 = wasm2js_scratch_load_i32(0 | 0) | 0;
     i64toi32_i32$2 = 0;
     i64toi32_i32$3 = 52;
     i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
     if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
      i64toi32_i32$2 = 0;
      $33 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
     } else {
      i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
      $33 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
     }
     if (($188 - ($33 & 2047 | 0) | 0 | 0) < (17 | 0)) {
      break label$16
     }
     $0_1 = $8_1 * 6.077100506303966e-11;
     $11_1 = $9_1 - $0_1;
     $10_1 = $8_1 * 2.0222662487959506e-21 - ($9_1 - $11_1 - $0_1);
     $0_1 = $11_1 - $10_1;
     HEAPF64[$1_1 >> 3] = $0_1;
     label$17 : {
      $214 = $5_1;
      wasm2js_scratch_store_f64(+$0_1);
      i64toi32_i32$2 = wasm2js_scratch_load_i32(1 | 0) | 0;
      i64toi32_i32$1 = wasm2js_scratch_load_i32(0 | 0) | 0;
      i64toi32_i32$0 = 0;
      i64toi32_i32$3 = 52;
      i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
      if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
       i64toi32_i32$0 = 0;
       $34 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
      } else {
       i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
       $34 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
      }
      if (($214 - ($34 & 2047 | 0) | 0 | 0) >= (50 | 0)) {
       break label$17
      }
      $9_1 = $11_1;
      break label$16;
     }
     $0_1 = $8_1 * 2.0222662487111665e-21;
     $9_1 = $11_1 - $0_1;
     $10_1 = $8_1 * 8.4784276603689e-32 - ($11_1 - $9_1 - $0_1);
     $0_1 = $9_1 - $10_1;
     HEAPF64[$1_1 >> 3] = $0_1;
    }
    HEAPF64[($1_1 + 8 | 0) >> 3] = $9_1 - $0_1 - $10_1;
    break label$1;
   }
   label$18 : {
    if ($4_1 >>> 0 < 2146435072 >>> 0) {
     break label$18
    }
    $0_1 = $0_1 - $0_1;
    HEAPF64[$1_1 >> 3] = $0_1;
    HEAPF64[($1_1 + 8 | 0) >> 3] = $0_1;
    $3_1 = 0;
    break label$1;
   }
   i64toi32_i32$0 = $7$hi;
   i64toi32_i32$2 = $7_1;
   i64toi32_i32$1 = 1048575;
   i64toi32_i32$3 = -1;
   i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
   i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
   i64toi32_i32$2 = 1096810496;
   i64toi32_i32$3 = 0;
   i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
   wasm2js_scratch_store_i32(0 | 0, i64toi32_i32$0 | i64toi32_i32$3 | 0 | 0);
   wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$2 | 0);
   $0_1 = +wasm2js_scratch_load_f64();
   $3_1 = 0;
   $5_1 = 1;
   label$19 : while (1) {
    $3_1 = ($2_1 + 16 | 0) + ($3_1 << 3 | 0) | 0;
    label$20 : {
     label$21 : {
      if (!(Math_abs($0_1) < 2147483648.0)) {
       break label$21
      }
      $6_1 = ~~$0_1;
      break label$20;
     }
     $6_1 = -2147483648;
    }
    $8_1 = +($6_1 | 0);
    HEAPF64[$3_1 >> 3] = $8_1;
    $0_1 = ($0_1 - $8_1) * 16777216.0;
    $3_1 = 1;
    $6_1 = $5_1 & 1 | 0;
    $5_1 = 0;
    if ($6_1) {
     continue label$19
    }
    break label$19;
   };
   HEAPF64[($2_1 + 32 | 0) >> 3] = $0_1;
   $3_1 = 2;
   label$22 : while (1) {
    $5_1 = $3_1;
    $3_1 = $3_1 + -1 | 0;
    if (+HEAPF64[(($2_1 + 16 | 0) + ($5_1 << 3 | 0) | 0) >> 3] == 0.0) {
     continue label$22
    }
    break label$22;
   };
   $3_1 = $7($2_1 + 16 | 0 | 0, $2_1 | 0, ($4_1 >>> 20 | 0) + -1046 | 0 | 0, $5_1 + 1 | 0 | 0, 1 | 0) | 0;
   $0_1 = +HEAPF64[$2_1 >> 3];
   label$23 : {
    i64toi32_i32$2 = $7$hi;
    i64toi32_i32$1 = $7_1;
    i64toi32_i32$0 = -1;
    i64toi32_i32$3 = -1;
    if ((i64toi32_i32$2 | 0) > (i64toi32_i32$0 | 0)) {
     $35 = 1
    } else {
     if ((i64toi32_i32$2 | 0) >= (i64toi32_i32$0 | 0)) {
      if (i64toi32_i32$1 >>> 0 <= i64toi32_i32$3 >>> 0) {
       $36 = 0
      } else {
       $36 = 1
      }
      $37 = $36;
     } else {
      $37 = 0
     }
     $35 = $37;
    }
    if ($35) {
     break label$23
    }
    HEAPF64[$1_1 >> 3] = -$0_1;
    HEAPF64[($1_1 + 8 | 0) >> 3] = -+HEAPF64[($2_1 + 8 | 0) >> 3];
    $3_1 = 0 - $3_1 | 0;
    break label$1;
   }
   HEAPF64[$1_1 >> 3] = $0_1;
   HEAPF64[($1_1 + 8 | 0) >> 3] = +HEAPF64[($2_1 + 8 | 0) >> 3];
  }
  global$0 = $2_1 + 48 | 0;
  return $3_1 | 0;
 }
 
 function $9($0_1, $1_1, $2_1) {
  $0_1 = +$0_1;
  $1_1 = +$1_1;
  $2_1 = $2_1 | 0;
  var $3_1 = 0.0, $5_1 = 0.0, $4_1 = 0.0;
  $3_1 = $0_1 * $0_1;
  $4_1 = $3_1 * ($3_1 * $3_1) * ($3_1 * 1.58969099521155e-10 + -2.5050760253406863e-08) + ($3_1 * ($3_1 * 2.7557313707070068e-06 + -1.984126982985795e-04) + .00833333333332249);
  $5_1 = $3_1 * $0_1;
  label$1 : {
   if ($2_1) {
    break label$1
   }
   return +($5_1 * ($3_1 * $4_1 + -.16666666666666632) + $0_1);
  }
  return +($0_1 - ($3_1 * ($1_1 * .5 - $4_1 * $5_1) - $1_1 + $5_1 * .16666666666666632));
 }
 
 function $10($0_1) {
  $0_1 = +$0_1;
  var $3_1 = 0.0, $1_1 = 0, i64toi32_i32$4 = 0, $2_1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $9_1 = 0, i64toi32_i32$2 = 0;
  $1_1 = global$0 - 16 | 0;
  global$0 = $1_1;
  label$1 : {
   label$2 : {
    wasm2js_scratch_store_f64(+$0_1);
    i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
    i64toi32_i32$2 = wasm2js_scratch_load_i32(0 | 0) | 0;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 32;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $9_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     $9_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    $2_1 = $9_1 & 2147483647 | 0;
    if ($2_1 >>> 0 > 1072243195 >>> 0) {
     break label$2
    }
    $3_1 = 1.0;
    if ($2_1 >>> 0 < 1044816030 >>> 0) {
     break label$1
    }
    $3_1 = +$6(+$0_1, +(0.0));
    break label$1;
   }
   label$3 : {
    if ($2_1 >>> 0 < 2146435072 >>> 0) {
     break label$3
    }
    $3_1 = $0_1 - $0_1;
    break label$1;
   }
   $2_1 = $8(+$0_1, $1_1 | 0) | 0;
   $0_1 = +HEAPF64[($1_1 + 8 | 0) >> 3];
   $3_1 = +HEAPF64[$1_1 >> 3];
   label$4 : {
    switch ($2_1 & 3 | 0 | 0) {
    case 0:
     $3_1 = +$6(+$3_1, +$0_1);
     break label$1;
    case 1:
     $3_1 = -+$9(+$3_1, +$0_1, 1 | 0);
     break label$1;
    case 2:
     $3_1 = -+$6(+$3_1, +$0_1);
     break label$1;
    default:
     break label$4;
    };
   }
   $3_1 = +$9(+$3_1, +$0_1, 1 | 0);
  }
  global$0 = $1_1 + 16 | 0;
  return +$3_1;
 }
 
 function $11($0_1) {
  $0_1 = +$0_1;
  return +Math_floor($0_1);
 }
 
 function $12($0_1, $1_1) {
  $0_1 = +$0_1;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $8_1 = 0, $32 = 0.0, i64toi32_i32$0 = 0;
  label$1 : {
   label$2 : {
    if (($1_1 | 0) < (1024 | 0)) {
     break label$2
    }
    $0_1 = $0_1 * 8988465674311579538646525.0e283;
    label$3 : {
     if ($1_1 >>> 0 >= 2047 >>> 0) {
      break label$3
     }
     $1_1 = $1_1 + -1023 | 0;
     break label$1;
    }
    $0_1 = $0_1 * 8988465674311579538646525.0e283;
    $1_1 = (($1_1 | 0) < (3069 | 0) ? $1_1 : 3069) + -2046 | 0;
    break label$1;
   }
   if (($1_1 | 0) > (-1023 | 0)) {
    break label$1
   }
   $0_1 = $0_1 * 2.004168360008973e-292;
   label$4 : {
    if ($1_1 >>> 0 <= -1992 >>> 0) {
     break label$4
    }
    $1_1 = $1_1 + 969 | 0;
    break label$1;
   }
   $0_1 = $0_1 * 2.004168360008973e-292;
   $1_1 = (($1_1 | 0) > (-2960 | 0) ? $1_1 : -2960) + 1938 | 0;
  }
  $32 = $0_1;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = $1_1 + 1023 | 0;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 52;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $8_1 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $8_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  wasm2js_scratch_store_i32(0 | 0, $8_1 | 0);
  wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$1 | 0);
  return +($32 * +wasm2js_scratch_load_f64());
 }
 
 function $13($0_1) {
  $0_1 = +$0_1;
  var $1_1 = 0, i64toi32_i32$4 = 0, $2_1 = 0, $3_1 = 0.0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $9_1 = 0, i64toi32_i32$2 = 0;
  $1_1 = global$0 - 16 | 0;
  global$0 = $1_1;
  label$1 : {
   label$2 : {
    wasm2js_scratch_store_f64(+$0_1);
    i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
    i64toi32_i32$2 = wasm2js_scratch_load_i32(0 | 0) | 0;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 32;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $9_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     $9_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    $2_1 = $9_1 & 2147483647 | 0;
    if ($2_1 >>> 0 > 1072243195 >>> 0) {
     break label$2
    }
    if ($2_1 >>> 0 < 1045430272 >>> 0) {
     break label$1
    }
    $0_1 = +$9(+$0_1, +(0.0), 0 | 0);
    break label$1;
   }
   label$3 : {
    if ($2_1 >>> 0 < 2146435072 >>> 0) {
     break label$3
    }
    $0_1 = $0_1 - $0_1;
    break label$1;
   }
   $2_1 = $8(+$0_1, $1_1 | 0) | 0;
   $0_1 = +HEAPF64[($1_1 + 8 | 0) >> 3];
   $3_1 = +HEAPF64[$1_1 >> 3];
   label$4 : {
    switch ($2_1 & 3 | 0 | 0) {
    case 0:
     $0_1 = +$9(+$3_1, +$0_1, 1 | 0);
     break label$1;
    case 1:
     $0_1 = +$6(+$3_1, +$0_1);
     break label$1;
    case 2:
     $0_1 = -+$9(+$3_1, +$0_1, 1 | 0);
     break label$1;
    default:
     break label$4;
    };
   }
   $0_1 = -+$6(+$3_1, +$0_1);
  }
  global$0 = $1_1 + 16 | 0;
  return +$0_1;
 }
 
 function $16() {
  global$3 = 65536;
  global$2 = (0 + 15 | 0) & -16 | 0;
 }
 
 function $17() {
  return global$0 - global$2 | 0 | 0;
 }
 
 function $18() {
  return global$3 | 0;
 }
 
 function $19() {
  return global$2 | 0;
 }
 
 function $20() {
  return global$0 | 0;
 }
 
 function $21($0_1) {
  $0_1 = $0_1 | 0;
  global$0 = $0_1;
 }
 
 function $22($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = (global$0 - $0_1 | 0) & -16 | 0;
  global$0 = $1_1;
  return $1_1 | 0;
 }
 
 function $23() {
  return global$0 | 0;
 }
 
 function $24($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $25($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $26() {
  $24(68384 | 0);
  return 68388 | 0;
 }
 
 function $27() {
  $25(68384 | 0);
 }
 
 function $28($0_1) {
  $0_1 = $0_1 | 0;
  return 1 | 0;
 }
 
 function $29($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $30($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, i64toi32_i32$1 = 0, $2_1 = 0, i64toi32_i32$0 = 0, $3_1 = 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   $1_1 = 0;
   label$2 : {
    if (!(HEAP32[(0 + 68392 | 0) >> 2] | 0)) {
     break label$2
    }
    $1_1 = $30(HEAP32[(0 + 68392 | 0) >> 2] | 0 | 0) | 0;
   }
   label$3 : {
    if (!(HEAP32[(0 + 68392 | 0) >> 2] | 0)) {
     break label$3
    }
    $1_1 = $30(HEAP32[(0 + 68392 | 0) >> 2] | 0 | 0) | 0 | $1_1 | 0;
   }
   label$4 : {
    $0_1 = HEAP32[($26() | 0) >> 2] | 0;
    if (!$0_1) {
     break label$4
    }
    label$5 : while (1) {
     $2_1 = 0;
     label$6 : {
      if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) < (0 | 0)) {
       break label$6
      }
      $2_1 = $28($0_1 | 0) | 0;
     }
     label$7 : {
      if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0 | 0) == (HEAP32[($0_1 + 28 | 0) >> 2] | 0 | 0)) {
       break label$7
      }
      $1_1 = $30($0_1 | 0) | 0 | $1_1 | 0;
     }
     label$8 : {
      if (!$2_1) {
       break label$8
      }
      $29($0_1 | 0);
     }
     $0_1 = HEAP32[($0_1 + 56 | 0) >> 2] | 0;
     if ($0_1) {
      continue label$5
     }
     break label$5;
    };
   }
   $27();
   return $1_1 | 0;
  }
  label$9 : {
   label$10 : {
    if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) >= (0 | 0)) {
     break label$10
    }
    $2_1 = 1;
    break label$9;
   }
   $2_1 = !($28($0_1 | 0) | 0);
  }
  label$11 : {
   label$12 : {
    label$13 : {
     if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0 | 0) == (HEAP32[($0_1 + 28 | 0) >> 2] | 0 | 0)) {
      break label$13
     }
     FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0 | 0]($0_1, 0, 0) | 0;
     if (HEAP32[($0_1 + 20 | 0) >> 2] | 0) {
      break label$13
     }
     $1_1 = -1;
     if (!$2_1) {
      break label$12
     }
     break label$11;
    }
    label$14 : {
     $1_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
     $3_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
     if (($1_1 | 0) == ($3_1 | 0)) {
      break label$14
     }
     i64toi32_i32$1 = $1_1 - $3_1 | 0;
     i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
     i64toi32_i32$0 = FUNCTION_TABLE[HEAP32[($0_1 + 40 | 0) >> 2] | 0 | 0]($0_1, i64toi32_i32$1, i64toi32_i32$0, 1) | 0;
     i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    }
    $1_1 = 0;
    HEAP32[($0_1 + 28 | 0) >> 2] = 0;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$1 = 0;
    HEAP32[($0_1 + 16 | 0) >> 2] = 0;
    HEAP32[($0_1 + 20 | 0) >> 2] = i64toi32_i32$1;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$1 = 0;
    HEAP32[($0_1 + 4 | 0) >> 2] = 0;
    HEAP32[($0_1 + 8 | 0) >> 2] = i64toi32_i32$1;
    if ($2_1) {
     break label$11
    }
   }
   $29($0_1 | 0);
  }
  return $1_1 | 0;
 }
 
 // EMSCRIPTEN_END_FUNCS
;
 bufferView = HEAPU8;
 initActiveSegments(imports);
 var FUNCTION_TABLE = Table([]);
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }
 
 return {
  "memory": Object.create(Object.prototype, {
   "grow": {
    
   }, 
   "buffer": {
    "get": function () {
     return buffer;
    }
    
   }
  }), 
  "__wasm_call_ctors": $0, 
  "add": $1, 
  "find_x": $2, 
  "find_y": $3, 
  "__indirect_function_table": FUNCTION_TABLE, 
  "find_new_x": $4, 
  "find_new_y": $5, 
  "fflush": $30, 
  "emscripten_stack_init": $16, 
  "emscripten_stack_get_free": $17, 
  "emscripten_stack_get_base": $18, 
  "emscripten_stack_get_end": $19, 
  "stackSave": $20, 
  "stackRestore": $21, 
  "stackAlloc": $22, 
  "emscripten_stack_get_current": $23
 };
}

  return asmFunc(info);
}

)(info);
  },

  instantiate: /** @suppress{checkTypes} */ function(binary, info) {
    return {
      then: function(ok) {
        var module = new WebAssembly.Module(binary);
        ok({
          'instance': new WebAssembly.Instance(module, info)
        });
        // Emulate a simple WebAssembly.instantiate(..).then(()=>{}).catch(()=>{}) syntax.
        return { catch: function() {} };
      }
    };
  },

  RuntimeError: Error
};

// We don't need to actually download a wasm binary, mark it as present but empty.
wasmBinary = [];
// end include: wasm2js.js
if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// include: base64Utils.js
// Converts a string of base64 into a byte array (Uint8Array).
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE != 'undefined' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  }

  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0 ; i < decoded.length ; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
// end include: base64Utils.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort('malloc() called but not included in the build - add `_malloc` to EXPORTED_FUNCTIONS');
}
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort('free() called but not included in the build - add `_free` to EXPORTED_FUNCTIONS');
}

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_assertions.js
// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init() { FS.error() },
  createDataFile() { FS.error() },
  createPreloadedFile() { FS.error() },
  createLazyFile() { FS.error() },
  open() { FS.error() },
  mkdev() { FS.error() },
  registerDevice() { FS.error() },
  analyzePath() { FS.error() },

  ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
function createExportWrapper(name) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    return f(...args);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
var wasmBinaryFile;
  wasmBinaryFile = 'info.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var binary = tryParseAsDataURI(file);
  if (binary) {
    return binary;
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'both async and sync fetching of the wasm failed';
}

function getBinaryPromise(binaryFile) {
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary
      && !isDataURI(binaryFile)
      && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
      && !isFileURI(binaryFile)
    ) {
      return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
        if (!response['ok']) {
          throw `failed to load wasm binary file at '${binaryFile}'`;
        }
        return response['arrayBuffer']();
      }).catch(() => getBinarySync(binaryFile));
    }
    else if (readAsync) {
      // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
      return new Promise((resolve, reject) => {
        readAsync(binaryFile, (response) => resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))), reject)
      });
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then(receiver, (reason) => {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary &&
      typeof WebAssembly.instantiateStreaming == 'function' &&
      !isDataURI(binaryFile) &&
      // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
      !isFileURI(binaryFile) &&
      // Avoid instantiateStreaming() on Node.js environment for now, as while
      // Node.js v18.1.0 implements it, it does not have a full fetch()
      // implementation yet.
      //
      // Reference:
      //   https://github.com/emscripten-core/emscripten/pull/16917
      !ENVIRONMENT_IS_NODE &&
      typeof fetch == 'function') {
    return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */
      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(
        callback,
        function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          err(`wasm streaming compile failed: ${reason}`);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(binaryFile, imports, callback);
        });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    

    wasmMemory = wasmExports['memory'];
    
    assert(wasmMemory, 'memory not found in wasm exports');
    // This assertion doesn't hold when emscripten is run in --post-link
    // mode.
    // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
    //assert(wasmMemory.buffer.byteLength === 16777216);
    updateMemoryViews();

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {

    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        return false;
    }
  }

  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
function legacyModuleProp(prop, newName, incomming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incomming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  if (typeof globalThis !== 'undefined') {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
        return undefined;
      }
    });
  }
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  if (typeof globalThis !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
  // Any symbol that is not included from the JS libary is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}
// end include: runtime_debug.js
// === Body ===

// end include: preamble.js

  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  
  
  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  
};
var wasmExports = createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors');
var _add = Module['_add'] = createExportWrapper('add');
var _find_x = Module['_find_x'] = createExportWrapper('find_x');
var _find_y = Module['_find_y'] = createExportWrapper('find_y');
var _find_new_x = Module['_find_new_x'] = createExportWrapper('find_new_x');
var _find_new_y = Module['_find_new_y'] = createExportWrapper('find_new_y');
var _fflush = createExportWrapper('fflush');
var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports['emscripten_stack_init'])();
var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'])();
var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'])();
var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'])();
var stackSave = createExportWrapper('stackSave');
var stackRestore = createExportWrapper('stackRestore');
var stackAlloc = createExportWrapper('stackAlloc');
var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'])();


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module['ccall'] = ccall;
var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'zeroMemory',
  'exitJS',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'growMemory',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'initRandomFill',
  'randomFill',
  'getCallstack',
  'emscriptenLog',
  'convertPCtoSourceLocation',
  'readEmAsmArgs',
  'jstoi_q',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'cwrap',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'stackTrace',
  'getEnvStrings',
  'checkWasiClock',
  'flush_NO_FILESYSTEM',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'safeSetTimeout',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'setMainLoop',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar',
  'FS_createDataFile',
  'FS_unlink',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'SDL_unicode',
  'SDL_ttfContext',
  'SDL_audio',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'setErrNo',
  'demangle',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'FS_createFolder',
  'FS_createPath',
  'FS_createLazyFile',
  'FS_createLink',
  'FS_createDevice',
  'FS_readFile',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'stackAlloc',
  'stackSave',
  'stackRestore',
  'getTempRet0',
  'setTempRet0',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'ptrToString',
  'ENV',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'ERRNO_CODES',
  'ERRNO_MESSAGES',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'UNWIND_CACHE',
  'readEmAsmArgsArray',
  'jstoi_s',
  'wasmTable',
  'noExitRuntime',
  'getCFunc',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'UTF16Decoder',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'ExitStatus',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'Browser',
  'getPreloadedImageData__data',
  'wget',
  'SYSCALLS',
  'preloadPlugins',
  'FS_stdin_getChar_buffer',
  'FS',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'allocateUTF8',
  'allocateUTF8OnStack',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();


// end include: postamble.js
