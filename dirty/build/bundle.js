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
	__webpack_require__(6);
	// style
	__webpack_require__(11);
	
	
	// vendors
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var P = __webpack_require__(4);
	var React = __webpack_require__(5);
	
	// services
	var promiseGeojson = __webpack_require__(7);
	var promiseData = __webpack_require__(8);
	var yearExtent = __webpack_require__(36);
	
	// components
	var MapComp = __webpack_require__(9);
	var ListCountryContainer = __webpack_require__(10);
	var Timeline = __webpack_require__(33);
	
	
	// retrieve data
	P.all([
	    promiseData,
	    promiseGeojson
	]).then(function (d) {
	
	    $(function () {
	        React.render(
	            React.createElement(MapComp, {countries: d[1]}),
	            $('#map').get(0)
	        );
	
	        React.render(
	            React.createElement(ListCountryContainer, {data: d[0]}),
	            $('#list-country').get(0)
	        );
	
	        React.render(
	            React.createElement(Timeline, {yearExtent: yearExtent(d[0])}),
	            $('#timeline').get(0)
	        );
	
	    });
	
	
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

	module.exports = React;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	var $ = __webpack_require__(2);
	
	__webpack_require__.p = $('#webpack-loader').attr('src').slice(0, $('#webpack-loader').attr('src').lastIndexOf('/') + 1);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	var P = __webpack_require__(4);
	var d3 = __webpack_require__(1);
	var topojson = __webpack_require__(13);
	var projection = __webpack_require__(15);
	var simplify = __webpack_require__(16);
	
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
/* 8 */
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
	        data = data.filter(function(el){
	            return toNum(el.UE) !== null;
	        }).map(function(el){
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(23);
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	var topojson = __webpack_require__(13);
	var _ = __webpack_require__(3);
	
	var Country = __webpack_require__(25);
	
	var trans = [0, 0];
	
	/**
	 * @props countries
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    componentDidMount: function(){
	        var svg = d3.select('.svg-map');
	        var gCountry = svg.select('.g-country');
	        var coordDrag;
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
	            });
	        svg.call(dragMap);
	    },
	    render: function () {
	        var features = topojson.feature(this.props.countries, this.props.countries.objects.countries).features;
	        return (
	            React.createElement("svg", {className: 'svg-map'}, 
	                React.createElement("g", {className: 'g-country'}, 
	                features.map(function (feature, i) {
	                    return React.createElement(Country, {
	                        feature: feature, 
	                        key: i})
	                })
	                )
	            )
	
	        );
	    }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(17);
	__webpack_require__(19);
	
	var React = __webpack_require__(5);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	
	var GroupCountry = __webpack_require__(21);
	var Country = __webpack_require__(22);
	
	/**
	 * @props data
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    computeGroups: function(){
	        var groupAdhesionUEHash = _.groupBy(this.props.data, function (c) {
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
	        return groupAdhesionUEData;
	    },
	    componentDidMount: function(){
	        // TODO : where to put this ?
	        var $el = $('#control-panel');
	        // TODO opacity on hover
	        $el.hammer().on('swiperight', function () {
	            $el.velocity({
	                left: '90%'
	            }, {
	                duration: 200
	            });
	        }).on('swipeleft', function () {
	            $el.velocity({
	                left: '50%'
	            }, {
	                duration: 200,
	                easing: 'easeOutQuart'
	            });
	        });
	    },
	    render: function () {
	        var groupAdhesionUEData = this.computeGroups();
	        return (
	            React.createElement("div", {className: "list-country-container"}, 
	                groupAdhesionUEData.map(function(g, kg){
	                    return (
	                        React.createElement(GroupCountry, {key: kg}, 
	                            
	                                g.countries.map(function(c, kc){
	                                    return React.createElement(Country, {country: c, key: kc});
	                                })
	                            
	                        )
	                    );
	                })
	            )
	        );
	    }
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	exports.push([module.id, "body,html{width:100%;height:100%;margin:0;padding:0}@font-face{font-family:'karlaregular';src:url("+__webpack_require__(29)+");src:url("+__webpack_require__(29)+"?#iefix) format('embedded-opentype'),url("+__webpack_require__(32)+") format('woff'),url("+__webpack_require__(30)+") format('truetype'),url("+__webpack_require__(31)+"#karlaregular) format('svg');font-weight:normal;font-style:normal;}", ""]);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = topojson;

/***/ },
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	exports.push([module.id, "#control-panel{overflow:scroll;position:fixed;background-color:rgba(255,255,255,0.65);width:50%;height:100%;z-index:2;top:0%;left:50%;border-left:#ccc 1px solid}", ""]);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	exports.push([module.id, ".list-country-container .group-country{margin:30px 5px;box-sizing:content-box}.list-country-container .group-country .country{height:15px;width:100%}.list-country-container .group-country .country .grey-line{shape-rendering:crispEdges;stroke:#ccc;stroke-width:0.5}.list-country-container .group-country .country .country-label{text-anchor:start;dominant-baseline:text-before-edge;font-size:14px;font-family:karlaregular}", ""]);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	
	module.exports = React.createClass({displayName: "exports",
	    render: function () {
	        return (
	            React.createElement("div", {className: 'group-country'}, 
	                this.props.children
	            )
	        );
	    }
	
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	
	var GreyLine = __webpack_require__(27);
	var Label = __webpack_require__(28);
	
	/**
	 * @props country
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function(){
	        console.log('country');
	        return (
	
	            React.createElement("svg", {className: "country"}, 
	                React.createElement(GreyLine, null), 
	                React.createElement(Label, {text: this.props.country.nom})
	            )
	        );
	    }
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	exports.push([module.id, "#map{width:100%;height:100%}#map .svg-map{width:100%;height:100%;background-color:#EBF0F7}#map .svg-map .g-country .country{stroke:#ccc;fill:white;stroke-width:0.25px;stroke-opacity:0.8}", ""]);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	
	var simplify = __webpack_require__(16);
	var projection = __webpack_require__(15);
	var path = d3.geo.path()
	    .projection(simplify(.05, projection));
	
	/**
	 * @props feature
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    getInitialState: function(){
	        return {
	            fill: 'white'
	        };
	    },
	    handleMouseOver: function(){
	        /*this.setState({
	            fill: 'red'
	        });*/
	    },
	    render: function(){
	        return (
	            React.createElement("path", {className: 'country', d: path(this.props.feature), fill: this.state.fill, onMouseOver: this.handleMouseOver})
	        );
	    }
	});

/***/ },
/* 26 */
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	
	module.exports = React.createClass({displayName: "exports",
	    render: function(){
	        return (
	            React.createElement("line", {className: "grey-line", x1: 10, x2: 2000, y1: 7.5, y2: 7.5})
	        );
	    }
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	
	/**
	 * @props text
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function () {
	        return (
	            React.createElement("text", {className: 'country-label', x: "10"}, 
	                this.props.text
	            )
	        );
	    }
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9b32ddf7a8f92141181778d032317807.eot"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "b39ab43702ee55c707e54327b9a8251f.ttf"

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c2e4a81907170a84e0ef7079904653c6.svg"

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "25635a84225e55513e4882a4240e1dd5.woff"

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// style
	__webpack_require__(34);
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	
	var marginX = 20;
	var w;
	var h;
	
	/**
	 * @props yearExtent
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function () {
	
	        var w = $('#timeline').width();
	        var h = $('#timeline').height();
	
	        var scaleXYear = d3.scale.linear()
	            .domain(this.props.yearExtent)
	            .rangeRound([20, w - 20]);
	
	        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);
	
	
	        return (
	            React.createElement("svg", {className: "svg-timeline"}, 
	                React.createElement("line", {className: "pick", 
	                    x1: scaleXYear(this.props.yearExtent[0]), 
	                    x2: scaleXYear(this.props.yearExtent[1]), 
	                    y1: h / 2 + 3, 
	                    y2: h / 2 + 3}), 
	                years.map(function (year, k) {
	                    return (
	                        React.createElement("line", {className: "pick", 
	                            key: k, 
	                            x1: scaleXYear(year), 
	                            x2: scaleXYear(year), 
	                            y1: h / 2, 
	                            y2: h / 2 - (year % 5 === 0 ? 5 : 3)})
	                    );
	                }), 
	                years.filter(function (y) {
	                    return y % 5 === 0
	                }).map(function (year, k) {
	                    return (
	                        React.createElement("text", {className: "year", x: scaleXYear(year), y: h/2 - 10}, 
	                            year
	                        )
	                    );
	                })
	            )
	        );
	    }
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(35);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/timeline.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/timeline.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	exports.push([module.id, "#timeline{z-index:3;position:fixed;left:0;bottom:0;width:50%;height:100px}#timeline .svg-timeline{width:100%;height:100%}#timeline .svg-timeline .pick{stroke:black;shape-rendering:crispEdges;stroke-width:0.5px}#timeline .svg-timeline .year{text-anchor:middle;dominant-baseline:middle;font-size:12px;font-family:karlaregular;font-weight:lighter;opacity:0.8}", ""]);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use script';
	
	var d3 = __webpack_require__(1);
	var _ = __webpack_require__(3);
	
	var events = [
	    'OTAN', 'PPP', 'UE', 'candidature non officielle', 'candidature officielle'
	];
	
	function compute(countries){
	    return [
	        d3.min(countries, function(country){
	            return d3.min(events, function(event){
	                var year = parseInt(country[event]);
	                return _.isNumber(year) ? year : 9999;
	            });
	        }),
	        d3.max(countries, function(country){
	            return d3.max(events, function(event){
	                var year = parseInt(country[event]);
	                return _.isNumber(year) ? year : 0;
	            });
	        })
	    ];
	};
	
	module.exports = compute;

/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map