# sdep

[中文文档](./README.md)

See the dependencies tree of a module.

## quick start

Install sdep:

```
npm install sdep -g
```

Usage:

```
sdep [options] <file>
```

## options

- `-q, --query <query>`: a query string to filter output
- `-r, --regular`: regard query string as regular expression to filter output
- `-i, --ignore`: ignore files under node_modules
- `-d, --directory <directory>`: the directory containing all modules, default process.cwd()
- `-b, --base <base>`: base path to shorten the output lines, default process.cwd()
- `--rc <rc>`: RequireJs config for AMD modules
- `--wc <wc>`: Webpack config for aliased modules
- `--tc <tc>`: TypeScript config
- `-f, --full`: show full dependencies chain when use a query string to filter output

## used libraries

- [commander.js](https://github.com/tj/commander.js)
- [node-dependency-tree](https://github.com/dependents/node-dependency-tree)

## examples

#### see a file's dependencies hierarchy

```
sdep example/index.js
```

```
example/index.js
├ example/css/css.css
├ example/css/scss.scss
├ example/css/less.less
├ example/jsx.jsx
| ├ node_modules/react/index.js
| | ├ node_modules/react/cjs/react.production.min.js
| | | └ node_modules/object-assign/index.js
| | └ node_modules/react/cjs/react.development.js
| |   ├ node_modules/object-assign/index.js
| |   └ node_modules/prop-types/checkPropTypes.js
| |     └ node_modules/prop-types/lib/ReactPropTypesSecret.js
| ├ node_modules/react-dom/index.js
| | ├ node_modules/react-dom/cjs/react-dom.production.min.js
| | | ├ node_modules/react/index.js
| | | | ├ node_modules/react/cjs/react.production.min.js
| | | | | └ node_modules/object-assign/index.js
| | | | └ node_modules/react/cjs/react.development.js
| | | |   ├ node_modules/object-assign/index.js
| | | |   └ node_modules/prop-types/checkPropTypes.js
| | | |     └ node_modules/prop-types/lib/ReactPropTypesSecret.js
| | | ├ node_modules/object-assign/index.js
| | | └ node_modules/scheduler/index.js
| | |   ├ node_modules/scheduler/cjs/scheduler.production.min.js
| | |   └ node_modules/scheduler/cjs/scheduler.development.js
| | └ node_modules/react-dom/cjs/react-dom.development.js
| |   ├ node_modules/react/index.js
| |   | ├ node_modules/react/cjs/react.production.min.js
| |   | | └ node_modules/object-assign/index.js
| |   | └ node_modules/react/cjs/react.development.js
| |   |   ├ node_modules/object-assign/index.js
| |   |   └ node_modules/prop-types/checkPropTypes.js
| |   |     └ node_modules/prop-types/lib/ReactPropTypesSecret.js
| |   ├ node_modules/object-assign/index.js
| |   ├ node_modules/prop-types/checkPropTypes.js
| |   | └ node_modules/prop-types/lib/ReactPropTypesSecret.js
| |   ├ node_modules/scheduler/index.js
| |   | ├ node_modules/scheduler/cjs/scheduler.production.min.js
| |   | └ node_modules/scheduler/cjs/scheduler.development.js
| |   └ node_modules/scheduler/tracing.js
| |     ├ node_modules/scheduler/cjs/scheduler-tracing.production.min.js
| |     └ node_modules/scheduler/cjs/scheduler-tracing.development.js
| └ example/wel.jsx
|   └ node_modules/react/index.js
|     ├ node_modules/react/cjs/react.production.min.js
|     | └ node_modules/object-assign/index.js
|     └ node_modules/react/cjs/react.development.js
|       ├ node_modules/object-assign/index.js
|       └ node_modules/prop-types/checkPropTypes.js
|         └ node_modules/prop-types/lib/ReactPropTypesSecret.js
└ example/async/index.js
  └ example/async/index.css
```

#### see a file's dependencies chain which contains react

```
sdep example/index.js -q react
```

```
example/index.js
└ example/jsx.jsx
  └ node_modules/react/index.js
example/index.js
└ example/jsx.jsx
  └ node_modules/react-dom/index.js
example/index.js
└ example/jsx.jsx
  └ example/wel.jsx
    └ node_modules/react/index.js
```

#### see a file's dependencies chain which contains less or scss

```
sdep example/index.js -q 'less|scss' -r
```

```
example/index.js
└ example/css/scss.scss
example/index.js
└ example/css/less.less
```
