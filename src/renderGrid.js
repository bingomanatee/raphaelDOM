raphaelDOM.draw.grid = (function () {
	return function (box) {
		var rect = box.gridMarginDim.expand(box.innerRect());

		var rows, cols;

		if (_.isFunction(box.rows)) {
			rows = box.rows(rect);
		} else {
			rows = _.map(_.range(0, box.rows + 1), function (rowNumber) {
				return rect.left + rect.width * rowNumber / box.rows;
			}, box);
		};

		if (_.isFunction(box.cols)){
			cols = box.cols(rect);
		} else {
			cols = _.map(_.range(0, box.cols + 1), function(colNumber){
				return rect.top + rect.width * colNumber / box.cols;
			});
		}

		if (box.gridOrder == 'CR'){
		} else { // default == rows, then columns
			_.each(rows, function(rowDef, i){
				if (_.isObject(rowDef)){
				} else if (i){
					var percentX = (i -1)/rows.length;
					var percentX2 = (i)/rows.length;

					_.each(cols, function(col, j){
						if (j){
							var percentY = (i - 1)/cols.length;
							var percentY2 = i / cols.length;

							var cellRect = box.gridMarginDim.inset(raphaelDOM.Rect({
								left: rect.left + percentX * rect.width,
								right: rect.left + percentX2 * rect.width,
								top: rows.top + percentY * rect.height,
								bottom: rect.bottom + percentY2 * rect.height
							}));

							var gridCell = box.drawGridCell(cellRect, i, j);
						}
					})

				} else {
					// skip first row.
				}
			}, box)
		}
	};
})();
