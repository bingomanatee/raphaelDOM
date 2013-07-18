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
 *
 * anchor: what point(relative to the parent) is used to project this boxes' offset.
 *         acceptable values: 'TL', 'TR', 'BL', 'BR', 'T','L','B','R'
 *
 * margin: the offset from the anchor for this box. can be a measure or
 *         or an object ( {top: measure, left: measure, right: measure, bottom: measure, width: measure, height: measure, value: measure}.
 *         (all properties optional);
 *
 * padding: padding affects the
 *
 * -- note -- both margin and padding are translated in to Dimension objects;
 *            it is the marginDim and paddingDim objects
 *            that are used in size calculation;
 *            the input padding and margin are only used as constructors for the Dimensions.
 *
 */

raphaelDOM.Box = (function () {

	var _rgb = _.template('rgb(<%= red %>,<%= green %>, <%= blue %>)');
	var _hsl = _.template('hsl(<%= hue %>, <%= sat %>%, <%= light %>%)');

	function Box(name, params, parent, paper) {
		this.anchor = 'TL';

		this.margin = 0;
		this.padding = 0;

		this.width = '100%';
		this.height = '100%';

		this.rows = 1;
		this.cols = 1;

		this.drawType = 'rect';
		this.color = {
			red:   0,
			green: 0,
			blue:  0
		};
		this.colorMode = 'rgb';
		this.drawAttrs = {
		};

		if (params)_.extend(this, params);

		this.name = name;
		this._children = [];
		this.parent = parent;
		this.paper = paper || (parent ? parent.paper : null);

		this.marginDim = new raphaelDOM.Dimension(this.margin);
		this.paddingDim = new raphaelDOM.Dimension(this.padding);
	}

	Box.prototype = {
		TYPE: 'raphaelDOM.BOX',

		is_root: function () {
			return (this.parent instanceof jQuery) || (!(this.parent.TYPE == 'raphaelDOM.BOX'));
		},

		parent_rect: function () {
			if (this.is_root()) {
				return new raphaelDOM.Rect(0, 0, this.parent.width(), this.parent.height());
			} else {
				return this.parent.rect(true);
			}
		},

		rect: function (inner) {
			var parent_rect = this.parent_rect();
			var margin_rect = parent_rect.inset(this.marginDim);

			var width = raphaelDOM.utils.scale(this.width, parent_rect.width);
			var height = raphaelDOM.utils.scale(this.height, parent_rect.height);
			var left, top;

			//@TODO: a more "semantic" analysis of the anchor.

			switch (this.anchor) {
				case 'TL':
					left = margin_rect.left;
					top = margin_rect.top;
					break;

				case 'TR':
					left = margin_rect.right - width;
					top = margin_rect.top;
					break;

				case 'T':
					left = margin_rect.left + (margin_rect.width - width) / 2;
					top = margin_rect.top;
					break;

				case 'BL':
					left = margin_rect.left;
					top = margin_rect.bottom - height;
					break;

				case 'BR':
					left = margin_rect.right - width;
					top = margin_rect.bottom - height;
					break;

				case 'B':
					left = margin_rect.left + (margin_rect.width - width) / 2;
					top = margin_rect.bottom - height;
					break;
			}

			var rect = new raphaelDOM.Rect(left, top, width, height);
			return inner ? rect.inset(this.paddingDim) : rect;
		},

		child: function(name){
			var child = new Box(name || this.name + ' child ' + this._children.length, {}, this);
			this._children.push(child);
			return child;
		},

		setWidth: function(width){
			this.width = width;
			return this;
		},

		setHeight: function(height){
			this.height = height;
			return this;
		},

		setAnchor: function(a){
			this.anchor = a.replace(/top/i, 'T').replace(/left/i, 'L').replace(/bottom/i, 'B').replace(/right/, 'R').replace(/[^TLBR]/g, '');
			return this;
		},

		/* *************** SETTING PADDING ************ */

		setPadding: function(p){
			this.paddingDim = new raphaelDOM.Dimension(p);
			return this;
		},

		/* *************** SETTING MARGIN ************* */

		setMargin: function(p){
			this.marginDim = new raphaelDOM.Dimension(p);
			return this;
		},

		setTopMargin: function(m){
			this.marginDim.top = m;
			return this;
		},

		setBottomMargin: function(m){
			this.marginDim.bottom = m;
			return this;
		},

		setLeftMargin: function(m){
			this.marginDim.left = m;
			return this;
		},

		setRightMargin: function(m){
			this.marginDim.right = m;
			return this;
		},


		/* ************ DRAW ************* */

		_computeFill: function () {
			if (this.color && _.isObject(this.color)) {
				switch (this.colorMode) {
					case 'rgb':
						this.drawAttrs.fill = _rgb(this.color);
						break;

					case 'hsl':
						this.drawAttrs.fill = _hsl(this.color);
						break;
				}
			}
		},

		draw: function(paper){

			if (paper) {
				this.paper = paper;
			}


			switch (this.drawType) {

				case 'rect':
				case 'box':
				default:
					this._computeFill();
					raphaelDOM.draw.rect(this);
			}
			_.each(this._children, function (child) {
				child.draw(this.paper);
			}, this);
		}
	};

	return Box;
})()