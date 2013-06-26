var raphaelDOM = {

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
			return target[hasField];
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
		}
	}
};

