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
var LayoutNode = require('./LayoutNode');

/**
 * LayoutController
 *
 * @class LayoutController
 * @constructor
 */
function LayoutController(options) {
	Node.call(this);

	this._nodes = {}; // all nodes
	this._data = {
		source: undefined,
		nodes: {}, // nodes that are in the dataSource
		insertOffFn: undefined,
		removeOffFn: undefined
	};

	this._comp = this.addComponent({
		onUpdate: _layout.bind(this),
		onSizeChange: _layout.bind(this)
	});
	this.options = {};
	this.setOptions(options || {});
}
LayoutController.prototype = Object.create(Node.prototype);
LayoutController.prototype.constructor = LayoutController;

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
	if (this._data.source === dataSource) {
		return;
	}
	if (this._data.insertOffFn) {
		this._data.insertOffFn();
		this._data.insertOffFn = undefined;
	}
	if (this._data.removeOffFn) {
		this._data.removeOffFn();
		this._data.removeOffFn = undefined;
	}
	this._data.source = dataSource;
	this.data = this._data.source;
	for (id in this._data.nodes) {
		this._data.nodes[id].inDataSource = false;
	}
	if (this._data.source) {
		this._data.insertOffFn = this._data.source.on('insert', _insert.bind(this));
		this._data.removeOffFn = this._data.source.on('remove', _remove.bind(this));
		this._data.source.forEach(function(node, id) {
			this._nodes[id] = this._nodes[id] || new LayoutNode();
			this._nodes[id].setNode(node);
			this._nodes[id].inDataSource = true;
			this._data.nodes[id] = this._nodes[id];
		}.bind(this));
	}
	var id;
	for (id in this._data.nodes) {
		if (!this._data.nodes[id].inDataSource) {
			delete this._data.nodes[id];
		}
	}
	this.reflowLayout();
};

LayoutController.prototype.getDataSource = function() {
	return this._data.source;
};

function _layout() {
	var id;
	var node;
	for (id in this._nodes) {
		this._nodes[id].reset(true);
	}
	if (this.layout) {
		this.layout(this._data.nodes, this.getSize(), this.options.layoutOptions);
	}
	for (id in this._nodes) {
		node = this._nodes[id];
		node.reset(false);
		if (!node.inLayout && node.inSceneGraph) {
			this.removeChild(node.node);
			if (!node.inDataSource) {
				delete this._nodes[id];
				delete this._data.nodes[id];
			}
		}
		else if (node.inLayout && !node.inSceneGraph) {
			node.inSceneGraph = true;
			this.addChild(node.node);
		}
	}
}

function _insert(id) {
	this._nodes[id] = this._nodes[id] || new LayoutNode();
	this._nodes[id].setNode(this._data.source.get(id));
	this._nodes[id].inDataSource = true;
	this._data.nodes[id] = this._nodes[id];
	this.reflowLayout();
}

function _remove(id) {
	this._nodes[id].inDataSource = false;
	delete this._data.nodes[id];
	this.reflowLayout();
}

module.exports = LayoutController;
