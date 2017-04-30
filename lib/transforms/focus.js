const { migrateSelector, makeParentFunctionAsync, isJQuerySelectExpression, addImportStatement } = require('../utils');

function createExpression(j, selector) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('focus'),
      migrateSelector(j, selector)
    )
  );
}

function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'focus';
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['focus']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;