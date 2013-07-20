/*! raphaelDOM 2013-07-20 */
var raphaelDOM={draw:{},utils:{getProp:function(target,fields){if(!_.isArray(fields)){fields=_.toArray(arguments).slice(1)}hasField=_.find(fields,function(field){return target.hasOwnProperty(field)});if(!hasField){throw new Error("cannot find any field "+fields.join(",")+" in target)")}return target[hasField]||0},propBasis:function(field){switch(field){case"width":case"left":case"right":return"width";break;case"top":case"bottom":case"height":return"height";break;default:throw new Error("cannot find basis for "+field)}},scale:function(scale,basis){if(isNaN(basis))throw new Error("non basis passed to scale: "+basis);if(_.isNumber(scale))return scale;if(/%$/.test(scale)){scale=new Number(scale.replace("%",""));return scale*basis/100}else{throw new Error("strange scale ",+scale)}}}};raphaelDOM.Dimension=function(){function Dimension(){this.value=0;var args=_.toArray(arguments);this.init.apply(this,args)}Dimension.prototype={inset:function(rect){rect=rect.clone();rect.left+=this.getLeft();rect.right-=this.getRight();rect.top+=this.getTop();rect.bottom-=this.getBottom();rect.recalculate();return rect},expand:function(rect){rect=rect.clone();rect.left-=ths.getLeft();rect.right+=this.getRight();rect.top-=this.getTop();rect.bottom+=this.getBottom();rect.recalculate();return rect},getLeft:function(basis){if(!basis.TYPE=="RECT")throw new Error("basis must be rect");var value=raphaelDOM.utils.getProp(this,"left","width","value");return raphaelDOM.scale(value,basis)},getRight:function(basis){if(!basis.TYPE=="RECT")throw new Error("basis must be rect");var value=raphaelDOM.utils.getProp(this,"right","width","value");return raphaelDOM.scale(value,basis)},getTop:function(basis){if(!basis.TYPE=="RECT")throw new Error("basis must be rect");if(this.basis.root)return 0;var value=raphaelDOM.utils.getProp(this,"top","height","value");return raphaelDOM.scale(value,basis)},getBottom:function(basis){if(!basis.TYPE=="RECT")throw new Error("basis must be rect");var value=raphaelDOM.utils.getProp(this,"bottom","height","value");return raphaelDOM.scale(value,basis)},init:function(){var args=_.toArray(arguments);switch(args.length){case 0:this.value=0;break;case 1:if(_.isObject(args[0])){_.extend(this,args[0])}else{this.value=args[0]}break;case 2:this.width=args[0];this.height=args[1];break;case 3:throw new Error("no three argument API for Dimension");break;case 4:default:_.each("left","top","right","bottom",function(f,i){this[f]=args[i]},this);break}}};return Dimension}();raphaelDOM.Rect=function(){var _string=_.template("x: <%= left %> ... <%= right %>(<%= width %>), y: <%= top %> ... <%= bottom %>(<%= height %>)");function Rect(left,top,width,height){this.init(left,top,width,height)}Rect.prototype={TYPE:"RECT",init:function(left,top,width,height){if(_.isObject(left)){this.init(left.left,left.top,left.width||0,left.height||0);if(!left.hasOwnProperty("width")&&left.hasOwnProperty("bottom")){this.bottom=left.bottom;this._recalcHeight()}if(!left.hasOwnProperty("height")&&left.hasOwnProperty("right")){this.right=left.right;this._recalcWidth()}}else{this.left=left;this.top=top;this.width=width;this.height=height;this.right=left+width;this.bottom=top+height}this.validate()},validate:function(){if(_.any(["left","right","top","bottom","height","width"],function(field){return isNaN(this[field])},this)){throw new Error("invalid rect: "+this.toString())}},toString:function(){return _string(this)},intersect:function(rect){var r2=new raphaelDOM.Rect({left:Math.max(this.left,rect.left),right:Math.min(this.right,rect.right),top:Math.max(this.top,rect.top),bottom:Math.min(this.bottom,rect.bottom)});r2.validate();return r2},inset:function(inset){inset=_.isObject(inset)?inset:{value:inset};var left=raphaelDOM.utils.getProp(inset,"left","width","value");var right=raphaelDOM.utils.getProp(inset,"right","width","value");var top=raphaelDOM.utils.getProp(inset,"top","height","value");var bottom=raphaelDOM.utils.getProp(inset,"bottom","height","value");return this._inset(left,top,right,bottom)},outset:function(outset){outset=_.isObject(outset)?outset:{value:outset};outset.value|=0;var left=raphaelDOM.utils.getProp(outset,"left","width","value");var right=raphaelDOM.utils.getProp(outset,"right","width","value");var top=raphaelDOM.utils.getProp(outset,"top","height","value");var bottom=raphaelDOM.utils.getProp(outset,"bottom","height","value");return this._outset(left,top,right,bottom)},clone:function(){return new raphaelDOM.Rect(this)},_inset:function(l,t,r,b){var rect=this.clone();l=raphaelDOM.utils.scale(l,this.width);r=raphaelDOM.utils.scale(r,this.width);t=raphaelDOM.utils.scale(t,this.height);b=raphaelDOM.utils.scale(b,this.height);rect.left+=l;rect.right-=r;rect.top+=t;rect.bottom-=b;rect._recalcWidth();rect._recalcHeight();return rect},_outset:function(l,t,r,b){var rect=this.clone();rect.left-=l;rect.right+=r;rect.top-=t;rect.bottom+=b;rect._recalcWidth();rect._recalcHeight();return rect},recalculate:function(){this._recalcWidth();this._recalcHeight()},_recalcWidth:function(){this.width=this.right-this.left},_recalcHeight:function(){this.height=this.bottom-this.top},frameInMe:function(rect,align){var offsetLeft,offsetTop;switch(align){case"TL":offsetLeft=this.left;offsetTop=this.top;break;case"TR":offsetLeft=this.right-rect.width;offsetTop=this.top;break;case"BL":offsetLeft=this.left;offsetTop=this.bottom-rect.height;break;case"BR":offsetLeft=this.right-rect.width;offsetTop=this.bottom-rect.height;break}return rect.offset(offsetLeft,offsetTop)},offset:function(x,y){var rect=this.clone();rect.left+=x;rect.right+=x;rect.top+=y;rect.bottom+=y;return rect}};return Rect}();raphaelDOM.Box=function(){var _rgb=_.template("rgb(<%= red %>,<%= green %>, <%= blue %>)");var _hsl=_.template("hsl(<%= hue %>, <%= sat %>%, <%= light %>%)");function Box(name,params,parent,paper){this.anchor="TL";this.margin=0;this.padding=0;this.width="100%";this.height="100%";this.rows=1;this.cols=1;this.drawType="rect";this.color={red:0,green:0,blue:0};this.colorMode="rgb";this.drawAttrs={};if(params)_.extend(this,params);this.name=name;this._children=[];this.parent=parent;this.paper=paper||(parent?parent.paper:null);this.marginDim=new raphaelDOM.Dimension(this.margin);this.paddingDim=new raphaelDOM.Dimension(this.padding)}Box.prototype={TYPE:"raphaelDOM.BOX",is_root:function(){return this.parent instanceof jQuery||!(this.parent.TYPE=="raphaelDOM.BOX")},parentRect:function(){if(this.is_root()){return new raphaelDOM.Rect(0,0,this.parent.width(),this.parent.height())}else{return this.parent.rect(true)}},rect:function(inner){var parentRect=this.parentRect();var marginRect=parentRect.inset(this.marginDim);var width=raphaelDOM.utils.scale(this.width,parentRect.width);var height=raphaelDOM.utils.scale(this.height,parentRect.height);var left,top;switch(this.anchor){case"TL":left=marginRect.left;top=marginRect.top;break;case"TR":left=marginRect.right-width;top=marginRect.top;break;case"T":left=marginRect.left+(marginRect.width-width)/2;top=marginRect.top;break;case"BL":left=marginRect.left;top=marginRect.bottom-height;break;case"BR":left=marginRect.right-width;top=marginRect.bottom-height;break;case"B":left=marginRect.left+(marginRect.width-width)/2;top=marginRect.bottom-height;break}var rect=new raphaelDOM.Rect(left,top,width,height);return inner?rect.inset(this.paddingDim):rect},child:function(name){var child=new Box(name||this.name+" child "+this._children.length,{},this);this._children.push(child);return child},setWidth:function(width){this.width=width;return this},setHeight:function(height){this.height=height;return this},setAnchor:function(a){this.anchor=a.replace(/top/i,"T").replace(/left/i,"L").replace(/bottom/i,"B").replace(/right/,"R").replace(/[^TLBR]/g,"");return this},setPadding:function(p){this.paddingDim=new raphaelDOM.Dimension(p);return this},setTopPadding:function(m){this.paddingDim.top=m;return this},setBottomPadding:function(m){this.paddingDim.bottom=m;return this},setLeftPadding:function(m){this.paddingDim.left=m;return this},setRightPadding:function(m){this.paddingDim.right=m;return this},setMargin:function(p){this.marginDim=new raphaelDOM.Dimension(p);return this},setTopMargin:function(m){this.marginDim.top=m;return this},setBottomMargin:function(m){this.marginDim.bottom=m;return this},setLeftMargin:function(m){this.marginDim.left=m;return this},setRightMargin:function(m){this.marginDim.right=m;return this},_computeFill:function(){if(this.color&&_.isObject(this.color)){switch(this.colorMode){case"rgb":this.drawAttrs.fill=_rgb(this.color);break;case"hsl":this.drawAttrs.fill=_hsl(this.color);break}}},setDrawType:function(type){if(!_.contains(["none","calc","rect","box","grid"],type)){throw new Error("bad draw type "+type)}this.drawType=type;return this},draw:function(paper){if(paper){this.paper=paper}switch(this.drawType){case"none":break;case"calc":raphaelDOM.draw.compute(this);break;case"grid":raphaelDOM.draw.grid(this);break;case"rect":case"box":this._computeFill();raphaelDOM.draw.rect(this);default:}_.each(this._children,function(child){child.draw(this.paper)},this)}};return Box}();raphaelDOM.draw.rect=function(box){var _DEBUG=false;var rect=box.rect();box.element=box.paper.rect(rect.left,rect.top,rect.width,rect.height);if(_DEBUG)console.log("box: ",box.name,":",box,"rect: ",rect);box.element.attr(_.extend({"stroke-width":0,fill:"black",title:box.name},box.drawAttrs||{}))};raphaelDOM.draw.grid=function(paper){var _cell_name_template=_.template("<%= name %> row <%= row %> column <%= column %>");return function(box){var rect=box.rect(true);var cell_name_template=box.cell_name_template||_cell_name_template;var columns=Math.floor(box.columns)||1;var columnMargin=box.columnMargin||0;var columnMarginWidth=columnMargin?raphaelDOM.utils.scale(columnMargin,rect.width):0;var columnsWidth=rect.width-(columns-1)*columnMarginWidth;var columnWidth=columnsWidth/columns;var rows=Math.floor(box.rows)||1;var rowMargin=box.rowMargin||0;var rowMarginHeight=rowMargin?raphaelDOM.utils.scale(rowMargin,rect.height):0;var rowsHeight=rect.height-(rows-1)*rowMarginHeight;var rowHeight=rowsHeight/rows;console.log("grid specs: ",{columns:columns,columnMargin:columnMargin,columnWidth:columnWidth,rows:rows,rowMargin:rowMargin,rowHeight:rowHeight});box._children=[];var totalColumnLeftMargin=0;_.each(_.range(0,columns),function(column){var params={column:column,columns:columns,rows:rows,columnWidth:columnWidth,columnMarginWidth:columnMarginWidth,rect:rect};var width=box.setColumnWidth?box.setColumnWidth(params):columnWidth;params.width=width;var columnLeftMargin=box.setColumnMargin?box.setColumnMargin(params):columnMarginWidth;var totalRowTopMargin=0;_.each(_.range(0,rows),function(row){params={row:row,columns:columns,rows:rows,rowHeight:rowHeight,rect:rect,rowMarginHeight:rowMarginHeight};var height=box.setRowHeight?box.setRowHeight(params):rowHeight;params.height=height;var rowTopMargin=box.setRowMargin?box.setRowMargin(params):rowMarginHeight;var cell=box.child(cell_name_template({name:box.name,row:row,column:column})).setLeftMargin(totalColumnLeftMargin).setTopMargin(totalRowTopMargin).setWidth(width).setHeight(height).setDrawType("rect");if(box.processCell){box.processCell(cell,column,row)}cell.draw(paper);console.log("cell specs: ",{height:height,width:width,rowTopMargin:rowTopMargin,columnLeftMargin:columnLeftMargin,totalColumnLeftMargin:totalColumnLeftMargin,totalRowTopMargin:totalRowTopMargin});totalRowTopMargin+=rowHeight+rowTopMargin});totalColumnLeftMargin+=columnLeftMargin+width})}}();