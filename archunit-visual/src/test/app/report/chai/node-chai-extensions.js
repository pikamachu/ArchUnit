'use strict';

import chai from 'chai';
import {Vector} from '../../../../main/app/report/vectors';

const Assertion = chai.Assertion;

const MAXIMUM_DELTA = 0.0001;

const nodesFrom = root => Array.from(root.getSelfAndDescendants());

const convertActualAndExpectedToStrings = (actual, args) => {
  const expectedNodeFullNames = Array.isArray(args[0]) ? args[0] : Array.from(args);

  const actualStrings = actual.map(n => n.getFullName()).sort();
  const expectedStrings = expectedNodeFullNames.sort();
  return {actualStrings, expectedStrings};
};

Assertion.addMethod('locatedWithinWithPadding', function (parent, padding) {
  const node = this._obj;
  const distanceToNodeRim = new Vector(node.nodeCircle.relativePosition.x, node.nodeCircle.relativePosition.y).length() + node.nodeCircle.getRadius();
  new Assertion(distanceToNodeRim + padding).to.be.at.most(parent.getRadius() + MAXIMUM_DELTA);
});

Assertion.addMethod('notOverlapWith', function (sibling, padding) {
  const node = this._obj;
  const distanceBetweenMiddlePoints = Vector.between(node.nodeCircle.relativePosition, sibling.nodeCircle.relativePosition).length();
  const radiusSum = node.nodeCircle.getRadius() + sibling.nodeCircle.getRadius();
  //here is added 1, because the collide-force-layout does not guarantee that the circle do not overlap
  new Assertion(radiusSum + padding).to.be.at.most(distanceBetweenMiddlePoints + 1);
});

Assertion.addMethod('containExactlyNodes', function (nodes) {
  const actFullNames = Array.from(this._obj, node => node.getFullName()).sort();
  const expFullNames = Array.from(nodes).sort();
  new Assertion(actFullNames).to.deep.equal(expFullNames);
});

Assertion.addMethod('containOnlyClasses', function () {
  const actual = nodesFrom(this._obj).filter(node => node._isLeaf());
  const {actualStrings, expectedStrings} = convertActualAndExpectedToStrings(actual, arguments);

  new Assertion(actualStrings).to.deep.equal(expectedStrings);
});

Assertion.addMethod('containNoClasses', function () {
  const actual = nodesFrom(this._obj).filter(node => node._isLeaf() && !node.isPackage());

  //noinspection BadExpressionStatementJS -> Chai magic
  new Assertion(actual).to.be.empty;
});