/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Hein Rutjes, 2015
 */

var AutoLayoutParser = require('./AutoLayoutParser');
var c = require('cassowary/bin/c');

/*
 * Relation types.
 * @enum {Number}
 */
var Relation = {
	LEQ: -1,
	EQ: 0,
	GEQ: 1
};

/*
 * Attribute types.
 * @enum {String}
 */
var Attribute = {
	CONST: 'const',
	LEFT: 'left',
	RIGHT: 'right',
	TOP: 'top',
	BOTTOM: 'bottom',
	WIDTH: 'width',
	HEIGHT: 'height'
	/*CENTERX: 'centerX',
	CENTERY: 'centerY'
	LEADING: 'leading',
	TRAILING: 'trailing'*/
};

/**
 * AutoLayout
 */
function AutoLayout() {
	this.solver = new c.SimplexSolver();
	this.views = {};
	this.constraints = [];
}
AutoLayout.Relation = Relation;
AutoLayout.Attribute = Attribute;

function _getConst(name, value) {
	var vr = new c.Variable({value: value});
	this.solver.addConstraint(new c.StayConstraint(vr, c.Strength.required, 0));
	return vr;
}

/**
 * Internal helper function for getting/creating a view attribute.
 */
function _getAttr(viewName, attr) {
	this.views[(viewName || '__parentview')] = this.views[(viewName || '__parentview')] || {
		name: viewName,
		attr: {}
	};
	var view = this.views[(viewName || '__parentview')];
	if (!view.attr[attr]) {
		switch (attr) {
			case Attribute.LEFT:
			case Attribute.TOP:
			case Attribute.WIDTH:
			case Attribute.HEIGHT:
				view.attr[attr] = new c.Variable({value: 0});
				if (!view.name) {
					if ((attr === Attribute.WIDTH) || (attr === Attribute.HEIGHT)) {
						this.solver.addEditVar(view.attr[attr]);
					}
					else {
						this.solver.addConstraint(new c.StayConstraint(view.attr[attr], c.Strength.required, 0));
					}
				}
				break;
			case Attribute.RIGHT:
				_getAttr.call(this, viewName, Attribute.LEFT);
				_getAttr.call(this, viewName, Attribute.WIDTH);
				view.attr[Attribute.RIGHT] = new c.Variable();
				this.solver.addConstraint(new c.Equation(view.attr[Attribute.RIGHT], c.plus(view.attr[Attribute.LEFT], view.attr[Attribute.WIDTH])));
				break;
			case Attribute.BOTTOM:
				_getAttr.call(this, viewName, Attribute.TOP);
				_getAttr.call(this, viewName, Attribute.HEIGHT);
				view.attr[Attribute.BOTTOM] = new c.Variable();
				this.solver.addConstraint(new c.Equation(view.attr[Attribute.BOTTOM], c.plus(view.attr[Attribute.TOP], view.attr[Attribute.HEIGHT])));
				break;
			/*case Attribute.CENTERX:
				view.attr[Attribute.TOP] = view.attr[Attribute.TOP] || new c.Variable();
				view.attr[Attribute.BOTTOM] = view.attr[Attribute.BOTTOM] || new c.Variable();
				break;
			case Attribute.CENTERY:
				break;*/
		}
	}
	return view.attr[attr];
}

/**
 * Sets the width and height of the parent view.
 *
 * @param {Number} width Width of the parent view.
 * @param {Number} height Height of the parent view.
 * @return {AutoLayout} this
 */
AutoLayout.prototype.setParentSize = function(width, height) {
	if ((this._parentWidth === width) &&
		(this._parentHeight === height)) {
		return;
	}
	if ((width !== undefined) && (this._parentWidth !== width)) {
		this._parentWidth = width;
		this.solver.suggestValue(_getAttr.call(this, undefined, Attribute.WIDTH), this._parentWidth);
	}
	if ((height !== undefined) && (this._parentHeight !== height)) {
		this._parentHeight = height;
		this.solver.suggestValue(_getAttr.call(this, undefined, Attribute.HEIGHT), this._parentHeight);
	}
	this.solver.resolve();
};

/*
AutoLayout.prototype.suggestValue = function(view, attr, value) {
	switch (attr) {
		case Attribute.LEFT:
		case Attribute.TOP:
		case Attribute.WIDTH:
		case Attribute.HEIGHT:
			attr = _getAttr.call(this, view, attr);
			break;
		default:
			throw 'Invalid atribute specified: ' + attr + ', only the following attributes can be suggested: LEFT, TOP, WIDTH & HEIGHT';
	}
	attr.suggestValue(attr, value);
};*/

/**
 * Internal helper function that adds a constraint to the solver.
 */
