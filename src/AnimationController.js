/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */

var Event = require('./Event');

/**
 * Animating between famo.us views in awesome ways.
 *
 * @class AnimationController
 * @constructor
 */
function AnimationController(node, options) {
	this.root = new 
    _createLayout.call(this);

    if (options) {
        this.setOptions(options);
    }
}