raphaelDOM.draw.rect =  function(box){
	var _DEBUG = false;

	var rect = box.rect();
	box.element = box.paper.rect(rect.left, rect.top, rect.width, rect.height);
	if (_DEBUG) console.log('box: ', box.name, ':',  box, 'rect: ', rect);
	box.element.attr(_.extend({'stroke-width': 0, fill: 'black', title: box.name}, box.drawAttrs || {}));
};