function _addConstraint(constraint) {
	this.constraints.push(constraint);
	var attr1 = _getAttr.call(this, constraint.view1, constraint.attr1);
	var attr2 = (constraint.attr2 === Attribute.CONST) ? _getConst.call(this, undefined, constraint.constant) : _getAttr.call(this, constraint.view2, constraint.attr2);
	var relation;
	switch (constraint.relation) {
		case Relation.LEQ:
			//relation = new c.Inequality(attr1, c.LEQ, c.plus(attr2, )
			break;
		case Relation.EQ:
			if (((constraint.multiplier === 1) && !constraint.constant) || (constraint.attr2 === Attribute.CONST)) {
				relation = new c.Equation(attr1, attr2);
			}
			else if ((constraint.multiplier !== 1) && constraint.constant) {
				throw 'todo';
			}
			else if (constraint.constant) {
				relation = new c.Equation(attr2, c.plus(attr1, constraint.constant));
			}
			else {
				throw 'todo';
			}
			break;
		case Relation.QEQ:
			break;
		default:
			throw 'Invalid relation specified: ' + relation;
	}
	this.solver.addConstraint(relation);
}

/**
 * Adds one or more constraint definitions.
 *
 * A constraint definition has the following format:
 *
 * ```javascript
 * constraint: {
 *   view1: {String},
 *   attr1: {AutoLayout.Attribute},
 *   relation: {AutoLayout.Relation},
 *   view2: {String},
 *   attr2: {AutoLayout.Attribute},
 *   multiplier: {Number},
 *   constant: {Number}
 * }
 * ```
 * @param {Object|Array} constraints Constraint definition or array of constraint definitions.
 * @return {AutoLayout} this
 */
AutoLayout.prototype.addConstraints = function(constraints) {
	if (Array.isArray(constraints)) {
		for (var i = 0; i < constraints.length; i++) {
			_addConstraint.call(this, constraints[i]);
		}
	}
	else {
		_addConstraint.call(this, constraints);
	}
	return this;
};

/**
 * Adds one or more constraints from a visual-format definition.
 * See `AutoLayout.constraintsFromVisualFormat`.
 *
 * @param {String|Array} visualFormat Visual format string or array of vfl strings.
 * @return {Array} this
 */
AutoLayout.prototype.addVisualFormat = function(visualFormat) {
	return this.addConstraints(AutoLayout.constraintsFromVisualFormat(visualFormat));
};

/**
 * Parses one or more visual format strings into an array of constraint definitions.
 *
 * TODO
 *
 * @param {String|Array} visualFormat Visual format string or array of vfl strings.
 * @return {AutoLayout} array of constraint definitions
 */
AutoLayout.constraintsFromVisualFormat = function(visualFormat) {
	visualFormat = Array.isArray(visualFormat) ? visualFormat : [visualFormat];
	var view1;
	var view2;
	var relation;
	var attr1;
	var attr2;
	var relationType;
	var item;
	var horizontal;
	var constraints = [];
	var res;
	for (var j = 0; j < visualFormat.length; j++) {
		res = AutoLayoutParser.parse(visualFormat[j]);
		horizontal = (res.orientation === 'horizontal');
		for (var i = 0; i < res.cascade.length; i++) {
			item = res.cascade[i];
			if (!Array.isArray(item) && item.hasOwnProperty('view')) {
				view1 = view2;
				view2 = item.view;
				if ((view1 !== undefined) && (view2 !== undefined) && relation) {
					attr1 = horizontal ? Attribute.RIGHT : Attribute.BOTTOM;
					attr2 = horizontal ? Attribute.LEFT : Attribute.TOP;
					if (!view1) {
						attr1 = horizontal ? Attribute.LEFT : Attribute.TOP;
					}
					if (!view2) {
						attr2 = horizontal ? Attribute.RIGHT : Attribute.BOTTOM;
					}
					switch (relation.relation) {
						case 'equal': relationType = Relation.EQ; break;
						case 'lessOrEqual': relationType = Relation.LEQ; break;
						case 'greaterOrEqual': relationType = Relation.GEQ; break;
						default: throw 'invalid relation-type: ' + relation.relation;
					}
					constraints.push({
						view1: view1,
						attr1: attr1,
						relation: relationType,
						view2: view2,
						attr2: attr2,
						multiplier: 1,
						constant: relation.constant
					});
				}
				relation = undefined;

				// process view size constraints
				if (item.constraints) {
					for (var n = 0; n < item.constraints.length; n++) {
						switch (item.constraints[n].relation) {
							case 'equal': relationType = Relation.EQ; break;
							case 'lessOrEqual': relationType = Relation.LEQ; break;
							case 'greaterOrEqual': relationType = Relation.GEQ; break;
							default: throw 'invalid relation-type: ' + item.constraints[n].relation;
						}
						constraints.push({
							view1: item.view,
							attr1: horizontal ? Attribute.WIDTH : Attribute.HEIGHT,
							relation: relationType,
							view2: undefined,
							attr2: Attribute.CONST,
							multiplier: 1,
							constant: item.constraints[n].constant
						});
					}
				}
			}
			else {
				relation = item[0];
			}
		}
	}
	return constraints;
};

module.exports = AutoLayout;
