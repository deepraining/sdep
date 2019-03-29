import path from 'path';
import commander from 'commander';
import dependencyTree from 'dependency-tree';

import pkg from '../package.json';

const { relative } = path;

const cwd = process.cwd();

let basePath = cwd;

/**
 * Make `dependency-tree` config.
 *
 * @param file
 * @param ignore
 * @param directory
 * @param rc
 * @param wc
 * @param tc
 * @returns {{filename: *, nodeModulesConfig: {entry: string}, nonExistent: Array, directory: *}}
 */
function makeConfig(file, { ignore, directory, rc, wc, tc }) {
  const config = {
    filename: file,
    directory: directory || cwd,
    nodeModulesConfig: { entry: 'module' },
    nonExistent: [],
  };

  if (ignore) config.filter = p => p.indexOf('node_modules') === -1;
  if (rc) config.requireConfig = rc;
  if (wc) config.webpackConfig = wc;
  if (tc) config.tsConfig = tc;

  return config;
}

/**
 * Prefix of one line.
 *
 * @param lastItems
 * @returns {string}
 */
function printTreePrefix(lastItems) {
  return lastItems
    .map((last, index) => {
      // first is always true
      if (index === 0) return '';

      return last ? '  ' : '| ';
    })
    .join('');
}

/**
 * Print a tree.
 *
 * @param tree
 * @param level
 * @param lastItems
 */
function printTree(tree, level = 0, lastItems = []) {
  const treeKeys = Object.keys(tree);
  treeKeys.forEach((key, index) => {
    const displayPath = relative(basePath, key);
    const isLastItem = index === treeKeys.length - 1;

    if (!level) console.log(displayPath);
    else if (level === 1)
      console.log(`${!isLastItem ? '├' : '└'} ${displayPath}`);
    else {
      console.log(
        `${printTreePrefix(lastItems)}${
          !isLastItem ? '├' : '└'
        } ${displayPath}`,
      );
    }

    printTree(tree[key], level + 1, [...lastItems, isLastItem]);
  });
}

/**
 * Run command
 *
 * @param file
 * @param options
 */
function run(file, options) {
  const { query, regular, base, full } = options;

  if (base) basePath = base;

  const tree = dependencyTree(makeConfig(file, options));

  if (!query) {
    printTree(tree);
    return;
  }

  const treeList = [];
  const queryRegExp = new RegExp(query);

  function makeTreeList(t, chain = []) {
    const treeKeys = Object.keys(t);

    if (full && !treeKeys.length) {
      treeList.push(chain);
      return;
    }

    treeKeys.forEach(key => {
      const displayKey = relative(basePath, key);
      if (
        !full &&
        (regular ? queryRegExp.test(key) : key.indexOf(query) > -1)
      ) {
        treeList.push([...chain, displayKey]);
        return;
      }
      makeTreeList(t[key], [...chain, displayKey]);
    });
  }

  makeTreeList(tree);

  let realTreeList = [];
  if (full) {
    realTreeList = treeList.filter(
      item =>
        !!item.find(i =>
          regular ? queryRegExp.test(i) : i.indexOf(query) > -1,
        ),
    );
  } else realTreeList = treeList;

  realTreeList.forEach(item => {
    item.forEach((i, index) => {
      if (!index) console.log(i);
      else console.log(`${'  '.repeat(index - 1)}└ ${i}`);
    });
  });
}

commander
  .version(pkg.version)
  .description('See the dependencies tree of a module')
  .arguments('<file>')
  .option('-q, --query <query>', 'a query string to filter output')
  .option(
    '-r, --regular',
    'regard query string as regular expression to filter output',
  )
  .option('-i, --ignore', 'ignore files under node_modules')
  .option(
    '-d, --directory <directory>',
    'the directory containing all modules, default process.cwd()',
  )
  .option(
    '-b, --base <base>',
    'base path to shorten the output lines, default process.cwd()',
  )
  .option('--rc <rc>', 'RequireJs config for AMD modules')
  .option('--wc <wc>', 'Webpack config for aliased modules')
  .option('--tc <tc>', 'TypeScript config')
  .option(
    '-f, --full',
    'show full dependencies chain when use a query string to filter output',
  )
  .action(run)
  .parse(process.argv);
