/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */
var offset;
var total;
var index;
var count;
function ProportionalLayout(nodes, size, options) {

    // Calculate total sum of ratios
    total = 0;
    for (index = 0; index < options.ratios.length; index++) {
        total += options.ratios[index];
    }

    offset = 0;
    for (index = 0, count = Math.min(nodes.length, options.ratios.length); index < count; index++) {
        if (options.direction) {
            nodes.get(index)
                .setSizeMode('relative', 'absolute')
                .setAbsoluteSize(0, ((size[1] - offset) / total) * options.ratios[index])
                .setPosition(0, offset);
            offset += (((size[1] - offset) / total) * options.ratios[index]);
        }
        else {
            nodes.get(index)
                .setSizeMode('absolute', 'relative')
                .setAbsoluteSize(((size[0] - offset) / total) * options.ratios[index], 0)
                .setPosition(offset, 0);
            offset += (((size[0] - offset) / total) * options.ratios[index]);
        }
        total -= options.ratios[index];
    }
}

module.exports = ProportionalLayout;
