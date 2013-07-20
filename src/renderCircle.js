raphaelDOM.draw.circle = (function () {
	var _DEBUG = false;

	var rad = Math.PI / 180;

	function _circle(box) {
		var rect = box.rect();
		var center = rect.center();
		var r = rect.radius(box.radMode || '');
		return box.paper.circle(center.x, center.y, r);
	}

	return function (box) {
		var _DEBUG = false;

		var rect = box.rect();

		box.element = _circle(box);
		if (_DEBUG) console.log('circle: ', box.name, ':', box, 'rect: ', rect);
		box.element.attr(_.extend({'stroke-width': 0, fill: 'black', title: box.getTitle() }, box.drawAttrs || {}));
	}

})();