/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */

//var Node = require('famous/core/Node');
var AutoLayoutParser = require('./AutoLayoutParser');

/**
 * AutoLayout
 */
function AutoLayout(options) {
	_parse('|[background]|');
	_parse('V:|[background]|');
	_parse('|-[background]-|');
	_parse('|-50-[background]-|');
	_parse('[background]-70-[background2]');
	_parse('[button(>=50)]');
}

function _parse(visualFormat) {
	var res = AutoLayoutParser.parse(visualFormat);
	console.log('--------------------');
	console.log('visualFormat: ' + visualFormat);
	console.log('result: ');
	console.log(JSON.stringify(res, null, 2));
}

module.exports = AutoLayout;
