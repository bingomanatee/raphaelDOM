raphaelDOM.Rect = (function () {

	var _string = _.template('x: <%= left %> ... <%= right %>(<%= width %>), y: <%= top %> ... <%= bottom %>(<%= height %>)');

	/**
	 * A rect is a static record of a rectangular dimension in space.
	 *
	 * It is immutable and its values are floats all around.
	 *
	 * @param left {Number}
	 * @param top{Number}
	 * @param width{Number}
	 * @param height{Number}
	 * @constructor
	 */

	function Rect(left, top, width, height) {

		this.init(left, top, width, height);
	}

	Rect.prototype = {

		TYPE: 'RECT',

		init: function (left, top, width, height) {

			if (_.isObject(left)) {
				this.init(left.left, left.top, left.width || 0, left.height || 0);

				if ((!left.hasOwnProperty('width')) && left.hasOwnProperty('bottom')) {
					this.bottom = left.bottom;
					this._recalcHeight();
				}

				if ((!left.hasOwnProperty('height')) && left.hasOwnProperty('right')) {
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

			this.validate();
		},

		validate: function () {
			if (_.any(['left', 'right', 'top', 'bottom', 'height', 'width'],
				function (field) {
					return isNaN(this[field])
				},
				this
			)) {
				throw new Error('invalid rect: ' + this.toString());
			}
		},

		toString: function () {
			return _string(this);
		},

		intersect: function (rect) {
			var r2 = new raphaelDOM.Rect({
					left:   Math.max(this.left, rect.left),
					right:  Math.min(this.right, rect.right),
					top:    Math.max(this.top, rect.top),
					bottom: Math.min(this.bottom, rect.bottom)
				});

			r2.validate();
			return r2;
		},

		inset:            function (inset) {

			inset = _.isObject(inset) ? inset : {value: inset};

			var left = raphaelDOM.utils.getProp(inset, 'left', 'width', 'value');
			var right = raphaelDOM.utils.getProp(inset, 'right', 'width', 'value');
			var top = raphaelDOM.utils.getProp(inset, 'top', 'height', 'value');
			var bottom = raphaelDOM.utils.getProp(inset, 'bottom', 'height', 'value');

			return this._inset(left, top, right, bottom);

		},
		
		outset: function(outset){

			outset = _.isObject(outset) ? outset : {value: outset};
			outset.value |= 0;

			var left = raphaelDOM.utils.getProp(outset, 'left', 'width', 'value');
			var right = raphaelDOM.utils.getProp(outset, 'right', 'width', 'value');
			var top = raphaelDOM.utils.getProp(outset, 'top', 'height', 'value');
			var bottom = raphaelDOM.utils.getProp(outset, 'bottom', 'height', 'value');

			return this._outset(left, top, right, bottom);
		},
		
		clone:         function () {
			return new raphaelDOM.Rect(this);

		},

		_inset:        function (l, t, r, b) {
			var rect = this.clone();

			l = raphaelDOM.utils.scale(l, this.width);
			r = raphaelDOM.utils.scale(r, this.width);
			t = raphaelDOM.utils.scale(t, this.height);
			b = raphaelDOM.utils.scale(b, this.height);

			rect.left += l;
			rect.right -= r;
			rect.top += t;
			rect.bottom -= b;

			rect._recalcWidth();
			rect._recalcHeight();

			return rect;

		},

		_outset:        function (l, t, r, b) {
			var rect = this.clone();

			rect.left -= l;
			rect.right += r;
			rect.top -= t;
			rect.bottom += b;

			rect._recalcWidth();
			rect._recalcHeight();

			return rect;
		},

		recalculate: function(){
			this._recalcWidth();
			this._recalcHeight();
		},

		_recalcWidth:  function () {
			this.width = this.right - this.left;
		},

		_recalcHeight: function () {
			this.height = this.bottom - this.top;
		},

		frameInMe:     function (rect, align) {
			var offsetLeft, offsetTop;
			var widthDiff = this.width - rect.width;
			var heightDiff = this.height - rect.height;

			switch (align) {

				case 'TL':
					offsetLeft = this.left;
					offsetTop = this.top;
					break;

				case 'T':
					offsetLeft = widthDiff/2;
					offsetTop = this.top;
					break;

				case 'TR':
					offsetLeft = this.right - rect.width;
					offsetTop = this.top;
					break;


				case 'L':
					offsetLeft = this.left;
					offsetTop = this.top;
					break;

				case 'C':
					offsetLeft = widthDiff/2;
					offsetTop =  heightDiff/2;
					break;

				case 'R':
					offsetLeft = this.right - rect.width;
					offsetTop = this.top;
					break;

				case 'BL':
					offsetLeft = this.left;
					offsetTop = this.bottom - rect.height;
					break;

				case 'B':
					offsetLeft = widthDiff/2;
					offsetTop = this.bottom - rect.height;
					break;

				case 'BR':
					offsetLeft = this.right - rect.width;
					offsetTop = this.bottom - rect.height;
					break;

			}

			return rect.offset(offsetLeft, offsetTop);
		},

		offset: function (x, y) {
			var rect = this.clone();

			rect.left += x;
			rect.right += x;
			rect.top += y;
			rect.bottom += y;

			return rect;
		}

	};

	return Rect;

})();

