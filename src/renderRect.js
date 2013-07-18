raphaelDOM.draw.rect =  function(box){

	var rect = box.rect();
	box.element = box.paper.rect(rect.left, rect.top, rect.width, rect.height);
	console.log('box: ', box.name, ':',  box, 'rect: ', rect);
	box.element.attr(_.extend({'stroke-width': 0, fill: 'black'}, box.drawAttrs || {}));
};