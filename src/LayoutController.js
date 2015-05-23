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
var ObjectDataSource = require('./ObjectDataSource');
var ArrayDataSource = require('./ArrayDataSource');

/**
 * LayoutController
 *
 * @class LayoutController
 * @constructor
 */
function LayoutController(options) {
	Node.call(this);

	this._comp = this.addComponent({
		onUpdate: _layout.bind(this),
		onSizeChange: _layout.bind(this)
	});
	this.options = {};
	this.setOptions(options || {});
}
LayoutController.prototype = Object.create(Node.prototype);
LayoutController.prototype.constructor = LayoutController;

function _layout() {
	if (this.layout && this.dataSource) {
		this.layout(this.dataSource, this.getSize(), this.options.layoutOptions);
	}
}

LayoutController.createDataSource = function(data) {
	return Array.isArray(data) ? new ArrayDataSource(data) : new ObjectDataSource(data);
};

LayoutController.prototype.reflowLayout = function() {
	this.requestUpdate(this._comp);
};

LayoutController.prototype.setOptions = function(options) {
	if (options.layout !== undefined) {
		this.setLayout(options.layout);
	}
	if (options.layoutOptions) {
		this.options.layoutOptions = options.layoutOptions;
		this.reflowLayout();
	}
	if (options.dataSource !== undefined) {
		this.setDataSource(options.dataSource);
	}
};

LayoutController.prototype.setLayout = function(layout, layoutOptions) {
	if (this.layout !== layout) {
		this.layout = layout;
		this.reflowLayout();
	}
};

LayoutController.prototype.getLayout = function() {
	return this.layout;
};

LayoutController.prototype.setDataSource = function(dataSource) {
	if (this._dataSourceInsert) {
		this._dataSourceInsert();
		this._dataSourceInsert = undefined;
	}
	if (this._dataSourceRemove) {
		this._dataSourceRemove();
		this._dataSourceRemove = undefined;
	}
	this.dataSource = dataSource;
	if (this.dataSource) {
		this._dataSourceInsert = this.dataSource.on('insert', function(node) {
			this.addChild(node);
			this.reflowLayout();
		}.bind(this));
		this._dataSourceRemove = this.dataSource.on('remove', function(node) {
			this.removeChild(node);
			this.reflowLayout();
		}.bind(this));
		this.dataSource.forEach(function(node) {
			this.addChild(node);
		}.bind(this));
	}
	this.reflowLayout();
};

module.exports = LayoutController;
