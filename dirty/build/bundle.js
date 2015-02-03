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

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	
	// webpack path
	__webpack_require__(27);
	// style
	__webpack_require__(9);
	
	
	
	// vendors
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var P = __webpack_require__(4);
	
	// services
	var promiseGeojson = __webpack_require__(5);
	var promiseData = __webpack_require__(6);
	
	// components
	var map = __webpack_require__(7);
	var controlPanel = __webpack_require__(8);
	
	// retrieve data
	P.all([
	    promiseData,
	    promiseGeojson
	]).then(function (d) {
	    map.init(d[1]);
	    map.render();
	    controlPanel.init(d[0]);
	    controlPanel.render();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = d3;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = jQuery;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = P;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	var P = __webpack_require__(4);
	var d3 = __webpack_require__(1);
	var topojson = __webpack_require__(11);
	var projection = __webpack_require__(13);
	var simplify = __webpack_require__(14);
	
	var promise = new P(function (resolve) {
	    d3.json('data/topo/world-50m.json', function (data) {
	        // compute important arcs
	        var presimplified = topojson.presimplify(data);
	
	        // transform all MutliPolygon as an array of Polygon
	        // as it, we just have Polygons
	        data.objects.countries.geometries = _.flatten(data.objects.countries.geometries.map(function(g){
	            // possibly non unique country id : cid
	            g.cid = g.id;
	            // multi polygons
	            if(g.type === 'MultiPolygon'){
	                return _.range(g.arcs.length).map(function(p, i){
	                    return _.extend({}, g, {
	                        type: 'Polygon',
	                        arcs: g.arcs[i],
	                        // unique id
	                        id: g.id + '_' + i
	                    });
	                });
	            }
	            // simple polygons
	            else return _.extend({}, g, {
	                // unique id
	                id: g.id + '_0'
	            });
	        }), true);
	
	
	        // remove too small pieces without neighbour
	        // first, find all polygons without neighbours
	        var path = d3.geo.path()
	            .projection(simplify(.1, projection));
	        var features = topojson.feature(data, data.objects.countries).features;
	        var neighbors = topojson.neighbors(data.objects.countries.geometries);
	        data.objects.countries.geometries = data.objects.countries.geometries.filter(function(g, i){
	            return neighbors[i].length > 0  // neighbours
	                || path.area(features[i]) > 100; // not too small
	        });
	
	
	
	
	        resolve(presimplified);
	    });
	});
	
	
	module.exports = promise;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	
	var P = __webpack_require__(4);
	var d3 = __webpack_require__(1);
	var _ = __webpack_require__(3);
	
	function toNum(str){
	    return !!str ? parseInt(str) : null
	};
	
	var promise = new P(function(resolve){
	    d3.csv('data/UEvsOTAN.csv', function(data){
	        // transform
	        data = data.map(function(el){
	            return _.extend({}, el, {
	                OTAN: toNum(el.OTAN),
	                PPP: toNum(el.PPP),
	                UE: toNum(el.UE),
	                'candidature non officielle': toNum(el['candidature non officielle']),
	                'candidature officielle': toNum(el['candidature officielle'])
	            });
	        });
	
	        resolve(data);
	
	        /*resolve(_.groupBy(data, function(c){
	            return c.UE;
	        }));*/
	    });
	});
	
	module.exports = promise;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	
	// style
	__webpack_require__(16);
	
	var d3 = __webpack_require__(1);
	var topojson = __webpack_require__(11);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	
	
	
	var $container = $('#map');
	var w = $container.width(),
	    h = $container.height();
	
	var svgMap;
	var gCountry;
	var dataTopojson;
	
	// translation for gCountry
	var trans = [0, 0];
	// TODO compute responsive behavior
	// projection for countries
	var projection = __webpack_require__(13).translate([w / 2, h / 2]);
	// simplify shapes
	var simplify = __webpack_require__(14);
	
	// drag on map
	var coordDrag;
	// TODO constrain drag
	// TODO reduce quality on drag to improve perfs
	var dragMap = d3.behavior.drag()
	    .on('dragstart', function () {
	        coordDrag = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
	    })
	    .on('drag', function () {
	        if (coordDrag) {
	            gCountry.attr('transform', 'translate(' + [
	                trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
	                trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
	            ] + ')');
	        }
	    })
	    .on('dragend', function () {
	        trans = [
	            trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
	            trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
	        ];
	        console.log(trans);
	    });
	
	function init(datajson) {
	
	    dataTopojson = datajson;
	
	    svgMap = d3.select('#map').append('svg')
	        .attr('class', 'svg-map')
	        .call(dragMap);
	
	    gCountry = svgMap.append('g')
	        .attr('class', 'g-country')
	        .attr('transform', 'translate(' + trans + ')');
	};
	
	function render() {
	
	    var path = d3.geo.path()
	        .projection(simplify(.05, projection));
	
	    var countries = gCountry.selectAll('.country').data(topojson.feature(dataTopojson, dataTopojson.objects.countries).features);
	    countries.enter().append('path')
	        .attr('class', 'country')
	        .attr('id', function (country) {
	            return country.id;
	        })
	        .attr('d', path)
	        .style('stroke', 'black');
	};
	
	module.exports = {
	    init: init,
	    render: render
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	// style
	__webpack_require__(18);
	
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	
	// sub modules
	var listCountry = __webpack_require__(15);
	
	var $el;
	var svgTimeline;
	var $svgTimeline;
	var gListCountry;
	
	function init(csvData) {
	    $el = $('#control-panel');
	    // TODO opacity on hover
	    $el.hammer().on('swiperight', function () {
	        $el.velocity({
	            left: '90%'
	        }, {
	            duration: 200
	        });
	    }).on('swipeleft', function () {
	        $el.velocity({
	            left: '55%'
	        }, {
	            duration: 200,
	            easing: 'easeOutQuart'
	        });
	    });
	
	    svgTimeline = d3.select('#control-panel').append('svg')
	        .attr('class', 'svg-timeline');
	    $svgTimeline = $('.svg-timeline');
	
	    //
	    listCountry.init(csvData,
	        svgTimeline.append('g')
	            .attr('class', 'g-list-country')
	        .attr('transform', 'translate(' + [0, $svgTimeline.height()/4] + ')'),
	        $svgTimeline.width() / 4,
	        $svgTimeline.height()*3/4);
	};
	
	function render() {
	    listCountry.render();
	};
	
	module.exports = {
	    init: init,
	    render: render
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/reset.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/reset.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	exports.push([module.id, "body,html{width:100%;height:100%;margin:0;padding:0}@font-face{font-family:'karlaregular';src:url("+__webpack_require__(23)+");src:url("+__webpack_require__(23)+"?#iefix) format('embedded-opentype'),url("+__webpack_require__(26)+") format('woff'),url("+__webpack_require__(24)+") format('truetype'),url("+__webpack_require__(25)+"#karlaregular) format('svg');font-weight:normal;font-style:normal;}", ""]);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = topojson;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	var d3 = __webpack_require__(1);
	
	module.exports =  d3.geo.stereographic()
	    .scale(1600)
	    .center([35, 50]);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	var d3 = __webpack_require__(1);
	
	module.exports = function (area, projection) {
	    return d3.geo.transform({
	        point: function (x, y, z) {
	            if (z >= area) {
	                var coords = projection([x, y]);
	                this.stream.point(coords[0], coords[1]);
	            }
	        }
	    });
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	// style
	__webpack_require__(20);
	
	
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	
	var svg;
	var root;
	var data;
	var w, h;
	function init(dataPar, rootPar, wPar, hPar) {
	    root = rootPar;
	    data = dataPar;
	    w = wPar;
	    h = hPar;
	};
	
	function render() {
	
	    var groupAdhesionUEHash = _.groupBy(data, function (c) {
	        return c.UE;
	    });
	
	    var currentFirstCountryInd = 0;
	    var groupAdhesionUEData = _.keys(groupAdhesionUEHash).map(function (key, i) {
	        var obj = {
	            key: key,
	            countries: groupAdhesionUEHash[key],
	            firstCountryInd: currentFirstCountryInd
	        };
	        currentFirstCountryInd += groupAdhesionUEHash[key].length;
	        return obj;
	    });
	
	    console.log(groupAdhesionUEData);
	
	    var marginHeightGroup = 10;
	    var scaleMarginHeightGroup = d3.scale.linear()
	        .domain([0, data.length-1])
	        .rangeRound([0, h - (groupAdhesionUEData.length - 1) * marginHeightGroup]);
	
	    var gGroupAdhesionUE = root.selectAll('.g-group-adhesion-ue').data(groupAdhesionUEData);
	    gGroupAdhesionUE.enter().append('g')
	        .attr('class', 'g-group-adhesion-ue')
	        .attr('transform', function (g, i) {
	            return 'translate(' + [
	                    0,
	                    scaleMarginHeightGroup(g.firstCountryInd) + marginHeightGroup*i
	                ] + ')';
	        });
	
	    var countryLabels = gGroupAdhesionUE.selectAll('.country-label').data(function (d) {
	        return d.countries;
	    });
	    countryLabels.enter().append('text')
	        .attr('class', 'country-label')
	        .attr('x', 10)
	        .attr('y', function (c, i) {
	            return scaleMarginHeightGroup(i);
	        })
	        .text(function (c) {
	            return c.nom;
	        })
	
	
	};
	
	module.exports = {
	    init: init,
	    render: render
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	exports.push([module.id, "#map{width:100%;height:100%}.svg-map{width:100%;height:100%;background-color:#EBF0F7}.svg-map .g-country .country{stroke:#ccc;fill:white;stroke-width:0.25px;stroke-opacity:0.8}", ""]);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/control-panel.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/control-panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	exports.push([module.id, "#control-panel{position:fixed;background-color:rgba(255,255,255,0.85);width:45%;height:100%;z-index:2;top:0%;left:55%;border-left:#ccc 1px solid}#control-panel .svg-timeline{width:100%;height:100%}", ""]);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(21);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/list-country.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/list-country.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	exports.push([module.id, ".g-list-country .country-label{text-anchor:start;dominant-baseline:middle;font-size:10px;font-family:karlaregular}", ""]);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9b32ddf7a8f92141181778d032317807.eot"

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "b39ab43702ee55c707e54327b9a8251f.ttf"

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c2e4a81907170a84e0ef7079904653c6.svg"

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "25635a84225e55513e4882a4240e1dd5.woff"

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	var $ = __webpack_require__(2);
	
	__webpack_require__.p = $('#webpack-loader').attr('src').slice(0, $('#webpack-loader').attr('src').lastIndexOf('/') + 1);


/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map