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
var LayoutController = require('./LayoutController');

/**
 * LayoutController
 *
 * @class LayoutController
 * @constructor
 */
function ScrollController(options) {
	LayoutController.apply(this, arguments);
}
ScrollController.prototype = Object.create(LayoutController.prototype);
ScrollController.prototype.constructor = ScrollController;


module.exports = ScrollController;
