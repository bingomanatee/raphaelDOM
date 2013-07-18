raphaelDOM
===

An attempt to produce a library for using nested transforms to render our Raphael.

Raphael is an excellent library but it uses absolute coordinates, meaning it is very difficult to develop a "grid
based" design based on relative fractions of a given region.

This library computes rectangular regions based on percentages and offsets/margins similar to how DOM operates;
unlike browser DOM it includes the ability to work within horizontally or vertically rows/columns of equally
distributed regions.

These boxes can then generate Raphael elements within those regions.

Very useful to create charts and graphs within arbitrary regions.

## Boxes and Rects

Boxes are the equivalent of DOM elements; they have margin, padding, height and width; margin and padding
can be single values or discrete objects of dimensions for each side.

When you need to get the absolute dimension of a Box the box renders out a Rect, which is an immutable record of static
dimensional properties. These can be the basis of a Raphael element.

As with DOM ,

* padding affects the offset of child boxes within a given box, but does not affect the owning boxes
dimension.
* margin offsets a box relative to its parent's box.
* a box that has both margins and is inset within a parent with padding will have the maximum offset based on
  both values.
* Margins expressed as percents are measured against a parent's width and height.

Note that unlike browser DOM positioning is based on an "anchor" point relative to the parent. (i.e., and it works.)
That is, if you set a boxes' anchor to BR (bottom Right) it will extend left and up from the upper right corner of the
parent. (or their inner box if they have padding).

Because every box has an explicit anchor, it is quite possible for a box to "leak out" from the parent's boundaries if
its witdh/height and margin add up to more than 100% of the bounding box of the parent. This is intentional, to allow
a child to "peek out" around its parents, for instance when you want to design a tab, you can have it be BL oriented
with a 100% bottom margin and a fixed height.
