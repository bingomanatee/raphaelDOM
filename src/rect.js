raphaelDOM.Rect = (function () {

	/**
	 * A rect is a static record of a rectangular dimension in space.
	 *
	 * It is immutable and its values are floats all around.
	 *
	 * @param left
	 * @param top
	 * @param width
	 * @param height
	 * @param basis
	 * @constructor
	 */

	function Rect(left, top, width, height, basis) {

		this.init(left, top, width, height);
		this._basis = basis;
	}

	Rect.prototype = {

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
		},

		intersect: function(rect){
			var r2 = this.clone();
			r2.left = Math.max(r2.left, rect.left);
			r2.right = Math.min(r2.right, rect.right);
			r2.top = Math.max(r2.top, rect.top);
			r2.bottom = Math.min(r2.bottom, rect.bottom);
			r2._recalcWidth();
			r2._recalcHeight();
			return r2;
		},

		inset:            function (inset, basis) {

			 inset = _.isObject(inset) ? inset : {value: inset};
			inset.value |= 0;

			var left = raphaelDOM.utils.getProp(inset, 'left', 'width', 'value');
			var right = raphaelDOM.utils.getProp(inset, 'right', 'width', 'value');
			var top = raphaelDOM.utils.getProp(inset, 'top', 'height', 'value');
			var bottom = raphaelDOM.utils.getProp(inset, 'bottom', 'hegiht', 'value');

			return this._inset(left, top, right, bottom);

		}, clone:         function () {

			return new raphaelDOM.Rect(this);

		}, _inset:        function (l, t, r, b) {
			var rect = this.clone();

			rect.left += l;
			rect.right -= r;
			rect.top += t;
			rect.bottom -= b;

			rect._recalcWidth();
			rect._recalcHeight();

			return rect;

		}, _recalcWidth:  function () {
			this.width = this.right - this.left;
		}, _recalcHeight: function () {
			this.height = this.bottom - this.top;
		}, frameInMe:     function (rect, align) {
			var offsetLeft, offsetTop;
			switch (align) {

				case 'TL':
					offsetLeft = this.left;
					offsetTop = this.top;
					break;

				case 'TR':
					offsetLeft = this.right - rect.width;
					offsetTop = this.top;
					break;

				case 'BL':
					offsetLeft = this.left;
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

