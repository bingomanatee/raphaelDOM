raphaelDOM.draw.text = function (box) {
	var _DEBUG = false;

	var rect = box.rect();

	var fontHeight = box.drawAttrs['font-size'] || 12;
	box.drawAttrs['font-size'] = fontHeight;
	var bigHeightDiff = rect.height - fontHeight;
	fontHeight *= 0.6;
	var heightDiff = rect.height - fontHeight;

	var paper = box.paper;

	switch (box.anchor) {

		case 'TL':
			box.element = paper.text(rect.left, rect.top + fontHeight, box.text);
			box.element.attr('text-anchor', 'start');
			break;

		case 'T':
			box.element = paper.text(rect.left + rect.width / 2, rect.top + fontHeight, box.text);
			box.element.attr('text-anchor', 'middle');
			break;

		case 'TR':
			box.element = paper.text(rect.right, rect.top + fontHeight, box.text);
			box.element.attr('text-anchor', 'end');
			break;

		case 'L':
			box.element = paper.text(rect.left, rect.top +  (fontHeight + heightDiff) / 2, box.text);
			box.element.attr('text-anchor', 'start');
			break;

		case 'C':
			box.element = paper.text(rect.left + rect.width / 2, rect.top  + (fontHeight + heightDiff) / 2, box.text);
			box.element.attr('text-anchor', 'middle');
			break;

		case 'R':
			box.element = paper.text(rect.right, rect.top +  (fontHeight + heightDiff) / 2, box.text);
			box.element.attr('text-anchor', 'end');
			break;

		case 'BL':
			box.element = paper.text(rect.left, rect.bottom - fontHeight, box.text);
			box.element.attr('text-anchor', 'start');
			break;

		case 'B':
			box.element = paper.text(rect.left + rect.width / 2, rect.bottom - fontHeight, box.text);
			box.element.attr('text-anchor', 'middle');
			break;

		case 'BR':
			box.element = paper.text(rect.right, rect.bottom - fontHeight, box.text);
			box.element.attr('text-anchor', 'end');
			break;

		default:
			throw new Error('no anchor '+ box.anchor);
	}

	box.element.attr(_.extend({fill: 'black', title: box.title ? box.title : box.name}, box.drawAttrs || {}));

};