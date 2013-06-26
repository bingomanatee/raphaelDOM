describe('basic raphaelDOM', function () {

	describe('#Rect', function () {

		var rectA, rectB;

		before(function () {
			rectA = new raphaelDOM.Rect(0, 0, 150, 300);
		})
		it('should be able to inset a rect', function () {

			var insetRect = rectA.inset(20);

			insetRect.left.should.eql(20);
			insetRect.right.should.eql(130);

			insetRect.top.should.eql(20);
			insetRect.bottom.should.eql(280);
			insetRect.width.should.eql(110);
			insetRect.height.should.eql(260);
		})
	});

	describe('#Box', function () {

		describe('child measurements', function () {

			var box;

			before(function () {
				box = new raphaelDOM.Box('foo', {


				}, {

					width:  function () { return 400; },
					height: function () { return 300; }
				});
			})

			it('should be able to establish basic left/right/width/height values from an "element"', function () {
				var rect = box.rect();

				rect.left.should.eql(0, 'rect left is zero');
				rect.top.should.eql(0, 'rect top is zero');

				rect.width.should.eql(400, 'rect width is 400');
				rect.height.should.eql(300, 'rect width is 300');

			});

			it('should be able to generate a child half as wide', function () {

				var child = box.child('bar').setWidth('50%');
				var rect = child.rect();

				rect.left.should.eql(0, 'child also has left 0');
				rect.top.should.eql(0, 'child also has top 0');

				rect.width.should.eql(200, 'child should be half as wide');
				rect.height.should.eql(300, 'child should be as high as parent');

			});

			it('should be able to generate a child half as tall', function () {

				var child = box.child('bar').setHeight('50%');
				var rect = child.rect();

				rect.left.should.eql(0, 'child also has left 0');
				rect.top.should.eql(0, 'child also has top 0');

				rect.width.should.eql(400, 'child should be as wide as parent');
				rect.height.should.eql(150, 'child should be haf as high as parent');

			});

			it('should be able to generate a child half as wide with LR anchor', function () {

				var child = box.child('bar').setWidth('50%').setAnchor('BR');
				var rect = child.rect();

				rect.left.should.eql(200, 'child has left 200');
				rect.top.should.eql(0, 'child also has top 0');

				rect.width.should.eql(200, 'child should be half as wide');
				rect.height.should.eql(300, 'child should be as high as parent');

			});

			it('should be able to generate a child half as tall with BR anchor', function () {

				var child = box.child('bar').setHeight('50%').setAnchor('BR');
				var rect = child.rect();

				rect.left.should.eql(0, 'child also has left 0');
				rect.top.should.eql(150, 'child  has top 150');

				rect.width.should.eql(400, 'child should be as wide as parent');
				rect.height.should.eql(150, 'child should be haf as high as parent');

			})
		})

		describe('child measurements with padding', function () {

			describe('equal padding', function () {

				var box;

				before(function () {
					box = new raphaelDOM.Box('foo', {
						padding: 20
					}, {

						width:  function () { return 400; },
						height: function () { return 300; }
					});
				})

				it('should be able to establish basic left/right/width/height values from an "element"', function () {

					/* ********** test the root box *********** */
					var rect = box.rect();

					rect.left.should.eql(0, 'rect left is 0');
					rect.top.should.eql(0, 'rect top is 0');

					rect.width.should.eql(400, 'rect width is 400');
					rect.height.should.eql(300, 'rect width is 300');

				});

				it('should be able to generate a child - less padding', function () {

					/* ********** test a half as wide box *********** */

					var child = box.child('bar');
					var rect = child.rect();

					rect.left.should.eql(20, 'child has left 20');
					rect.top.should.eql(20, 'child has top 20');

					rect.width.should.eql(360, 'child should be half as wide');
					rect.height.should.eql(260, 'child should be as high as parent');

				});

				it('should be able to generate a child half as wide - less padding', function () {

					var child = box.child('bar').setWidth('50%');
					var rect = child.rect();

					rect.left.should.eql(20, 'child has left 20');
					rect.top.should.eql(20, 'child has top 20');

					rect.width.should.eql(180, 'child should be half as wide');
					rect.height.should.eql(260, 'child should be as high as parent');

				});

				it('should be able to generate a child half as tall', function () {

					var child = box.child('bar').setHeight('50%');
					var rect = child.rect();

					rect.left.should.eql(20, 'child also has left 0');
					rect.top.should.eql(20, 'child also has top 0');

					rect.width.should.eql(360, 'child should be as wide as parent');
					rect.height.should.eql(130, 'child should be haf as high as parent');

				});

				it('should be able to generate a child half as wide with BR anchor', function () {

					var child = box.child('bar').setWidth('50%').setAnchor('BR');
					var rect = child.rect();

					rect.left.should.eql(200, 'child has left 200');
					rect.top.should.eql(20, 'child also has top 0');

					rect.width.should.eql(180, 'child should be half as wide');
					rect.height.should.eql(260, 'child should be as high as parent');

				});

				it('should be able to generate a child half as tall with BR anchor', function () {

					var child = box.child('bar').setHeight('50%').setAnchor('BR');
					var rect = child.rect();

					rect.left.should.eql(20, 'child also has left 20');
					rect.top.should.eql(150, 'child  has top 150');

					rect.width.should.eql(360, 'child should be as wide as parent');
					rect.height.should.eql(130, 'child should be haf as high as parent');

				})
			})

			describe('equal padding, percent', function () {

				var box;

				before(function () {
					box = new raphaelDOM.Box('foo', {
						padding: '10%'
					}, {

						width:  function () { return 400; },
						height: function () { return 300; }
					});
				});

				it('should be able to establish basic left/right/width/height values from an "element"', function () {

					/* ********** test the root box *********** */
					var rect = box.rect();

					rect.left.should.eql(0, 'rect left is 0');
					rect.top.should.eql(0, 'rect top is 0');

					rect.width.should.eql(400, 'rect width is 400');
					rect.height.should.eql(300, 'rect width is 300');

				});

				it('should be able to generate a child - less % padding', function () {

					/* ********** test a half as wide box *********** */

					var child = box.child('bar');
					var rect = child.rect();

					rect.left.should.eql(40, 'child has left 40');
					rect.top.should.eql(30, 'child has top 30');

					rect.width.should.eql(320, 'child width should be inset from parent to 320');
					rect.height.should.eql(240, 'child height should be inset from parent to 240');

				});

				it('should be able to generate a child half as wide - less padding', function () {

					var child = box.child('bar').setWidth('50%');
					var rect = child.rect();

					rect.left.should.eql(40, 'child has left 40');
					rect.top.should.eql(30, 'child has top 30');

					rect.width.should.eql(160, 'child should be half as wide');
					rect.height.should.eql(240, 'child should be as high as parent');

				});

				it('should be able to generate a child half as tall - less percent padding', function () {

					var child = box.child('bar').setHeight('50%');
					var rect = child.rect();

					rect.left.should.eql(40, 'child also has left 40');
					rect.top.should.eql(30, 'child also has top 30');

					rect.width.should.eql(320, 'child should be as wide as parent');
					rect.height.should.eql(120, 'child should be haf as high as parent');

				});

				it('should be able to generate a child half as wide with BR anchor', function () {

					var child = box.child('bar').setWidth('50%').setAnchor('BR');
					var rect = child.rect();

					rect.left.should.eql(200, 'child has left 200');
					rect.top.should.eql(30, 'child also has top 0');

					rect.width.should.eql(160, 'child should be half as wide');
					rect.height.should.eql(240, 'child should be as high as parent');

				});

				it('should be able to generate a child half as tall with BR anchor', function () {

					var child = box.child('bar').setHeight('50%').setAnchor('BR');
					var rect = child.rect();

					rect.left.should.eql(40, 'child also has left 40');
					rect.top.should.eql(150, 'child  has top 150');

					rect.width.should.eql(320, 'child should be as wide as parent');
					rect.height.should.eql(120, 'child should be haf as high as parent');

				})
			})

		});

	});

})