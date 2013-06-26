/**
 * Created with JetBrains WebStorm.
 * User: dedelhart
 * Date: 6/25/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 * @param name {string};
 * @param params {object}
 * @param parent {raphaelDOM.Box || jQuery element: optional}
 * @param paper {Raphael Paper: optional}
 * @constructor
 *
 * 'measure' values, like CSS values, can be in multiple formats:
 *        numeric(int or float) - as px
 *        string ('number%')
 *        explicit : {
 *                      value: float,
 *                      type: 'percent' | 'pixel'
 *                    }
 *
 * anchor: what point(relative to the parent) is used to project this boxes' offset.
 *         acceptable values: 'TL', 'TR', 'BL', 'BR', 'topleft', 'topright', 'bottomleft', 'bottomright'.
 * margin: the offset from the anchor for this box. can be a measure or
 *         or an object ( {top: measure, left: measure, right: measure, bottom: measure, width: measure, height: measure, value: measure}.
 *         (all properties optional);
 *         note- this is NOT a rect in that width is a default for left and right, height is a default for top and bottom, and value is a default for all values.
 * padding: the offset of the innerRect from the base rect. same stats as margin.
 *
 */

raphaelDOM.Box = function (name, params, parent, paper) {
	this.anchor = 'TL';
	this.margin = 0;
	this.padding = 0;
	this.width = '100%';
	this.height = '100%';

	if (params)_.extend(this, params);
	this.name = name;
	this._children = [];
	this.parent = parent;
	this.paper = paper;
	this.root = (!(parent.TYPE == 'raphaelDOM.BOX'));
};

raphaelDOM.Box.prototype = {
	TYPE: 'raphaelDOM.BOX',
	m:    function (value, basis, name) {
		return new raphaelDOM.Measure(value, basis, this, name).valueOf();
	},

	mp: function (value, basis, name) {
		if (_.isNumber(basis)) {
			return this.m(value, basis, name);
		} else if (this.root) {
			return this.m(value, basis, name);
		} else {
			return this.parent.m(value, basis, name);
		}
	},

	child: function (name) {
		var box = new raphaelDOM.Box(name, {}, this, this.paper);
		this._children.push(box);
		return box;
	},

	/* ************* RECT / INNER RECT ****** */

	rect: function () {
		var rect = new raphaelDOM.Rect(0, 0, this.getWidth(), this.getHeight(), this);

		var parentRect = this.parentRect().inset(this.margin);
		if (!this.root) {
			parentRect = parentRect.intersect(this.parent.innerRect());
		}

		return parentRect.frameInMe(rect, this.anchor);
	},

	parentRect: function () {
		return this.root ? this._rootRect() : this.parent.rect();
	},

	_rootRect: function () {
		return new raphaelDOM.Rect(0, 0, this.parent.width(), this.parent.height());
	},

	/**
	 * this is the rectangle of this box, inset by padding.
	 *
	 * @returns {*}
	 */
	innerRect: function () {
		if (this.padding == 0) {
			return this.rect();
		}
		var padding;

		if (_.isNumber(this.padding)) {
			padding = {value: this.padding}
		} else if (_.isString(this.padding)) {
			padding = this.map({
				left:   this.padding,
				right:  this.padding,
				top:    this.padding,
				bottom: this.padding
			});
		} else {
			padding = this.map(this.padding);
		}
		return this.rect().inset(padding);
	},

	map: function (object) {

		var obj = {value: object.value};
		_.each(object, function (value, property) {
			if (property != 'value') {
				obj[property] = this.m(value, raphaelDOM.utils.propBasis(property), property);
			}

		}, this);

		return obj;
	},

	/* ************ ANCHOR ****************** */

	setAnchor: function (value) {
		this.anchor = value;
		return this;
	},

	/* ********** LEFT, TOP ***************** */

	getLeft: function () {
		if (this.root) {
			return 0;
		} else {
			return Math.max(
				this.outerRect().left,
				this.parent.innerRect().left
			);
		}
	},

	getTop: function () {
		if (this.root) {
			return 0;
		} else {
			this.parent.innerRect().getTop();
		}
	},

	/* ********** WIDTH , HEIGHT ************ */

	setWidth: function (value) {
		this.width = value;
		return this;
	},

	setHeight: function (value) {
		this.height = value;
		return this;
	},

	getWidth: function () {
		if (this.root) {
			return this.parent.width();
		} else {
			return new raphaelDOM.Measure(this.width, this.parent.innerRect().width).valueOf();
		}
	},

	getHeight: function () {
		if (this.root) {
			return this.parent.height();
		} else {
			return  new raphaelDOM.Measure(this.height, this.parent.innerRect().height).valueOf();
		}
	}
};