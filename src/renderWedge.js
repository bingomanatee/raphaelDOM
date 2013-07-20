raphaelDOM.draw.wedge = (function () {

	function _sector(box) {
		var rect = box.rect();
		var center = rect.center();
		var r = rect.radius();
		var startAngle =  box.hasOwnProperty('startAngle') ? box.startAngle :  0
			, endAngle = box.hasOwnProperty('endAngle') ? box.endAngle : 360;

		var p1 = rect.radialPoint(startAngle);
		var p2 = rect.radialPoint(endAngle);

		return box.paper.path(["M", center.x, center.y, "L", p1.x, p1.y, "A", r, r, 0, + (endAngle - startAngle > 180), 0, p2.x, p2.y, "z"]);
	}

	return function (box) {
		var _DEBUG = false;

		var rect = box.rect();

		box.element = _sector(box);
		if (_DEBUG) console.log('box: ', box.name, ':', box, 'rect: ', rect);
		box.element.attr(_.extend({'stroke-width': 0, fill: 'black', title: box.getTitle() }, box.drawAttrs || {}));
	}

})();