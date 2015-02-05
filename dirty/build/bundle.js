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
	__webpack_require__(16);
	
	
	// vendors
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var P = __webpack_require__(4);
	var React = __webpack_require__(5);
	
	// services
	var promiseGeojson = __webpack_require__(7);
	var promiseData = __webpack_require__(8);
	var yearExtentService = __webpack_require__(9);
	
	// components
	var MapPanel = __webpack_require__(10);
	var Map = __webpack_require__(11);
	var Timeline = __webpack_require__(12);
	
	var RightPanel = __webpack_require__(13);
	var SmallTimeline = __webpack_require__(14);
	var ListCountryContainer = __webpack_require__(15);
	
	
	/**
	 * @props countries, jsonCountries, yearExtent
	 * @type {*|Function}
	 */
	var Root = React.createClass({displayName: "Root",
	    getInitialState: function () {
	        return {
	            currentYear: this.props.yearExtent[0]
	        }
	    },
	    setCurrentYear: function (year) {
	        this.setState({
	            currentYear: year
	        });
	    },
	    shouldComponentUpdate: function (nextProps, nextState) {
	        return !_.isEqual(this.state, nextState);
	    },
	    render: function () {
	        return (
	            React.createElement("div", {className: "root", style: {
	                width: '100%',
	                height: '100%'
	            }}, 
	                React.createElement(MapPanel, null, 
	                    React.createElement(Map, {countries: this.props.jsonCountries, 
	                        data: this.props.countries, 
	                        currentYear: this.state.currentYear}), 
	                    React.createElement(Timeline, {yearExtent: this.props.yearExtent, 
	                        currentYear: this.state.currentYear, 
	                        setCurrentYear: this.setCurrentYear})
	                ), 
	
	                React.createElement(RightPanel, null, 
	                    React.createElement(SmallTimeline, {yearExtent: this.props.yearExtent, 
	                        currentYear: this.state.currentYear}), 
	                    React.createElement(ListCountryContainer, {data: this.props.countries, 
	                        currentYear: this.state.currentYear})
	                )
	            )
	        );
	
	    }
	});
	
	
	// retrieve data
	P.all([
	    promiseData,
	    promiseGeojson
	]).then(function (d) {
	
	
	    var yearExtent = yearExtentService(d[0]);
	    var currentYear =
	
	        $(function () {
	            React.render(
	                React.createElement(Root, {jsonCountries: d[1], 
	                    countries: d[0], 
	                    yearExtent: yearExtent}),
	                $('body').get(0)
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
	var topojson = __webpack_require__(18);
	var projection = __webpack_require__(20);
	var simplify = __webpack_require__(21);
	
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(26);
	
	var React = __webpack_require__(5);
	
	module.exports = React.createClass({displayName: "exports",
	    render: function(){
	        return (
	            React.createElement("div", {id: "map-panel"}, 
	                this.props.children
	            )
	        );
	    }
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(23);
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	var topojson = __webpack_require__(18);
	var _ = __webpack_require__(3);
	
	var Country = __webpack_require__(25);
	
	var trans = [0, 0];
	
	/**
	 * @props countries
	 * @props data
	 * @type {*|Function}
	 */
	var Map = React.createClass({displayName: "Map",
	    statics: {
	        getDataByFeature: function(feature, data){
	            var cid = feature.id.match(/(.+)_/)[1];
	            return _.find(data, function(d){
	                return d.ID === cid;
	            });
	        }
	    },
	    componentDidMount: function () {
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
	            React.createElement("div", {id: "map"}, 
	                React.createElement("svg", {className: 'svg-map'}, 
	                    React.createElement("g", {className: 'g-country'}, 
	                features.map(function (feature, i) {
	                    return React.createElement(Country, {
	                        currentYear: this.props.currentYear, 
	                        feature: feature, 
	                        data: Map.getDataByFeature(feature, this.props.data), 
	                        key: i})
	                }.bind(this))
	                    )
	                )
	            )
	
	        );
	    }
	});
	
	module.exports = Map;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// style
	__webpack_require__(28);
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	
	var Cursor = __webpack_require__(30);
	
	var marginX = 20;
	var w;
	var h;
	
	/**
	 * @props yearExtent
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function () {
	
	        var w = $(window).width() / 2;
	        var h = 100;
	
	        var scaleXYear = d3.scale.linear()
	            .domain(this.props.yearExtent)
	            .rangeRound([20, w - 20]);
	
	        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);
	
	        return (
	            React.createElement("div", {id: "timeline"}, 
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
	                            React.createElement("text", {className: "year", x: scaleXYear(year), y: h / 2 - 10, key: k}, 
	                                year
	                            )
	                        );
	                    }), 
	                    React.createElement(Cursor, {size: 5, 
	                        y: h / 2 + 5, 
	                        constrain: [marginX, w - marginX], 
	                        currentYear: this.props.currentYear, 
	                        yearExtent: this.props.yearExtent, 
	                        setCurrentYear: this.props.setCurrentYear})
	                )
	            )
	        );
	    }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(31);
	
	var React = __webpack_require__(5);
	
	module.exports = React.createClass({displayName: "exports",
	    componentDidMount: function () {
	        var $el = $('#right-panel');
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
	        return (
	            React.createElement("div", {id: "right-panel"}, 
	                this.props.children
	            )
	        );
	    }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(33);
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	var $ = __webpack_require__(2);
	
	var math = __webpack_require__(22);
	
	/**
	 * @props currentYear
	 * @props yearExtent
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function () {
	
	        var w = $(window).width() / 2;
	        var h = 100;
	
	        /*var firstYearVisible = math.constrain(this.props.currentYear -7.5, this.props.yearExtent[0], this.props.yearExtent[1]);
	        var lastYearVisible = math.constrain(firstYearVisible +15, this.props.yearExtent[0], this.props.yearExtent[1]);
	        firstYearVisible = lastYearVisible - 15;*/
	
	        var scaleXYear = d3.scale.linear()
	            .domain([this.props.currentYear -7.5, this.props.currentYear +7.5])
	            .rangeRound([20, w - 20]);
	
	        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);
	
	        return (
	            React.createElement("div", {id: "small-timeline"}, 
	                React.createElement("div", {className: "border-left"}), 
	                React.createElement("svg", {className: "svg-small-timeline"}, 
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
	                            React.createElement("text", {className: "year", x: scaleXYear(year), y: h / 2 - 10, key: k}, 
	                                year
	                            )
	                        );
	                    })
	                )
	            )
	        );
	    }
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(35);
	
	var React = __webpack_require__(5);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	
	var GroupCountry = __webpack_require__(37);
	var Country = __webpack_require__(38);
	
	/**
	 * @props data
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    computeGroups: function () {
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
	    render: function () {
	        var groupAdhesionUEData = this.computeGroups();
	        return (
	            React.createElement("div", {id: "list-country"}, 
	                React.createElement("div", {className: "list-country-container"}, 
	                groupAdhesionUEData.map(function (g, kg) {
	                    return (
	                        React.createElement(GroupCountry, {key: kg}, 
	                            
	                                g.countries.map(function (c, kc) {
	                                    return React.createElement(Country, {country: c, key: kc});
	                                })
	                                
	                        )
	                    );
	                })
	                )
	            )
	        );
	    }
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "body,html{width:100%;height:100%;margin:0;padding:0}@font-face{font-family:'karlaregular';src:url("+__webpack_require__(42)+");src:url("+__webpack_require__(42)+"?#iefix) format('embedded-opentype'),url("+__webpack_require__(45)+") format('woff'),url("+__webpack_require__(43)+") format('truetype'),url("+__webpack_require__(44)+"#karlaregular) format('svg');font-weight:normal;font-style:normal;}", ""]);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = topojson;

/***/ },
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 02/02/15.
	 */
	
	'use strict';
	
	module.exports = {
	
	    /**
	     * Constrains a value to not exceed a maximum and minimum value.
	     *
	     * @param {int|float} value   the value to constrain
	     * @param {int|float} value   minimum limit
	     * @param {int|float} value   maximum limit
	     *
	     * @returns {int|float}
	     *
	     * @see max
	     * @see min
	     */
	    constrain: function (aNumber, aMin, aMax) {
	        return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
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

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "#map{width:100%;height:100%}#map .svg-map{width:100%;height:100%;background-color:#EBF0F7}", ""]);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 03/02/15.
	 */
	
	'use strict';
	
	var React = __webpack_require__(5);
	var tweenState = __webpack_require__(46);
	var d3 = __webpack_require__(1);
	
	var simplify = __webpack_require__(21);
	var projection = __webpack_require__(20);
	var path = d3.geo.path()
	    .projection(simplify(.05, projection));
	
	var ueInterpolation = d3.interpolateRgb('#fff', 'rgb(0,158,255)');
	
	/**
	 * @props feature
	 * @type {*|Function}
	 */
	var Country = React.createClass({displayName: "Country",
	    mixins: [tweenState.Mixin],
	    getInitialState: function(){
	        return {
	            ue: 0,
	            rendering: !!this.props.data
	        }
	    },
	    componentWillReceiveProps: function(nextProps){
	        if(nextProps.data){
	            if(nextProps.data.UE <=  this.props.currentYear){
	                this.tweenState('ue',{
	                    easing: tweenState.easingTypes.easeInOutQuad,
	                    duration: 500,
	                    endValue: 1
	                });
	            }else {
	                this.tweenState('ue',{
	                    easing: tweenState.easingTypes.easeInOutQuad,
	                    duration: 500,
	                    endValue: 0
	                });
	            }
	        }
	
	    },
	    shouldComponentUpdate: function(nextProps, nextState){
	        return this.state.rendering;
	    },
	    handleMouseOver: function(){
	
	    },
	    getRGB: function(){
	        return ueInterpolation(this.getTweeningValue('ue'));
	    },
	    render: function(){
	        return (
	            React.createElement("path", {className: 'country', 
	                d: path(this.props.feature), 
	                fill: this.getRGB(), 
	                stroke: this.getRGB(), 
	                onMouseOver: this.handleMouseOver})
	        );
	    }
	});
	
	module.exports = Country;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(27);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map-panel.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/map-panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "#map-panel{width:100%;height:100%}", ""]);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "#timeline{z-index:2;position:fixed;left:0;bottom:0;width:50%;height:100px}#timeline .svg-timeline{width:100%;height:100%}#timeline .svg-timeline .pick{stroke:black;shape-rendering:crispEdges;stroke-width:0.5px}#timeline .svg-timeline .year{text-anchor:middle;dominant-baseline:middle;font-size:12px;font-family:karlaregular;font-weight:lighter;opacity:0.8}#timeline .svg-timeline .cursor{stroke:black;fill:white;cursor:pointer}", ""]);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	
	
	var trans = [0, 0];
	
	/**
	 * @props getCenter
	 * @props size
	 * @props constrain
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    getInitialState: function () {
	        trans = [this.scaleYear()(this.props.currentYear), 0];
	        return {
	            transform: 'translate(' + trans +' )'
	        };
	    },
	    scaleYear: function(){
	        return d3.scale.linear()
	            .domain(this.props.yearExtent)
	            .range(this.props.constrain)
	            .clamp(true);
	    },
	    getCoords: function () {
	        var coords;
	        var center = [this.scaleYear()(this.props.currentYear) - this.scaleYear()(this.props.yearExtent[0]), this.props.y];
	        var size = this.props.size;
	
	        coords = [
	            [center[0] - size, center[1] - size],
	            [center[0] - size, center[1] + size],
	            [center[0] + size, center[1] + size],
	            [center[0] + size, center[1] - size],
	            [center[0], center[1] - 2 * size]
	        ];
	
	        return coords.map(function (pt) {
	            return pt.join(',');
	        }).join(' ');
	    },
	    componentDidMount: function () {
	        var svg = d3.select('.svg-timeline');
	        var el = svg.select('.cursor');
	        var coordDrag;
	        var dragMap = d3.behavior.drag()
	            .on('dragstart', function () {
	                coordDrag = [d3.event.sourceEvent.pageX, 0];
	            })
	            .on('drag', function () {
	                if (coordDrag) {
	                    this.props.setCurrentYear(
	                        d3.round(this.scaleYear().invert(trans[0] + d3.event.sourceEvent.pageX - coordDrag[0]))
	                    );
	                }
	            }.bind(this))
	            .on('dragend', function () {
	                trans = [trans[0] + d3.event.sourceEvent.pageX - coordDrag[0], 0];
	            });
	        el.call(dragMap);
	    },
	    render: function () {
	        return (
	            React.createElement("polygon", {className: "cursor", points: this.getCoords(), transform: this.state.transform})
	        );
	    }
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(32);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/right-panel.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/right-panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "#right-panel{overflow:scroll;position:fixed;background-color:rgba(255,255,255,0.65);width:50%;height:100%;z-index:2;top:0%;left:50%;border-left:#ccc 1px solid}", ""]);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/small-timeline.scss", function() {
			var newContent = require("!!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/css-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/node_modules/sass-loader/index.js!/Users/nicolasmondon/Documents/madeleineio/europe/dirty/sass/small-timeline.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, "#small-timeline{z-index:4;width:100%;height:10%}#small-timeline .border-left{width:20%;height:100%;display:inline-block}#small-timeline .svg-small-timeline{width:80%;height:1000px}#small-timeline .svg-small-timeline .pick{stroke:black;shape-rendering:crispEdges;stroke-width:0.5px}#small-timeline .svg-small-timeline .year{text-anchor:middle;dominant-baseline:middle;font-size:12px;font-family:karlaregular;font-weight:lighter;opacity:0.8}#small-timeline .svg-small-timeline .cursor{stroke:black;fill:white;cursor:pointer}", ""]);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(36);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)();
	exports.push([module.id, ".list-country-container .group-country{margin:30px 5px;box-sizing:content-box}.list-country-container .group-country .country{height:15px;width:100%}.list-country-container .group-country .country .grey-line{shape-rendering:crispEdges;stroke:#ccc;stroke-width:0.5}.list-country-container .group-country .country .country-label{text-anchor:start;dominant-baseline:text-before-edge;font-size:14px;font-family:karlaregular}", ""]);

/***/ },
/* 37 */
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(5);
	var d3 = __webpack_require__(1);
	
	var GreyLine = __webpack_require__(40);
	var Label = __webpack_require__(41);
	
	/**
	 * @props country
	 * @type {*|Function}
	 */
	module.exports = React.createClass({displayName: "exports",
	    render: function(){
	        return (
	
	            React.createElement("svg", {className: "country"}, 
	                React.createElement(GreyLine, null), 
	                React.createElement(Label, {text: this.props.country.nom})
	            )
	        );
	    }
	});

