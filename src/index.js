var raphaelDOM = {
	draw:  {none: _.identity},
	utils: {
		getProp: function (target, fields) {
			if (!_.isArray(fields)) {
				fields = _.toArray(arguments).slice(1);
			}

			hasField = _.find(fields, function (field) {
				return target.hasOwnProperty(field);
			});

			if (!hasField) {
				throw new Error('cannot find any field ' + fields.join(',') + ' in target)');
			}
			return target[hasField] || 0;
		},

		propBasis: function (field) {
			switch (field) {
				case 'width':
				case 'left':
				case 'right':
					return 'width';
					break;

				case 'top':
				case 'bottom':
				case 'height':
					return 'height';
					break;

				default:
					throw new Error('cannot find basis for ' + field);
			}
		},

		scale: function (scale, basis) {
			if (isNaN(basis)) throw new Error('non basis passed to scale: ' + basis);
			if (_.isNumber(scale)) return scale;
			if (/%$/.test(scale)){
				scale = new Number(scale.replace('%', ''));
				return scale * basis/100;
			} else {
				throw new Error('strange scale ', + scale);
			}
		}
	}
};