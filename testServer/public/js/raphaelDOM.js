/*! raphaelDOM 2013-06-25 */
var raphaelDOM = {
    utils: {
        getProp: function(target, fields) {
            if (!_.isArray(fields)) {
                fields = _.toArray(arguments).slice(1);
            }
            hasField = _.find(fields, function(field) {
                return target.hasOwnProperty(field);
            });
            if (!hasField) {
                throw new Error("cannot find any field " + fields.join(",") + " in target)");
            }
            return target[hasField];
        },
        propBasis: function(field) {
            switch (field) {
              case "width":
              case "left":
              case "right":
                return "width";
                break;

              case "top":
              case "bottom":
              case "height":
                return "height";
                break;

              default:
                throw new Error("cannot find basis for " + field);
            }
        }
    }
};

raphaelDOM.Box = function(name, params, parent, paper) {
    this.anchor = "TL";
    this.margin = 0;
    this.padding = 0;
    this.width = "100%";
    this.height = "100%";
    if (params) _.extend(this, params);
    this.name = name;
    this._children = [];
    this.parent = parent;
    this.paper = paper;
    this.root = !(parent.TYPE == "raphaelDOM.BOX");
};

raphaelDOM.Box.prototype = {
    TYPE: "raphaelDOM.BOX",
    m: function(value, basis, name) {
        return new raphaelDOM.Measure(value, basis, this, name).valueOf();
    },
    mp: function(value, basis, name) {
        if (_.isNumber(basis)) {
            return this.m(value, basis, name);
        } else if (this.root) {
            return this.m(value, basis, name);
        } else {
            return this.parent.m(value, basis, name);
        }
    },
    child: function(name) {
        var box = new raphaelDOM.Box(name, {}, this, this.paper);
        this._children.push(box);
        return box;
    },
    rect: function() {
        var rect = new raphaelDOM.Rect(0, 0, this.getWidth(), this.getHeight(), this);
        var parentRect = this.parentRect().inset(this.margin);
        if (!this.root) {
            parentRect = parentRect.intersect(this.parent.innerRect());
        }
        return parentRect.frameInMe(rect, this.anchor);
    },
    parentRect: function() {
        return this.root ? this._rootRect() : this.parent.rect();
    },
    _rootRect: function() {
        return new raphaelDOM.Rect(0, 0, this.parent.width(), this.parent.height());
    },
    innerRect: function() {
        if (this.padding == 0) {
            return this.rect();
        }
        var padding;
        if (_.isNumber(this.padding)) {
            padding = {
                value: this.padding
            };
        } else if (_.isString(this.padding)) {
            padding = this.map({
                left: this.padding,
                right: this.padding,
                top: this.padding,
                bottom: this.padding
            });
        } else {
            padding = this.map(this.padding);
        }
        return this.rect().inset(padding);
    },
    map: function(object) {
        var obj = {
            value: object.value
        };
        _.each(object, function(value, property) {
            if (property != "value") {
                obj[property] = this.m(value, raphaelDOM.utils.propBasis(property), property);
            }
        }, this);
        return obj;
    },
    setAnchor: function(value) {
        this.anchor = value;
        return this;
    },
    getLeft: function() {
        if (this.root) {
            return 0;
        } else {
            return Math.max(this.outerRect().left, this.parent.innerRect().left);
        }
    },
    getTop: function() {
        if (this.root) {
            return 0;
        } else {
            this.parent.innerRect().getTop();
        }
    },
    setWidth: function(value) {
        this.width = value;
        return this;
    },
    setHeight: function(value) {
        this.height = value;
        return this;
    },
    getWidth: function() {
        if (this.root) {
            return this.parent.width();
        } else {
            return new raphaelDOM.Measure(this.width, this.parent.innerRect().width).valueOf();
        }
    },
    getHeight: function() {
        if (this.root) {
            return this.parent.height();
        } else {
            return new raphaelDOM.Measure(this.height, this.parent.innerRect().height).valueOf();
        }
    }
};

