/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */

var AutoLayout = require('./AutoLayout');

var al = new AutoLayout();
al.addVisualFormat('V:|[header(50)][content][footer(50)]|');
al.addVisualFormat('|-(100)-[header]-(100)-|');

module.exports = function(nodes, size, options) {
	al.setParentSize(size[0], size[1]);
	for (var key in al.views) {
		var view = al.views[key];
		var node = nodes[view.name];
		if (node) {
			node.setSizeMode(view.attr.width ? 'absolute' : 'relative', view.attr.height ? 'absolute' : 'relative', 'relative');
			node.setAbsoluteSize(view.attr.width ? view.attr.width.value : 0, view.attr.height ? view.attr.height.value : 0, 0);
			node.setPosition(view.attr.left ? view.attr.left.value : 0, view.attr.top ? view.attr.top.value : 0, 0);
		}
	}
};
