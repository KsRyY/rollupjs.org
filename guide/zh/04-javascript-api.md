---
title: JavaScript API
---

Rollup 提供 JavaScript 接口那样可以通过 Node.js 来使用。你可以很少使用，而且很可能使用命令行接口，除非你想扩展 Rollup 本身，或者用于一些难懂的任务，例如自己编码生成bundles文件。

### rollup.rollup

 `rollup.rollup` 函数返回一个 Promise，它携带了一个 `bundle` 对象，此对象带有不同的属性及方法，如下：

```javascript
const rollup = require('rollup');

// see below for details on the options
const inputOptions = {...};
const outputOptions = {...};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.imports); // an array of external dependencies
  console.log(bundle.exports); // an array of names exported by the entry point
  console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
```


#### 输入参数(inputOptions)

`inputOptions` 对象包含下列属性 (查看[选项清单](#big-list-of-options) 以获得这些参数更详细的资料):

```js
const inputOptions = {
  // 核心参数
  input, // 唯一必填参数
  external,
  plugins,

  // 高级参数
  onwarn,
  cache,
  perf,

  // 危险参数
  acorn,
  acornInjectPlugins,
  treeshake,
  context,
  moduleContext
    
  //实验属性
  experimentalCodeSplitting,
  manualChunks,
  optimizeChunks,
  chunkGroupingSize
};
```


#### 输出参数(outputOptions)

`outputOptions` 对象包括下列属性 (查看 [选项清单](#big-list-of-options) 以获得这些参数更详细的资料):

```js
const outputOptions = {
  // 核心参数
  file,   // 若有bundle.write，必填
  format, // 必填
  dir,
  name,
  globals,

  // 高级参数
  paths,
  banner,
  footer,
  intro,
  outro,
  sourcemap,
  sourcemapFile,
  interop,
  extend,

  // 危险区域
  exports,
  amd,
  indent,
  strict,
  freeze,
  legacy,
  namespaceToStringTag,
  
  // 实验属性
  entryFileNames,
  chunkFileNames,
  assetsFileNames
};
```


### rollup.watch

Rollup 也提供了 `rollup.watch` 函数，当它检测到磁盘上单个模块已经改变，它会重新构建你的文件束。 当你通过命令行运行 Rollup，并带上 `--watch` 标记时，此函数会被内部使用。

```js
const rollup = require('rollup');

const watchOptions = {...};
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
  // event.code 会是下面其中一个：
  //   START        — 监听器正在启动（重启）
  //   BUNDLE_START — 构建单个文件束
  //   BUNDLE_END   — 完成文件束构建
  //   END          — 完成所有文件束构建
  //   ERROR        — 构建时遇到错误
  //   FATAL        — 遇到无可修复的错误
});

// 停止监听
watcher.close();
```

#### 监听参数(watchOptions)

`watchOptions` 参数是一个你会从一个配置文件中导出的配置 (或一个配置数据)。

```js
const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {
    chokidar,
    include,
    exclude,
    clearScreen
  }
};
```

查看以上文档知道更多 `inputOptions` 和 `outputOptions` 的细节, 或查询 [选项清单](#big-list-of-options) 关 `chokidar`, `include` 和 `exclude` 的资料。

### （TypeScript声明）TypeScript Declarations

我们已经支持TypeScript声明，如果你想在TypeScript环境中使用这些Api你可以这样做：

如果你关闭了 [skipLibCheck](https://www.typescriptlang.org/docs/handbook/compiler-options.html)，你需要安装这些依赖

```bash
npm install @types/acorn @types/chokidar source-map magic-string --only=dev
```