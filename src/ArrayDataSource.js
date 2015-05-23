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
 * @class ArrayDataSource
 * @constructor
 */
function ArrayDataSource(data) {
	Array.call(this);
	this._callbacks = new CallbackStore();
	this.on = this._callbacks.on.bind(this._callbacks);
}
ArrayDataSource.prototype = Object.create(Array.prototype);
ArrayDataSource.prototype.constructor = ArrayDataSource;

ArrayDataSource.prototype.push = function(node) {
	node = node || new Node();
	Array.prototype.push(node);
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.pop = function() {
	var node = Array.prototype.pop();
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.shift = function() {
	var node = Array.prototype.shift();
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.unshift = function(node) {
	node = node || new Node();
	Array.prototype.unshift(node);
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.insert = function(index, node) {
	node = node || new Node();
	index = (index === -1) ? this.length : index;
	Array.prototype.splice(index, 0, node);
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.remove = function(index) {
	var node = Array.prototype.splice(index, 1)[0];
	this._callbacks.trigger('change');
	return node;
};

ArrayDataSource.prototype.removeAll = function() {
	if (this.length) {
		Array.prototype.splice(0, this.length);
		this._callbacks.trigger('change');
	}
};

module.exports = ArrayDataSource;
