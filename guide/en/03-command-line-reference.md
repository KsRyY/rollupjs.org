---
title: 命令行
---

我们一般在命令行中使用Rollup。你也可以提供一份配置文件（可要可不要）来简化命令行操作，同时还能启用Rollup的高级特性

### 配置文件

Rollup的配置文件是可选的，但是使用配置文件的作用很强大，而且很方便，因此我们推荐你使用

配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做`rollup.config.js`，它通常位于项目的根目录

仔细查阅这个[包办大量选项的清单](#big-list-of-options)，你可以根据你自己的需要把它配置到你的配置文件中

```javascript
// rollup.config.js
export default { // （对于有多个选项对象的情况）可以是一个数组
  // 核心选项
  input,     // 必须
  external,
  plugins,

  // 额外选项
  onwarn,
  perf,

  // danger zone
  acorn,
  acornInjectPlugins,
  treeshake,
  context,
  moduleContext,

  // 实验
  experimentalCodeSplitting,
  experimentalDynamicImport,

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    format,  // 必须
    file,
    dir,
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,
    extend,

    // 高危选项
    exports,
    amd,
    indent,
    strict,
    freeze,
    legacy,
    namespaceToStringTag
  },

  watch: {
    chokidar,
    include,
    exclude,
    clearScreen
  }
};
```

You can export an **array** from your config file to build bundles from several different unrelated inputs at once, even in watch mode. To build different bundles with the same input, you supply an array of output options for each input:

```javascript
// rollup.config.js (building more than one bundle)
export default [{
  input: 'main-a.js',
  output: {
    file: 'dist/bundle-a.js',
    format: 'cjs'
  }
}, {
  input: 'main-b.js',
  output: [
    {
      file: 'dist/bundle-b1.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle-b2.js',
      format: 'es'
    }
  ]
}];
```

If you want to create your config asynchronously, Rollup can also handle a `Promise` which resolves to an object or an array.

```javascript
// rollup.config.js
import fetch from  'node-fetch';
export default fetch('/some-remote-service-or-file-which-returns-actual-config');
```

Similarly, you can do this as well:

```javascript
// rollup.config.js (Promise resolving an array)
export default Promise.all([
  fetch('get-config-1'),
  fetch('get-config-2')
])
```

你必须使用配置文件才能执行以下操作：

- 把一个项目打包，然后输出多个文件
- 使用Rollup插件, 例如 [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 和 [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 。这两个插件可以让你加载Node.js里面的CommonJS模块

如果你想使用Rollup的配置文件，记得在命令行里加上`--config`或者`-c`
```bash
# 默认使用rollup.config.js
$ rollup --config

# 或者, 使用自定义的配置文件，这里使用my.config.js作为配置文件
$ rollup --config my.config.js
```

You can also export a function that returns any of the above configuration formats. This function will be passed the current command line arguments so that you can dynamically adapt your configuration to respect e.g. `--silent`. You can even define your own command line options if you prefix them with `config`:

```javascript
// rollup.config.js
import defaultConfig from './rollup.default.config.js';
import debugConfig from './rollup.debug.config.js';

export default commandLineArgs => {
  if (commandLineArgs.configDebug === true) {
    return debugConfig;
  }
  return defaultConfig;
}
```

If you now run `rollup --config --configDebug`, the debug configuration will be used.


### 命令行的参数

配置文件中的许多选项和命令行的参数是等价的。如果你使用这里的参数，那么将重写配置文件。想了解更多的话，仔细查阅这个[包办大量选项的清单](#big-list-of-options)

```
-c, --config                使用此配置文件
（如果使用此参数，但没有指定值，则默认使用 rollup.config.js）
-i, --input                 输入 (alternative to <entry file>)
-o, --file <output>         输出（如果没有这个参数，则直接输出到控制台）
-f, --format [es]           输出的文件类型（amd, cjs, es, iife, umd）
-e, --external              将以逗号分隔的模块 ID 列表排除
-g, --globals               以 `module ID:Global` 键值对的形式，用逗号分隔开
                              任何定义在这里模块 ID 定义添加到外部依赖
-n, --name                  生成 UMD 模块的名字
-m, --sourcemap             生成 sourcemap (`-m inline` for inline map)
-l, --legacy                支持 IE8
--amd.id                    AMD 模块的 ID，默认是个匿名函数
--amd.define                使用 Function 来代替 `define`
--no-strict                 在生成的模块中不输出 `"use strict";`。
--no-indent                 不缩进最终结果
--environment <values>      将缓解变量传递给配置文件
--no-conflict               对于 UMD 模块来说，给全局变量生成一个无冲突的方法
--no-treeshake              禁用 tree-shaking
--intro                     在打包好的文件的块的内部(wrapper内部)的最顶部插入一段内容
--outro                     在打包好的文件的块的内部(wrapper内部)的最底部插入一段内容
--banner                    在打包好的文件的块的外部(wrapper外部)的最顶部插入一段内容
--footer                    在打包好的文件的块的外部(wrapper外部)的最底部插入一段内容
--no-interop                不包含交互操作块(interop block)代码
```

此外，还可以使用以下参数：

#### `-h`/`--help`

打印帮助文档。

#### `-v`/`--version`

打印已安装的Rollup版本号。

#### `-w`/`--watch`

监听源文件是否有改动，如果有改动，重新打包

#### `--silent`

不要将警告打印到控制台。

#### `--environment <values>`

Pass additional settings to the config file via `process.ENV`.

```sh
rollup -c --environment INCLUDE_DEPS,BUILD:production

```
will set `process.env.INCLUDE_DEPS === 'true'` and `process.env.BUILD === 'production'`. You can use this option several times. In that case, subsequently set variables will overwrite previous definitions. This enables you for instance to overwrite environment variables in package.json scripts:

```json
// in package.json
{
  "scripts": {
    "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  }
}
```

If you call this script via
```bash
npm run build -- --environment BUILD:development
```

then the config file will receive `process.env.INCLUDE_DEPS === 'true'` and `process.env.BUILD === 'development'`.
