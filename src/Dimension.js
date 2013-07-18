/**
 * A Dimension is a record of offset measurements.
 * These measurements can be in precent ('50%') or in absolute values.
 * Note that the Dimension does not record what the BASIS of the offsets are -- just their settings.
 *
 * Arguments can be:
 *
 * value
 * width, height
 * top, left, right, bottom
 *
 * value
 * width, height
 * top, left, right, bottom
 *
 */

raphaelDOM.Dimension = (function(){

	function Dimension(){
		this.value = 0;
		var args = _.toArray(arguments);
		this.init.apply(this, args);
	}

	Dimension.prototype = {

		inset: function(rect){
			rect = rect.clone();
			rect.left += this.getLeft();
			rect.right -= this.getRight();
			rect.top += this.getTop();
			rect.bottom -= this.getBottom();
			rect.recalculate();
			return rect;
		},

		expand: function(rect){
			rect = rect.clone();
			rect.left -= ths.getLeft();
			rect.right += this.getRight();
			rect.top -= this.getTop();
			rect.bottom += this.getBottom();
			rect.recalculate();
			return rect;
		},

		/* ********** DIMENSIONS ************* */
		getLeft: function(basis){
			if (!basis.TYPE == 'RECT') throw new Error('basis must be rect');
			var value = raphaelDOM.utils.getProp(this, 'left', 'width', 'value');
			return raphaelDOM.scale(value, basis);
		},

		getRight: function(basis){
			if (!basis.TYPE == 'RECT') throw new Error('basis must be rect');
			var value = raphaelDOM.utils.getProp(this, 'right', 'width', 'value');
			return raphaelDOM.scale(value, basis);
		},

		getTop: function(basis){
			if (!basis.TYPE == 'RECT') throw new Error('basis must be rect');
			if (this.basis.root) return 0;
			var value = raphaelDOM.utils.getProp(this, 'top', 'height', 'value');
			return raphaelDOM.scale(value, basis);
		},

		getBottom: function(basis){
			if (!basis.TYPE == 'RECT') throw new Error('basis must be rect');
			var value = raphaelDOM.utils.getProp(this, 'bottom', 'height', 'value');
			return raphaelDOM.scale(value, basis);
		},

		/* *********** CONSTRUCTOR ********* */
		init: function(){
			var args = _.toArray(arguments);

			switch(args.length){
				case 0:
					this.value = 0;
					break;

				case 1:
					if (_.isObject(args[0])){
						_.extend(this, args[0]);
					} else {
						this.value = args[0];
					}
					break;

				case 2:
					this.width = args[0];
					this.height = args[1];
					break;

				case 3:
					throw new Error('no three argument API for Dimension');
					break;

				case 4:
				default:
					_.each('left', 'top', 'right', 'bottom', function(f, i){
						this[f] = args[i];
					}, this);
					break;
			}
		}
	};

	return Dimension;

})();