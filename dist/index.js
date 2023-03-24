"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _visitor = _interopRequireDefault(require("@swc/core/Visitor"));
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var DEFAULT_OPTS = {
    preventFullImport: false,
    skipDefaultConversion: false,
    style: false
};
function barf(msg) {
    throw new Error('swc-plugin-transform-imports: ' + msg);
}
function transformImportPath(transformOption, importName) {
    if (!transformOption) return '';
    var isFunction = typeof transformOption === 'function';
    // If transformOption is a function or defined in a JS file.
    if (/\.js$/i.test(transformOption) && !/[\$\{\}]/.test(transformOption) || isFunction) {
        var transformFn;
        try {
            transformFn = isFunction ? transformOption : require(transformOption);
        } catch (error) {
            barf('failed to require transform file ' + transformOption);
        }
        if (typeof transformFn !== 'function') {
            barf('expected transform function to be exported from ' + transformOption);
        }
        return transformFn(importName);
    }
    var transformedImport = transformOption.replace(/\$\{\s?member\s?\}/ig, importName);
    return transformedImport;
}
var PluginTransformImport = /*#__PURE__*/ function(Visitor) {
    "use strict";
    _inherits(PluginTransformImport, Visitor);
    var _super = _createSuper(PluginTransformImport);
    function PluginTransformImport() {
        var opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, PluginTransformImport);
        var _this;
        _this = _super.call(this);
        _this.opts = {};
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            // Add default options to the every opts object.
            for(var _iterator = Object.keys(opts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                _this.opts[key] = _objectSpread({}, DEFAULT_OPTS, opts[key]);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return _this;
    }
    _createClass(PluginTransformImport, [
        {
            key: "visitModuleItems",
            value: function visitModuleItems(nodes) {
                var opts = this.opts;
                var transformedNodes = [];
                // Return if options are not provided.
                if (Object.keys(opts).length === 0) {
                    return nodes;
                }
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    var _loop = function(_iterator, _step) {
                        var node = _step.value;
                        var type = node.type;
                        var isValidTranformCandidate = type === 'ImportDeclaration' && node.source.value in opts;
                        if (!isValidTranformCandidate) {
                            transformedNodes.push(node);
                            return "continue";
                        }
                        // node has properties 'source' and 'specifiers' attached.
                        // node.source is the library/module name, aka 'react-bootstrap'.
                        // node.specifiers is an array of ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
                        var source = node.source, specifiers = node.specifiers;
                        var _value = opts[source.value], preventFullImport = _value.preventFullImport, skipDefaultConversion = _value.skipDefaultConversion, transform = _value.transform, style = _value.style;
                        var isDefaultImportExist = specifiers.some(function(specifier) {
                            return specifier.type === 'ImportDefaultSpecifier';
                        });
                        //      import * as name from 'module'; (ImportNamespaceSpecifier)
                        //      import name from 'module'; (ImportDefaultSpecifier)
                        if (isDefaultImportExist && preventFullImport) {
                            barf('Import of entire module ' + source.value + ' not allowed due to preventFullImport setting');
                        }
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            // Going through each specifier and transforming the import path.
                            // aka Row, Grid, { Grid as MyGrid}..
                            for(var _iterator1 = specifiers[Symbol.iterator](), _step1; !(_iteratorNormalCompletion = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion = true){
                                var specifier1 = _step1.value;
                                var ref, ref1;
                                var type1 = specifier1.type, local = specifier1.local;
                                var doesImportedValueExist = type1 === 'ImportSpecifier' && (specifier1 === null || specifier1 === void 0 ? void 0 : (ref = specifier1.imported) === null || ref === void 0 ? void 0 : ref.value);
                                var actualImportVariable = doesImportedValueExist ? specifier1 === null || specifier1 === void 0 ? void 0 : (ref1 = specifier1.imported) === null || ref1 === void 0 ? void 0 : ref1.value : local.value;
                                var shouldSkipDefaultConversion = skipDefaultConversion;
                                // Swap out the import with one that doesn't include member imports.
                                // Member imports should each get their own import line
                                // transform this:
                                //      import Bootstrap, { Grid } from 'react-bootstrap';
                                // into this:
                                //      import Bootstrap from 'react-bootstrap';
                                //      import Grid from 'react-bootstrap/lib/Grid';
                                // Create a new Import Declaration node for each named import
                                if (type1 === 'ImportSpecifier') {
                                    var newSpecifier = _objectSpread({}, specifier1, shouldSkipDefaultConversion ? {} : {
                                        imported: null,
                                        type: "ImportDefaultSpecifier"
                                    });
                                    var value = transformImportPath(transform, actualImportVariable || '');
                                    var copyNode = _objectSpread({}, node, {
                                        source: _objectSpread({}, source, {
                                            value: value
                                        }),
                                        specifiers: [
                                            newSpecifier
                                        ],
                                        type: "ImportDeclaration"
                                    });
                                    transformedNodes.push(copyNode);
                                    if (style) {
                                        var styleNode = _objectSpread({}, node, {
                                            source: _objectSpread({}, source, {
                                                value: typeof style === 'function' ? style(value) : "".concat(value, "/style")
                                            }),
                                            specifiers: [],
                                            type: "ImportDeclaration"
                                        });
                                        transformedNodes.push(styleNode);
                                    }
                                } else if (type1 === 'ImportDefaultSpecifier') {
                                    var nameImportsFilteredNode = _objectSpread({}, node, {
                                        specifiers: [
                                            specifier1
                                        ]
                                    });
                                    transformedNodes.push(nameImportsFilteredNode);
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    };
                    for(var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion1 = (_step = _iterator.next()).done); _iteratorNormalCompletion1 = true){
                        var _ret = _loop(_iterator, _step);
                        if (_ret === "continue") continue;
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
                // If import declaration is a candidate for transformation
                // We push all the new import declarations to the transformedNodes array.
                // Else we push the original node to the transformedNodes array.
                return transformedNodes;
            }
        }
    ]);
    return PluginTransformImport;
}(_visitor.default);
var _default = PluginTransformImport;
exports.default = _default;
