import path from 'path';
import commander from 'commander';
import dependencyTree from 'dependency-tree';

import pkg from '../package.json';

const { relative } = path;

const cwd = process.cwd();

let basePath = cwd;

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

function printTree(tree, level = 0) {
  Object.keys(tree).forEach(key => {
    console.log(' '.repeat(level * 2) + relative(basePath, key));
    printTree(tree[key], level + 1);
  });
}

function run(file, options) {
  // const {query, regular, base} = options;
  const { query, base } = options;

  if (base) basePath = base;

  const tree = dependencyTree(makeConfig(file, options));

  if (!query) {
    printTree(tree);
  }
}

commander
  .version(pkg.version)
  .description('See the dependencies tree of a module')
  .arguments('<file>')
  .option('-q, --query <query>', 'A query string to filter output')
  .option(
    '-r, --regular',
    'Regard query string as regular expression to filter output',
  )
  .option('-i, --ignore', 'Ignore files under node_modules')
  .option(
    '-d, --directory <directory>',
    'The directory containing all modules, default process.cwd()',
  )
  .option(
    '-b, --base <base>',
    'Base path to shorten the output lines, default process.cwd()',
  )
  .option('--rc <rc>', 'RequireJs config for AMD modules')
  .option('--wc <wc>', 'Webpack config for aliased modules')
  .option('--tc <tc>', 'TypeScript config')
  .action(run)
  .parse(process.argv);
