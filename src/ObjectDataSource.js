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
var CallbackStore = require('famous/utilities/CallbackStore');

/**
 * NodesDataSource
 *
 * @class NodesDataSource
 * @constructor
 */
function ObjectDataSource(data) {
	CallbackStore.call(this);
	if (data) {
		for (var id in data) {
			this[id] = data[id];
		}
	}
}
ObjectDataSource.prototype = Object.create(CallbackStore.prototype);
ObjectDataSource.prototype.constructor = ObjectDataSource;

ObjectDataSource.prototype.set = function(id, node) {
	if (!this[id]) {
		this[id] = node || new Node();
		this.trigger('insert', id);
	}
	else if (!node || (node !== this[id])) {
		this.trigger('remove', id);
		this[id] = node;
		this.trigger('insert', id);
	}
	return this[id];
};

ObjectDataSource.prototype.get = function(id) {
	return this[id];
};

ObjectDataSource.prototype.remove = function(id) {
	if (this[id]) {
		var node = this[id];
		delete this[id];
		this.trigger('remove', id);
		return node;
	}
};

ObjectDataSource.prototype.removeAll = function() {
	for (var id in this) {
		this.trigger('remove', id);
		delete this[id];
	}
};

ObjectDataSource.prototype.forEach = function(callback) {
	for (var id in this) {
		if (this.hasOwnProperty(id) && (id !== '_events')) {
			callback(this[id], id);
		}
	}
};

module.exports = ObjectDataSource;
