/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * Created by nicolasmondon on 02/02/15.\n */\n\n'use strict';\n\n// style\n__webpack_require__(13);\n\n// vendors\nvar d3 = __webpack_require__(1);\nvar $ = __webpack_require__(2);\nvar _ = __webpack_require__(3);\nvar P = __webpack_require__(4);\n\n// services\nvar promiseGeojson = __webpack_require__(5);\nvar promiseData = __webpack_require__(6);\n\n// components\nvar map = __webpack_require__(7);\n\n// retrieve data\nP.all([\n    promiseData,\n    promiseGeojson\n]).then(function(d){\n    map.init(d[1]);\n    map.render();\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./web_modules/main.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./web_modules/main.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = d3;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"d3\"\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22d3%22?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = jQuery;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"jQuery\"\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22jQuery%22?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = _;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"_\"\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22_%22?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = P;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"P\"\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22P%22?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * Created by nicolasmondon on 02/02/15.\n */\n\n'use strict';\nvar P = __webpack_require__(4);\nvar d3 = __webpack_require__(1);\n\nvar promise = new P(function(resolve){\n    d3.json('data/topo/world-50m.json', resolve);\n});\n\nmodule.exports = promise;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./web_modules/services/get-json-map.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./web_modules/services/get-json-map.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * Created by nicolasmondon on 02/02/15.\n */\n\n'use strict';\n\nvar P = __webpack_require__(4);\nvar d3 = __webpack_require__(1);\n\nvar promise = new P(function(resolve){\n    d3.csv('data/UEvsOTAN.csv', resolve);\n});\n\nmodule.exports = promise;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./web_modules/services/get-csv-data.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./web_modules/services/get-csv-data.js?");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * Created by nicolasmondon on 02/02/15.\n */\n\n'use strict';\n\n// style\n__webpack_require__(9);\n\nvar d3 = __webpack_require__(1);\nvar topojson = __webpack_require__(8);\nvar $ = __webpack_require__(2);\nvar _ = __webpack_require__(3);\n\n\nvar $container = $('#map');\nvar w = $container.width(),\n    h = $container.height();\nvar svgMap;\nvar dataTopojson;\n\n\nvar trans = [w/2, h/2];\n\nvar projection = d3.geo.stereographic()\n    .scale(1600)\n    .center([-5, 55])\n    .rotate([-20, 0])\n    .clipAngle(180 - 1e-4)\n    .clipExtent([[0, 0], [w, h]])\n    .precision(.1);\n\nvar simplify = function(trans){\n    return d3.geo.transform({\n        point: function(x, y, z) {\n            if (z >= .2){\n                var coords = projection.translate(trans)([x,y]);\n                this.stream.point(coords[0], coords[1]);\n            }\n        }\n    });\n};\n\n\n// drag\nvar coordDrag;\nvar dragMap = d3.behavior.drag()\n    .on('dragstart', function () {\n        coordDrag = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];\n    })\n    .on('drag', function () {\n        if (coordDrag) {\n            var path = d3.geo.path()\n                .projection(simplify([\n                    w / 2 + d3.event.sourceEvent.pageX - coordDrag[0],\n                    h / 2 + d3.event.sourceEvent.pageY - coordDrag[1]\n                ]));\n            d3.selectAll('path').attr('d', path);\n        }\n    });\n\nfunction init(datajson) {\n    dataTopojson = datajson;\n\n    svgMap = d3.select('#map').append('svg')\n        .attr('class', 'svg-map')\n        .call(dragMap);\n};\n\nfunction render() {\n\n    var path = d3.geo.path()\n        .projection(simplify(trans));\n\n    // compute the importance of each point\n    var topoSimple = topojson.presimplify(dataTopojson);\n\n\n    var countries = svgMap.selectAll('.country').data(topojson.feature(topoSimple, topoSimple.objects.countries).features);\n    countries.enter().append('path')\n        .attr('class', 'country')\n        .attr('id', function (country) {\n            return country.id;\n        })\n        .attr('d', path)\n        .style('stroke', 'black');\n};\n\nmodule.exports = {\n    init: init,\n    render: render\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./web_modules/components/map.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./web_modules/components/map.js?");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = topojson;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"topojson\"\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22topojson%22?");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(10);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(11)(content, {});\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tmodule.hot.accept(\"!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map.scss\", function() {\n\t\tvar newContent = require(\"!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map.scss\");\n\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\tupdate(newContent);\n\t});\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./sass/map.scss\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./sass/map.scss?");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(12)();\nexports.push([module.id, \"#map{width:100%;height:100%}.svg-map{width:100%;height:100%}\", \"\"]);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader!./~/sass-loader!./sass/map.scss\n ** module id = 10\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./sass/map.scss?./~/css-loader!./~/sass-loader");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nvar stylesInDom = {},\r\n\tmemoize = function(fn) {\r\n\t\tvar memo;\r\n\t\treturn function () {\r\n\t\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\r\n\t\t\treturn memo;\r\n\t\t};\r\n\t},\r\n\tisIE9 = memoize(function() {\r\n\t\treturn /msie 9\\b/.test(window.navigator.userAgent.toLowerCase());\r\n\t}),\r\n\tgetHeadElement = memoize(function () {\r\n\t\treturn document.head || document.getElementsByTagName(\"head\")[0];\r\n\t}),\r\n\tsingletonElement = null,\r\n\tsingletonCounter = 0;\r\n\r\nmodule.exports = function(list, options) {\r\n\tif(false) {\r\n\t\tif(typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\r\n\t}\r\n\r\n\toptions = options || {};\r\n\t// Force single-tag solution on IE9, which has a hard limit on the # of <style>\r\n\t// tags it will allow on a page\r\n\tif (typeof options.singleton === \"undefined\") options.singleton = isIE9();\r\n\r\n\tvar styles = listToStyles(list);\r\n\taddStylesToDom(styles, options);\r\n\r\n\treturn function update(newList) {\r\n\t\tvar mayRemove = [];\r\n\t\tfor(var i = 0; i < styles.length; i++) {\r\n\t\t\tvar item = styles[i];\r\n\t\t\tvar domStyle = stylesInDom[item.id];\r\n\t\t\tdomStyle.refs--;\r\n\t\t\tmayRemove.push(domStyle);\r\n\t\t}\r\n\t\tif(newList) {\r\n\t\t\tvar newStyles = listToStyles(newList);\r\n\t\t\taddStylesToDom(newStyles, options);\r\n\t\t}\r\n\t\tfor(var i = 0; i < mayRemove.length; i++) {\r\n\t\t\tvar domStyle = mayRemove[i];\r\n\t\t\tif(domStyle.refs === 0) {\r\n\t\t\t\tfor(var j = 0; j < domStyle.parts.length; j++)\r\n\t\t\t\t\tdomStyle.parts[j]();\r\n\t\t\t\tdelete stylesInDom[domStyle.id];\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n}\r\n\r\nfunction addStylesToDom(styles, options) {\r\n\tfor(var i = 0; i < styles.length; i++) {\r\n\t\tvar item = styles[i];\r\n\t\tvar domStyle = stylesInDom[item.id];\r\n\t\tif(domStyle) {\r\n\t\t\tdomStyle.refs++;\r\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\r\n\t\t\t}\r\n\t\t\tfor(; j < item.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tvar parts = [];\r\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\r\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction listToStyles(list) {\r\n\tvar styles = [];\r\n\tvar newStyles = {};\r\n\tfor(var i = 0; i < list.length; i++) {\r\n\t\tvar item = list[i];\r\n\t\tvar id = item[0];\r\n\t\tvar css = item[1];\r\n\t\tvar media = item[2];\r\n\t\tvar sourceMap = item[3];\r\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\r\n\t\tif(!newStyles[id])\r\n\t\t\tstyles.push(newStyles[id] = {id: id, parts: [part]});\r\n\t\telse\r\n\t\t\tnewStyles[id].parts.push(part);\r\n\t}\r\n\treturn styles;\r\n}\r\n\r\nfunction createStyleElement() {\r\n\tvar styleElement = document.createElement(\"style\");\r\n\tvar head = getHeadElement();\r\n\tstyleElement.type = \"text/css\";\r\n\thead.appendChild(styleElement);\r\n\treturn styleElement;\r\n}\r\n\r\nfunction addStyle(obj, options) {\r\n\tvar styleElement, update, remove;\r\n\r\n\tif (options.singleton) {\r\n\t\tvar styleIndex = singletonCounter++;\r\n\t\tstyleElement = singletonElement || (singletonElement = createStyleElement());\r\n\t\tupdate = applyToSingletonTag.bind(null, styleElement, styleIndex, false);\r\n\t\tremove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);\r\n\t} else {\r\n\t\tstyleElement = createStyleElement();\r\n\t\tupdate = applyToTag.bind(null, styleElement);\r\n\t\tremove = function () {\r\n\t\t\tstyleElement.parentNode.removeChild(styleElement);\r\n\t\t};\r\n\t}\r\n\r\n\tupdate(obj);\r\n\r\n\treturn function updateStyle(newObj) {\r\n\t\tif(newObj) {\r\n\t\t\tif(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)\r\n\t\t\t\treturn;\r\n\t\t\tupdate(obj = newObj);\r\n\t\t} else {\r\n\t\t\tremove();\r\n\t\t}\r\n\t};\r\n}\r\n\r\nfunction replaceText(source, id, replacement) {\r\n\tvar boundaries = [\"/** >>\" + id + \" **/\", \"/** \" + id + \"<< **/\"];\r\n\tvar start = source.lastIndexOf(boundaries[0]);\r\n\tvar wrappedReplacement = replacement\r\n\t\t? (boundaries[0] + replacement + boundaries[1])\r\n\t\t: \"\";\r\n\tif (source.lastIndexOf(boundaries[0]) >= 0) {\r\n\t\tvar end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;\r\n\t\treturn source.slice(0, start) + wrappedReplacement + source.slice(end);\r\n\t} else {\r\n\t\treturn source + wrappedReplacement;\r\n\t}\r\n}\r\n\r\nfunction applyToSingletonTag(styleElement, index, remove, obj) {\r\n\tvar css = remove ? \"\" : obj.css;\r\n\r\n\tif(styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);\r\n\t} else {\r\n\t\tvar cssNode = document.createTextNode(css);\r\n\t\tvar childNodes = styleElement.childNodes;\r\n\t\tif (childNodes[index]) styleElement.removeChild(childNodes[index]);\r\n\t\tif (childNodes.length) {\r\n\t\t\tstyleElement.insertBefore(cssNode, childNodes[index]);\r\n\t\t} else {\r\n\t\t\tstyleElement.appendChild(cssNode);\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction applyToTag(styleElement, obj) {\r\n\tvar css = obj.css;\r\n\tvar media = obj.media;\r\n\tvar sourceMap = obj.sourceMap;\r\n\r\n\tif(sourceMap && typeof btoa === \"function\") {\r\n\t\ttry {\r\n\t\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(JSON.stringify(sourceMap)) + \" */\";\r\n\t\t\tcss = \"@import url(\\\"data:text/css;base64,\" + btoa(css) + \"\\\")\";\r\n\t\t} catch(e) {}\r\n\t}\r\n\r\n\tif(media) {\r\n\t\tstyleElement.setAttribute(\"media\", media)\r\n\t}\r\n\r\n\tif(styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = css;\r\n\t} else {\r\n\t\twhile(styleElement.firstChild) {\r\n\t\t\tstyleElement.removeChild(styleElement.firstChild);\r\n\t\t}\r\n\t\tstyleElement.appendChild(document.createTextNode(css));\r\n\t}\r\n}\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/style-loader/addStyles.js\n ** module id = 11\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/style-loader/addStyles.js?");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = function() {\r\n\tvar list = [];\r\n\tlist.toString = function toString() {\r\n\t\tvar result = [];\r\n\t\tfor(var i = 0; i < this.length; i++) {\r\n\t\t\tvar item = this[i];\r\n\t\t\tif(item[2]) {\r\n\t\t\t\tresult.push(\"@media \" + item[2] + \"{\" + item[1] + \"}\");\r\n\t\t\t} else {\r\n\t\t\t\tresult.push(item[1]);\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn result.join(\"\");\r\n\t};\r\n\treturn list;\r\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader/cssToString.js\n ** module id = 12\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/css-loader/cssToString.js?");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(14);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(11)(content, {});\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tmodule.hot.accept(\"!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/reset.scss\", function() {\n\t\tvar newContent = require(\"!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/reset.scss\");\n\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\tupdate(newContent);\n\t});\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./sass/reset.scss\n ** module id = 13\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./sass/reset.scss?");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(12)();\nexports.push([module.id, \"body,html{width:100%;height:100%;margin:0;padding:0}\", \"\"]);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader!./~/sass-loader!./sass/reset.scss\n ** module id = 14\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./sass/reset.scss?./~/css-loader!./~/sass-loader");

/***/ }
/******/ ])