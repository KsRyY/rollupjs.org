---
title: 命令行
---

我们一般在命令行中使用Rollup。你也可以提供一份配置文件（可要可不要）来简化命令行操作，同时还能启用Rollup的高级特性

### 配置文件(Configuration files)

Rollup的配置文件是可选的，但是使用配置文件的作用很强大，而且很方便，因此我们推荐你使用

配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做`rollup.config.js`，它通常位于项目的根目录

仔细查阅这个[选项清单](#big-list-of-options)，你可以根据你自己的需要把它配置到你的配置文件中

```javascript
// rollup.config.js
export default {
  // 核心选项
  input,     // 必须
  external,
  plugins,

  // 额外选项
  onwarn,
  perf,
  // 高危区
  acorn,
  acornInjectPlugins,
  treeshake,
  context,
  moduleContext,
  
  // 实验功能
  expreimentalCodeSplitting,
  manualChunks,
  optimizeChunks,
  chunkGroupingSize,

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    format,  // 必须
    file,    // 必须
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

    // 高危区
    exports,
    amd,
    indent,
    strict,
    freeze,
    legacy,namespaceToStringTag
    
    // 实验功能
    entryFileNames,
    chunkFileNames,
    assetsFileNames
  },
  watch: {
	chokidar,
    include,
    exclude,
    clearScreen
  }
};
```

你可以从配置文件导出一个数组，从而一次性从完全不相关的输入中构建bundles文件，在观察模式中也是如此。

如果是使用同一个输入构建不同的输出， 可以为每个输入应用一个输出数组选项：

```javascript
// rollup.config.js (构建了不至一个bundle)
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

如果你想同步的创建你的配置文件，Rollup可以返回一个携带有对象或者数组的 `Promise` 

```javascript
// rollup.config.js
import fetch from  'node-fetch';
export default fetch('/some-remote-service-or-file-which-returns-actual-config');
```

类似的,你也可以这样做

```javascript
// rollup.config.js (Promise resolving an array)
export default Promise.all([
  fetch('get-config-1'),
  fetch('get-config-2')
])
```
你必须使用配置文件才能执行以下操作：

- 把一个项目打包输出到多个文件
- 使用Rollup插件, 例如 [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 和 [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 。这两个插件可以让你加载Node.js里面的CommonJS模块

如果你想使用Rollup的配置文件，记得在命令行里加上`--config`或者`-c`
```bash
# 默认使用rollup.config.js
$ rollup --config

# 或者, 使用自定义的配置文件，这里使用my.config.js作为配置文件
$ rollup --config my.config.js
```

You can also export a function that returns any of the above configuration formats. This function will be passed the current command line arguments so that you can dynamically adapt your configuration to respect e.g. `--silent`. You can even define your own command line options if you prefix them with `config`:

你也可以导出一个函数并返回上面任意一种配置格式。这个函数传递了当前的命令行参数，因此，可以动态的调整配置，比如 `--silent`。你甚至可以自定义命令行选项通过使用config前缀。

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

如果运行`rollup --config --configDebug`，会使用debug配置

### 命令行的参数(Command line flags)

配置文件中的许多选项和命令行的参数是等价的。如果你使用这里的参数，那么将重写配置文件。想了解更多的话，仔细查阅这个[包办大量选项的清单](#big-list-of-options)

```bash
-c, --config                使用配置文件（如果使用了参数但是没有指定值，默认的是rollup.config.js）
-i, --input                 入口文件（可选参数<entry file>）
-o, --file<output>          输出的文件 (如果没有这个参数，则直接输出到控制台)
-f, --format [es]           输出的文件类型 (amd, cjs, es, iife, umd)
-e, --external              排除以模块ID的逗号分隔的列表
-g, --globals               以`module ID:Global` 键值对的形式，用逗号分隔开 
                              任何定义在这里模块ID定义添加到外部依赖
-n, --name                  生成UMD模块的名字
-m, --sourcemap             生成 sourcemap (`-m inline` for inline map)
-l, --legacy				支持IE8
--amd.id                    AMD模块的ID，默认是个匿名函数
--amd.define                使用Function来代替`define`
--no-strict                 在生成的包中省略`"use strict";`
--no-conflict               对于UMD模块来说，给全局变量生成一个无冲突的方法
--no-treeshake              不使用tree-shaking
--intro                     在打包好的文件的块的内部(wrapper内部)的最顶部插入一段内容
--outro                     在打包好的文件的块的内部(wrapper内部)的最底部插入一段内容
--banner                    在打包好的文件的块的外部(wrapper外部)的最顶部插入一段内容
--footer                    在打包好的文件的块的外部(wrapper外部)的最底部插入一段内容
--interop                   包含公共的模块（这个选项是默认添加的）
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

通过 `process.ENV` 传递额外的设置到配置文件

```sh
rollup -c --environment INCLUDE_DEPS,BUILD:production
```
将会设置 `process.env.INCLUDE_DEPS === 'true'` 和 `process.env.BUILD === 'production'`。你也可以多次使用此选项。在这种情况下，随后设置的变量将会覆盖先前的定义。这使得你可以覆盖package.json中的环境变量。

```json
// in package.json
{
  "scripts": {
    "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  }
}
```

如果执行一下脚本

```bash
npm run build -- --environment BUILD:development
```

配置文件将会收到`process.env.INCLUDE_DEPS === 'true'` 和 `process.env.BUILD === 'development'`.