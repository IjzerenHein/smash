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
	CallbackStore.call(this);
	this._array = data || [];
	this.length = this._array.length;
}
ArrayDataSource.prototype = Object.create(CallbackStore.prototype);
ArrayDataSource.prototype.constructor = ArrayDataSource;

ArrayDataSource.prototype.get = function(index) {
	return this._array[index];
};

ArrayDataSource.prototype.push = function(node) {
	node = node || new Node();
	this._array.push(node);
	this.length = this._array.length;
	this.trigger('insert', node);
	return node;
};

ArrayDataSource.prototype.pop = function() {
	var node = this._array.pop();
	this.length = this._array.length;
	this.trigger('remove', node);
	return node;
};

ArrayDataSource.prototype.shift = function() {
	var node = this._array.shift();
	this.length = this._array.length;
	this.trigger('remove', node);
	return node;
};

ArrayDataSource.prototype.unshift = function(node) {
	node = node || new Node();
	this._array.unshift(node);
	this.length = this._array.length;
	this.trigger('insert', node);
	return node;
};

ArrayDataSource.prototype.insert = function(index, node) {
	node = node || new Node();
	index = (index === -1) ? this.length : index;
	this._array.splice(index, 0, node);
	this.length = this._array.length;
	this.trigger('insert', node);
	return node;
};

ArrayDataSource.prototype.remove = function(index) {
	var node = this._array.splice(index, 1)[0];
	this.length = this._array.length;
	this.trigger('remove', node);
	return node;
};

ArrayDataSource.prototype.removeAll = function() {
	while (this._nodes.array.length) {
		this.trigger('remove', this._array.pop());
	}
};

ArrayDataSource.prototype.forEach = function() {
	return this._array.forEach.apply(this._array, arguments);
};

module.exports = ArrayDataSource;
