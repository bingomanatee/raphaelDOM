raphaelDOM.Measure = (function () {
	var formatRegex = /([\d\.]+)(px|%)?$/;

	/**
	 *
	 * @param value { variant } the expressed measure
	 * @param owner {raphaelDOM.Box} the box for whom this measure is relevant
	 * @param basis {string} a description of the basis for the masure relative to the owner.
	 * @param name {string} optional -- what we are measuring
	 * @constructor
	 */

	function Measure(value, basis, owner, name) {
		this.owner = owner;
		this.name = name;
		this.basis = basis;

		if (_.isString(value)) {
			this.parseValue(value);
		} else if (_.isNumber(value)) {
			this._value = parseFloat(value);
			this.scale = 'px';
		} else if (_.isObject(value)) {
			this.scale = value.scale;
			if (!value.value) {
				throw new Error('bad object (no value)');
			}
			this.parseValue(value.value);
		}

	}

	Measure.prototype = {

		parseValue: function (value) {
			if (formatRegex.test(value)) {
				var match = formatRegex.exec(value);
				this._value = parseFloat(match[1]);
				this.scale = match[2] || 'px';
			} else {
				console.log('bad measure ', value, ' for owner ', this.owner);
				throw new Error('bad measure ' + value );
			}
		}, valueOf: function () {
			switch (this.scale) {
				case '%':

					var base;
					if (_.isNumber(this.basis)) {
						base = this.basis;
					} else {

						switch (this.basis) {
							case 'width':
								base = this.owner.getWidth();
								break;

							case 'height':
								base = this.owner.getHeight();
								break;

							case 'innerWidth':
								base = this.owner.innerRect().width;
								break;

							case 'innerHeight':
								base = this.owner.innerRect().height;
								break;
						}
					}

					return base * this._value / 100;
					break;

				case 'px':
					return this.value;
					break;

				default:
					return this.value;
			}
		}

	};

	return Measure;
})();
