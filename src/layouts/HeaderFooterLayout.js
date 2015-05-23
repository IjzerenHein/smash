/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */
function HeaderFooterLayout(nodes, size, options) {
    nodes.header
        .setSizeMode('relative', 'absolute')
        .setAbsoluteSize(0, options.headerSize);
    nodes.content
        .setDifferentialSize(0, -(options.headerSize + options.footerSize))
        .setPosition(0, options.headerSize, 0);
    nodes.footer
        .setSizeMode('relative', 'absolute')
        .setAbsoluteSize(0, options.footerSize)
        .setPosition(0, size[1] - options.footerSize, 0);
}

module.exports = HeaderFooterLayout;
