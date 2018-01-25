const {
  createFindAllExpression,
  isJQuerySelectExpression,
  addImportStatement,
  writeImportStatements,
} = require('../../utils');

/**
 * Creates a `findAll(selector).slice(-1)[0]` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    j.callExpression(
      j.memberExpression(
        createFindAllExpression(j, findArgs),
        j.identifier('slice')
      ), [j.identifier('-1')]
    ), j.literal(0)
  );
}

/**
 * Check if `node` is a `this.$(selector).last()` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, path) {
  let node = path.node;
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object, path)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'last';
}

/**
 * Transforms `this.$(selector).last()` to `findAll(selector).slice(-1)[0]`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter((path) => isJQueryExpression(j, path))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  if (replacements.length > 0) {
    addImportStatement(['findAll']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;