/***/ },
/* 39 */
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
/* 40 */
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
/* 41 */
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9b32ddf7a8f92141181778d032317807.eot"

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "b39ab43702ee55c707e54327b9a8251f.ttf"

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c2e4a81907170a84e0ef7079904653c6.svg"

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "25635a84225e55513e4882a4240e1dd5.woff"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var easingTypes = __webpack_require__(47);
	
	// additive is the new iOS 8 default. In most cases it simulates a physics-
	// looking overshoot behavior (especially with easeInOut. You can test that in
	// the example
	var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
	var DEFAULT_EASING = easingTypes.easeInOutQuad;
	var DEFAULT_DURATION = 300;
	var DEFAULT_DELAY = 0;
	
	function shallowClone(obj) {
	  var ret = {};
	  for (var key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = obj[key];
	  }
	  return ret;
	}
	
	// see usage below
	function returnState(state) {
	  return state;
	}
	
	var tweenState = {
	  easingTypes: easingTypes,
	  stackBehavior: {
	    ADDITIVE: 'ADDITIVE',
	    DESTRUCTIVE: 'DESTRUCTIVE',
	  }
	};
	
	tweenState.Mixin = {
	  getInitialState: function() {
	    return {
	      tweenQueue: [],
	    };
	  },
	
	  tweenState: function(a, b, c) {
	    // tweenState(stateNameString, config)
	    // tweenState(stateRefFunc, stateNameString, config)
	
	    // passing a state name string and retrieving it later from this.state
	    // doesn't work for values in deeply nested collections (unless you design
	    // the API to be able to parse 'this.state.my.nested[1]', meh). Passing a
	    // direct, resolved reference wouldn't work either, since that reference
	    // points to the old state rather than the subsequent new ones.
	    if (typeof a === 'string') {
	      c = b;
	      b = a;
	      a = returnState;
	    }
	    this._tweenState(a, b, c);
	  },
	
	  _tweenState: function(stateRefFunc, stateName, config) {
	    config = shallowClone(config);
	
	    var state = this._pendingState || this.state;
	    var stateRef = stateRefFunc(state);
	
	    // see the reasoning for these defaults at the top
	    config.stackBehavior = config.stackBehavior || DEFAULT_STACK_BEHAVIOR;
	    config.easing = config.easing || DEFAULT_EASING;
	    config.duration = config.duration == null ? DEFAULT_DURATION : config.duration;
	    config.beginValue = config.beginValue == null ? stateRef[stateName] : config.beginValue;
	    config.delay = config.delay == null ? DEFAULT_DELAY : config.delay;
	
	    var newTweenQueue = state.tweenQueue;
	    if (config.stackBehavior === tweenState.stackBehavior.DESTRUCTIVE) {
	      newTweenQueue = state.tweenQueue.filter(function(item) {
	        return item.stateName !== stateName || item.stateRefFunc(state) !== stateRef;
	      });
	    }
	
	    newTweenQueue.push({
	      stateRefFunc: stateRefFunc,
	      stateName: stateName,
	      config: config,
	      initTime: Date.now() + config.delay,
	    });
	
	    // tweenState calls setState
	    // sorry for mutating. No idea where in the state the value is
	    stateRef[stateName] = config.endValue;
	    // this will also include the above update
	    this.setState({tweenQueue: newTweenQueue});
	
	    if (newTweenQueue.length === 1) {
	      this.startRaf();
	    }
	  },
	
	  getTweeningValue: function(a, b) {
	    // see tweenState API
	    if (typeof a === 'string') {
	      b = a;
	      a = returnState;
	    }
	    return this._getTweeningValue(a, b);
	  },
	
	  _getTweeningValue: function(stateRefFunc, stateName) {
	    var state = this.state;
	    var stateRef = stateRefFunc(state);
	    var tweeningValue = stateRef[stateName];
	    var now = Date.now();
	
	    for (var i = 0; i < state.tweenQueue.length; i++) {
	      var item = state.tweenQueue[i];
	      var itemStateRef = item.stateRefFunc(state);
	      if (item.stateName !== stateName || itemStateRef !== stateRef) {
	        continue;
	      }
	
	      var progressTime = now - item.initTime > item.config.duration ?
	        item.config.duration :
	        Math.max(0, now - item.initTime);
	      // `now - item.initTime` can be negative if initTime is scheduled in the
	      // future by a delay. In this case we take 0
	
	      var contrib = -item.config.endValue + item.config.easing(
	        progressTime,
	        item.config.beginValue,
	        item.config.endValue,
	        item.config.duration
	        // TODO: some funcs accept a 5th param
	      );
	      tweeningValue += contrib;
	    }
	
	    return tweeningValue;
	  },
	
	  _rafCb: function() {
	    if (!this.isMounted()) {
	      return;
	    }
	
	    var state = this.state;
	    if (state.tweenQueue.length === 0) {
	      return;
	    }
	
	    var now = Date.now();
	    state.tweenQueue.forEach(function(item) {
	      if (now - item.initTime >= item.config.duration) {
	        item.config.onEnd && item.config.onEnd();
	      }
	    });
	
	    var newTweenQueue = state.tweenQueue.filter(function(item) {
	      return now - item.initTime < item.config.duration;
	    });
	
	    this.setState({
	      tweenQueue: newTweenQueue,
	    });
	
	    requestAnimationFrame(this._rafCb);
	  },
	
	  startRaf: function() {
	    requestAnimationFrame(this._rafCb);
	  },
	
	};
	
	module.exports = tweenState;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var easingTypes = {
	  // t: current time, b: beginning value, c: change in value, d: duration
	
	  // new note: I much prefer specifying the final value rather than the change
	  // in value this is what the repo's interpolation plugin api will use. Here,
	  // c will stand for final value
	
	  linear: function(t, b, _c, d) {
	    var c = _c - b;
	    return t*c/d + b;
	  },
	  easeInQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    return c*(t/=d)*t + b;
	  },
	  easeOutQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    return -c *(t/=d)*(t-2) + b;
	  },
	  easeInOutQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    if ((t/=d/2) < 1) return c/2*t*t + b;
	    return -c/2 * ((--t)*(t-2) - 1) + b;
	  },
	  easeInElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	  },
	  easeOutElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	  },
	  easeInOutElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	  },
	  easeInBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    return c*(t/=d)*t*((s+1)*t - s) + b;
	  },
	  easeOutBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	  },
	  easeInOutBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	  },
	  easeInBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    return c - easingTypes.easeOutBounce (d-t, 0, c, d) + b;
	  },
	  easeOutBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    if ((t/=d) < (1/2.75)) {
	      return c*(7.5625*t*t) + b;
	    } else if (t < (2/2.75)) {
	      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	    } else if (t < (2.5/2.75)) {
	      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	    } else {
	      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	    }
	  },
	  easeInOutBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    if (t < d/2) return easingTypes.easeInBounce (t*2, 0, c, d) * .5 + b;
	    return easingTypes.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	  }
	};
	
	module.exports = easingTypes;
	
	/*
	 *
	 * TERMS OF USE - EASING EQUATIONS
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright © 2001 Robert Penner
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 * Redistributions of source code must retain the above copyright notice, this list of
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list
	 * of conditions and the following disclaimer in the documentation and/or other materials
	 * provided with the distribution.
	 *
	 * Neither the name of the author nor the names of contributors may be used to endorse
	 * or promote products derived from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	 * OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */


/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map