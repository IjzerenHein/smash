/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */

var Node = require('famous/core/Node');

/**
 * HeaderFooterLayout
 *
 * @class HeaderFooterLayout
 * @constructor
 */
function HeaderFooterView(options) {
	Node.call(this);

	this.header = this.addChild();
	this.header.setSizeMode('relative', 'absolute');
	this.content = this.addChild();
	this.content.setSizeMode('relative', 'relative');
	this.footer = this.addChild();
	this.footer.setSizeMode('relative', 'absolute');
	this.footer.setAlign(0, 1, 0);
	this.footer.setMountPoint(0, 1, 0);

	this._options = {};
	this.setOptions({
		headerSize: 50,
		footerSize: 50
	});
	this.setOptions(options || {});
}
HeaderFooterView.prototype = Object.create(Node.prototype);
HeaderFooterView.prototype.constructor = HeaderFooterView;

HeaderFooterView.prototype.setOptions = function(options) {
	if ((options.headerSize !== undefined) && (options.headerSize !== this._options.headerSize)) {
		this._options.headerSize = options.headerSize;
		this.header.setAbsoluteSize(0, options.headerSize);
		this.content.setPosition(0, this._options.headerSize, 0);
		this.content.setDifferentialSize(0, -(this._options.headerSize + this._options.footerSize));
	}
	if ((options.footerSize !== undefined) && (options.footerSize !== this._options.footerSize)) {
		this._options.footerSize = options.footerSize;
		this.footer.setAbsoluteSize(0, options.footerSize);
		this.content.setPosition(0, this._options.headerSize, 0);
		this.content.setDifferentialSize(0, -(this._options.headerSize + this._options.footerSize));
	}
};

module.exports = HeaderFooterView;