raphaelDOM.Measure = function() {
    var formatRegex = /([\d\.]+)(px|%)?$/;
    function Measure(value, basis, owner, name) {
        this.owner = owner;
        this.name = name;
        this.basis = basis;
        if (_.isString(value)) {
            this.parseValue(value);
        } else if (_.isNumber(value)) {
            this._value = parseFloat(value);
            this.scale = "px";
        } else if (_.isObject(value)) {
            this.scale = value.scale;
            if (!value.value) {
                throw new Error("bad object (no value)");
            }
            this.parseValue(value.value);
        }
    }
    Measure.prototype = {
        parseValue: function(value) {
            if (formatRegex.test(value)) {
                var match = formatRegex.exec(value);
                this._value = parseFloat(match[1]);
                this.scale = match[2] || "px";
            } else {
                console.log("bad measure ", value, " for owner ", this.owner);
                throw new Error("bad measure " + value);
            }
        },
        valueOf: function() {
            switch (this.scale) {
              case "%":
                var base;
                if (_.isNumber(this.basis)) {
                    base = this.basis;
                } else {
                    switch (this.basis) {
                      case "width":
                        base = this.owner.getWidth();
                        break;

                      case "height":
                        base = this.owner.getHeight();
                        break;

                      case "innerWidth":
                        base = this.owner.innerRect().width;
                        break;

                      case "innerHeight":
                        base = this.owner.innerRect().height;
                        break;
                    }
                }
                return base * this._value / 100;
                break;

              case "px":
                return this.value;
                break;

              default:
                return this.value;
            }
        }
    };
    return Measure;
}();

raphaelDOM.Rect = function() {
    function Rect(left, top, width, height, basis) {
        this.init(left, top, width, height);
        this._basis = basis;
    }
    Rect.prototype = {
        init: function(left, top, width, height) {
            if (_.isObject(left)) {
                this.init(left.left, left.top, left.width || 0, left.height || 0);
                if (!left.hasOwnProperty("width") && left.hasOwnProperty("bottom")) {
                    this.bottom = left.bottom;
                    this._recalcHeight();
                }
                if (!left.hasOwnProperty("height") && left.hasOwnProperty("right")) {
                    this.right = left.right;
                    this._recalcWidth();
                }
            } else {
                this.left = left;
                this.top = top;
                this.width = width;
                this.height = height;
                this.right = left + width;
                this.bottom = top + height;
            }
        },
        intersect: function(rect) {
            var r2 = this.clone();
            r2.left = Math.max(r2.left, rect.left);
            r2.right = Math.min(r2.right, rect.right);
            r2.top = Math.max(r2.top, rect.top);
            r2.bottom = Math.min(r2.bottom, rect.bottom);
            r2._recalcWidth();
            r2._recalcHeight();
            return r2;
        },
        inset: function(inset, basis) {
            inset = _.isObject(inset) ? inset : {
                value: inset
            };
            inset.value |= 0;
            var left = raphaelDOM.utils.getProp(inset, "left", "width", "value");
            var right = raphaelDOM.utils.getProp(inset, "right", "width", "value");
            var top = raphaelDOM.utils.getProp(inset, "top", "height", "value");
            var bottom = raphaelDOM.utils.getProp(inset, "bottom", "hegiht", "value");
            return this._inset(left, top, right, bottom);
        },
        clone: function() {
            return new raphaelDOM.Rect(this);
        },
        _inset: function(l, t, r, b) {
            var rect = this.clone();
            rect.left += l;
            rect.right -= r;
            rect.top += t;
            rect.bottom -= b;
            rect._recalcWidth();
            rect._recalcHeight();
            return rect;
        },
        _recalcWidth: function() {
            this.width = this.right - this.left;
        },
        _recalcHeight: function() {
            this.height = this.bottom - this.top;
        },
        frameInMe: function(rect, align) {
            var offsetLeft, offsetTop;
            switch (align) {
              case "TL":
                offsetLeft = this.left;
                offsetTop = this.top;
                break;

              case "TR":
                offsetLeft = this.right - rect.width;
                offsetTop = this.top;
                break;

              case "BL":
                offsetLeft = this.left;
                offsetTop = this.bottom - rect.height;
                break;

              case "BR":
                offsetLeft = this.right - rect.width;
                offsetTop = this.bottom - rect.height;
                break;
            }
            return rect.offset(offsetLeft, offsetTop);
        },
        offset: function(x, y) {
            var rect = this.clone();
            rect.left += x;
            rect.right += x;
            rect.top += y;
            rect.bottom += y;
            return rect;
        }
    };
    return Rect;
}();