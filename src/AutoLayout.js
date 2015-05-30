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
var c = require('cassowary/bin/c');

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
	_parse('[button(==button2)]');
	_parse('[button(==button2,==button3)]');

	/*var solver = new c.SimplexSolver();
	var x = new c.Variable({ value: 167 });
	var y = new c.Variable({ value: 200 });
	var eq = new c.Equation(x, new c.Expression(y));
	solver.addConstraint(eq);
	solver.addEditVar(y);
	solver.suggestValue(y, 100);
	solver.resolve();
	var val = x.value;
	console.log('val: ' + val);*/

	/*var solver = new c.SimplexSolver();

	// Declare variables
	var stark = new c.Variable({ value: 4 }),
	    lannister = new c.Variable({ value: 6 }),
	    tully = new c.Variable({ value: 2 }),
	    frey = new c.Variable({ value: 3 });

	// Declare expressions
	var goodies = c.plus(stark, tully),
	    baddies = c.plus(lannister, frey);

	// Declare constraints
	var wedding = new c.Inequality(baddies, c.GEQ, goodies);

	// Add constraints to the solver
	solver.add(wedding);

	// Suggest values and resolve
	solver.addEditVar(stark);
	solver.suggestValue(stark, 100);
	solver.resolve();

	// Get a resolved value
	var starksRemaining = stark.value;
	console.log('starksRemaining: ' + starksRemaining);*/

	var zero = new c.Variable({value: 0});
	var width = new c.Variable({value: 100});
	var height = new c.Variable({value: 100});
	var solver = new c.SimplexSolver();
	solver.addConstraint(new c.StayConstraint(zero, c.Strength.required, 0));
	solver.addConstraint(new c.StayConstraint(width, c.Strength.required, 0));
	solver.addConstraint(new c.StayConstraint(height, c.Strength.required, 0));

	var child = {
		left: new c.Variable(),
		top: new c.Variable(),
		width: new c.Variable(),
		height: new c.Variable(),
		right: new c.Variable(),
		bottom: new c.Variable()
	};

	solver.addConstraint(new c.Equation(child.right, c.plus(child.left, child.width)));
	solver.addConstraint(new c.Equation(child.bottom, c.plus(child.top, child.height)));

	solver.addConstraint(new c.Equation(child.left, 10));
	solver.addConstraint(new c.Equation(child.top, zero));
	solver.addConstraint(new c.Equation(child.right, width));
	solver.addConstraint(new c.Equation(child.bottom, height));

	solver.resolve();
	console.log('child: ' + JSON.stringify(child, undefined, 2));

}

function _parse(visualFormat) {
	var res = AutoLayoutParser.parse(visualFormat);
	console.log('--------------------');
	console.log('visualFormat: ' + visualFormat);
	console.log('result: ');
	console.log(JSON.stringify(res, null, 2));
}

module.exports = AutoLayout;
