---
title: 大选项列表
---

### 核心功能(Core functionality)

#### 输入(input *`-i`/`--input`*)

`String` /`String[]`/`{ [entryName:  String]: String}` 是这个包的入口点 (例如：你的 `main.js` 或者 `app.js` 或者 `index.js`)。如果你使用了`experimentalCodeSplitting`  ，你可以提供一个入口数组或者对象，它将会被绑定到对应的输出模块中/

#### 文件(file *`-o`/`--file`*)

`String` 变量是要写入的文件。也可用于生成 sourcemaps，如果适用。如果你使用了`experimentalCodeSplitting`并且`input`是数组，你必须指定`dir`而不是`file` 

#### 输出目录(output.dir *`--dir`*)

`String` 变量为放置所有产生文件的目录。只有在使用了 `experimentalCodeSplitting` 和`input`是数组的时候可用。这种情况下这个选项代替了`file`。

#### 格式(format *`-f`/`--output.format`*)

`String` 变量是生成包的格式。 下列之一:

* `amd` – 异步模块定义，用于像RequireJS这样的模块加载器
* `cjs` – CommonJS，适用于 Node 和 Browserify/Webpack
* `es` – 将软件包保存为ES模块文件
* `iife` – 一个自动执行的功能，适合作为`<script>`标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
* `umd` – 通用模块定义，以`amd`，`cjs` 和 `iife` 为一体
* `system`  – SystemJS 加载器的原生格式

#### 生成包名称(output.name *`-n`/`--name`*)

`String` 变量代表你的 `iife`/`umd` 包，同一页上的其他脚本可以访问它。

```js
// rollup.config.js
export default {
  ...,
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'MyBundle'
  }
};

// -> var MyBundle = (function () {...
```

我们也支持命名空间，所有你的名称可以包含点号选择符。生成的包将包含命名空间所需的配置

```
$ rollup -n "a.b.c"

/* ->
this.a = this.a || {};
this.a.b = this.a.b || {};
this.a.b.c = ...
*/
```
#### 插件(plugins)

插件对象 `数组 Array` (或一个插件对象) – 有关详细信息请参阅 [插件入门](#getting-started-with-plugins)。记住要调用导入的插件函数(即 `commonjs()`, 而不是 `commonjs`).

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'main.js',
  plugins: [
    resolve(),
    commonjs()
  ]
};
```

#### 外链(external *`-e`/`--external`*)

两者任一 `Function` 需要一个 `id` 并返回 `true`（外部引用）或 `false`（不是外部的引用），
或者 `Array` 应该保留在bundle的外部引用的模块ID。ID应该是：

1. 外部依赖的名称
2. 一个已被找到路径的ID（像文件的绝对路径）

```js
// rollup.config.js
import path from 'path';

export default {
  ...,
  external: [
    'some-externally-required-library',
    path.resolve( './src/some-local-file-that-should-not-be-bundled.js' )
  ]
};
```

当作为命令行参数给出时，它应该是以逗号分隔的ID列表：

```bash
rollup -i src/main.js ... -e foo,bar,baz
```

当提供的是函数，它包含了三个参数`(id, parent, isResolved)` 可以给你提供更细粒度上的控制：

* `id`  是相关模块的id
* `parent` 是进行导入模块的id
* `isResolved` 是`id` 是否被插件等解析的标识

#### 全局模块(output.globals *`-g`/`--globals`*)

`Object` 形式的 `id: name` 键值对，用于`umd`/`iife`包。例如：在这样的情况下...

```js
import $ from 'jquery';
```

...我们想告诉 Rollup `jquery` 模块的id等同于 `$` 变量:

```js
// rollup.config.js
export default {
  ...,
  format: 'iife',
  name: 'MyBundle',
  globals: {
    jquery: '$'
  }
};

/*
var MyBundle = (function ($) {
  // 代码到这里
}(window.jQuery));
*/.
```

或者，提供将外部模块ID转换为全局模块的功能。

当作为命令行参数给出时，它应该是一个逗号分隔的“id：name”键值对列表：

```bash
rollup -i src/main.js ... -g jquery:$,underscore:_
```


### 高级功能(Advanced functionality)

#### 路径(output.paths)

`Function`，它获取一个ID并返回一个路径，或者`id：path`对的`Object`。在提供的位置，这些路径将被用于生成的包而不是模块ID，从而允许您（例如）从CDN加载依赖关系：

```js
// app.js
import { selectAll } from 'd3';
selectAll('p').style('color', 'purple');
// ...

// rollup.config.js
export default {
  input: 'app.js',
  external: ['d3'],
  output: {
    file: 'bundle.js',
    format: 'amd',
    paths: {
      d3: 'https://d3js.org/d3.v4.min'
    }
  }
};

// bundle.js
define(['https://d3js.org/d3.v4.min'], function (d3) {

  d3.selectAll('p').style('color', 'purple');
  // ...

});
```

#### 代码banner和footer(output.banner/outputfooter -banner/— footer)

`String` 字符串以前置/追加 到文件束(bundle)。 你也可以使用一个成功返回`String`的`Promise`对象来异步的生成。(注意:“banner”和“footer”选项不会破坏sourcemaps)

```js
// rollup.config.js
export default {
  ...,
  banner: '/* my-library version ' + version + ' */',
  footer: '/* follow me on Twitter! @rich_harris */'
};
```

#### output.intro/output.outro --intro / --outro

`String`类似于 `banner`和`footer`，除了代码在*内部*任何特定格式的包装器(wrapper)。就像`banner` 和`footer`一样，你可以使用一个成功返回`String`的`Promise`对象

```js
export default {
  ...,
  intro: 'var ENVIRONMENT = "production";'
};
```

#### 缓存(cache)

`Object` 以前生成的包。使用它来加速后续的构建——Rollup只会重新分析已经更改的模块。

#### 警告(onwarn)

`Function` 将拦截警告信息。如果没有提供，警告将被复制并打印到控制台。

警告是至少有一个`code` 和 `message`属性的对象，这意味着您可以控制如何处理不同类型的警告：

```js
onwarn (warning) {
  // 跳过某些警告
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

  // 抛出异常
  if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

  // 控制台打印一切警告
  console.warn(warning.message);
}
```

许多警告也有一个`loc`属性和一个`frame`，你可以定位到警告的来源：

```js
onwarn ({ loc, frame, message }) {
  // 打印位置（如果适用）
  if (loc) {
    console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
    if (frame) console.warn(frame);
  } else {
    console.warn(message);
  }
}
```

#### 源文件映射(output.sourcemap *`-m`/`--sourcemap`*)

如果 `true`，将创建一个单独的sourcemap文件。如果 `inline`，sourcemap将作为数据URI附加到生成的`output`文件中。

#### 映射文件(output.sourcemapFile *`—sourcemapFile`*)

`String`是生成的包的位置。如果这是一个绝对路径，sourcemap中的所有源代码路径都将相对于它。 `map.file`属性是`sourcemapFile`的基本名称(basename)，因为sourcemap的位置被假定为与bundle相邻

如果指定 `output`，`sourcemapFile` 不是必需的，在这种情况下，将通过给bundle输出文件添加 “.map” 后缀来推断输出文件名。

#### output.interop *`--intro / -no--interop`*

`Boolean` 是否添加'interop块'。默认情况下（`interop：true`），为了安全起见，如果需要区分默认和命名导出，则Rollup会将任何外部依赖项“default”导出到一个单独的变量。这通常只适用于您的外部依赖关系（例如与Babel）（如果您确定不需要它），则可以使用“interop：false”来节省几个字节。

#### 输出扩展（output.extend *`--extend`/*`--no-extend`）

值为

`true` 或者`false` (默认是 `false`) –是否扩展由`umd  ` 或者`iife` 格式中的`name` 选项定义的全局变量。 值为 `true`, 全局变量将会被定义为 `(global.name = global.name || {})`. 值为false,  `name` 定义的全局变量将会被 `(global.name = {})`覆盖

#### 性能(perf *`--perf`*)

`true` or `false` (默认 `false`) –是否搜集性能时间线. When used from the command line or a configuration file, detailed measurements about the current bundling process will be displayed. When used from the JavaScript API, the returned bundle object will contain an aditional `getTimings()` function that can be called at any time to retrieve all accumulated measurements.

当通过命令行或者配置文件设置了后，当前绑定处理的性能细节测量将会被显示。 当使用JavaScript API，返回的包对象包含一个额外的 `getTimings()` ，它可以在任意时间调用查看累计测量值


### 危险区域(Danger zone)

你可能不需要使用这些选项，除非你知道你在做什么!

#### treeshake

值为`true` or `false`或者一个对象（看下面代码） (默认 `true`)。 否应用tree-shaking和微调tree-shaking的处理。设置为`false`将会生成更大的文件包但是会提高构建性能。如果你发现了一个由tree-shaking引起的bug，请提交Issue。也可以设置这个选项为一个对象实现tree-shaking同时会有以下额外的配置。

**treeshake.pureExternalModules** `true`/`false` (默认: `false`). If `true`, 假设没有导入可以引起修改全局变量或者日志记录等副作用的外部依赖

```javascript
// input file
import {unused} from 'external-a';
import 'external-b';
console.log(42);
```

```javascript
// output with treeshake.pureExternalModules === false
import 'external-a';
import 'external-b';
console.log(42);
```

```javascript
// output with treeshake.pureExternalModules === true
console.log(42);
```

**treeshake.propertyReadSideEffects** `true`/`false` (默认: `true`)。如果是`false`,假设读取一个对象没有任何副作用。这依赖于你的编码习惯，禁用这个选项将会显著减少软件包大小，但是如果依赖于getters或者非法访问属性值的错误信息可能会破坏该函数功能。

```javascript
// Will be removed if treeshake.propertyReadSideEffects === false
const foo = {
  get bar() {
    console.log('effect');
    return 'bar';
  }
}
const result = foo.bar;
const illegalAccess = foo.quux.tooDeep;
```

#### acorn

任何应该传递给Acorn的选项，例如`allowReserved：true`。  [Acorn documentation](https://github.com/acornjs/acorn/blob/master/README.md#main-parser) 包含更多的可用选项。

#### acornInjectPlugins

一个注入Acorn插件数组。为了使用插件，你需要传入注入函数并且设置它到 `acorn.plugins` 选项。例如，为了使用async iteration，你可以指定

```javascript
import acornAsyncIteration from 'acorn-async-iteration/inject';

export default {
    // … other options …
    acorn: {
        plugins: { asyncIteration: true }
    },
    acornInjectPlugins: [
        acornAsyncIteration
    ]
};
```

在你的rollup配置中。

#### context *`--content`*

默认情况下，模块的上下文 - 即顶级的`this`的值为`undefined`。在极少数情况下，您可能需要将其更改为其他内容，如 `'window'`。

#### moduleContext

和`options.context`一样，但是每个模块可以是`id: context`对的对象，也可以是`id => context`函数。

#### output.legacy *`-l / --legacy`*

`true` or `false` (默认 `false`) 。为了增加对诸如IE8之类的旧版环境的支持，通过剥离更多可能无法正常工作的现代化的代码，其代价是偏离ES6模块环境所需的精确规范。

#### output.exports *`--exports`*

`String` 使用什么导出模式。默认为`auto`，它根据`entry`模块导出的内容猜测你的意图：

* `default` – 如果你使用 `export default ...` 仅仅导出一个东西，那适合用这个
* `named` – 如果你导出多个东西，适合用这个
* `none` – 如果你不导出任何内容 (例如，你正在构建应用程序，而不是库)，则适合用这个

`default` 和 `named`之间的区别会影响其他人如何使用文件束(bundle)。如果您使用`default`，则CommonJS用户可以执行此操作，例如

```js
var yourLib = require( 'your-lib' );
```

使用 `named`，用户可以这样做：

```js
var yourMethod = require( 'your-lib' ).yourMethod;
```

有点波折就是如果你使用`named`导出，但是*同时也*有一个`default`导出，用户必须这样做才能使用默认的导出：

```js
var yourMethod = require( 'your-lib' ).yourMethod;
var yourLib = require( 'your-lib' )['default'];
```

#### output.amd *`--amd.id` and `--amd.define`*

`Object` 可以包含以下属性：

**amd.id** `String` 用于 AMD/UMD 软件包的ID：

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    id: 'my-bundle'
  }
};

// -> define('my-bundle', ['dependency'], ...
```

**amd.define** `String` 要使用的函数名称，而不是 `define`:

```js
// rollup.config.js
export default {
  ...,
  format: 'amd',
  amd: {
    define: 'def'
  }
};

// -> def(['dependency'],...
```

#### outp.indent *`--indent / --no-indent`*

`String` 是要使用的缩进字符串，对于需要缩进代码的格式（`amd`，`iife`，`umd`）。也可以是`false`（无缩进）或`true`（默认 - 自动缩进）

```js
// rollup.config.js
export default {
  ...,
  indent: false
};
```

#### output.strict *`--strict / --no-strict`*

`true`或`false`（默认为`true`） - 是否在生成的非ES6软件包的顶部包含'use strict'pragma。严格来说（geddit？），ES6模块*始终都是*严格模式，所以你应该没有很好的理由来禁用它。

#### output.freeze *`--freeze`/`--no-freeze`*

`true` or `false` (默认 `true`) – 是否冻结（使用 `Object.freeze()` ）那些可以动态访问的导入对象的命名空间 (举个例子 `import * as namespaceImportObject from...`) 

#### output.namespaceToStringTag *`--namespaceToStringTag`/*`--no-namespaceToStringTag`*

`true` or `false` (默认 `false`) – 是否将符合规范的`.toString()`标签添加到命名空间。如果设置了这个选项

```javascript
import * as namespace from './file.js';
console.log(String(namespace));
```

将会总是打印 `[object Module]`。

### 实验选项(Experimental options)

这些选项反应了一些尚未完全确定的新特性。具体的行为和使用可能会因此而改变。

#### experimentalDynamicImport *`--experimentalDynamicImport`*
`true` or `false` (默认 `false`) – 为动态导入添加必要的acorn插件，例如：

```javascript
import('./my-module.js').then(moduleNamespace => console.log(moduleNamespace.foo));
```
When used without `experimentalCodeSplitting`, statically resolvable dynamic imports will be automatically inlined into your bundle. Also enables the `resolveDynamicImport` plugin hook.

当不使用 `experimentalCodeSplitting`,静态解析动态引入将会自动嵌入到你输出bundle文件中。 `resolveDynamicImport` 插件钩子也可以使用。

#### experimentalCodeSplitting *`--experimentalCodeSplitting`*
`true` or `false` (默认 `false`) – 在指定多个入口时可用。如果启用这个选项，`input` 可以设置为一个入口数组构建到通过 `output.dir`指定的文件夹

* `output.dir`文件夹中生成的文件名与入口文件名对应
* 共享代码块会自动生成以避免块之间的代码重复.
* Enable the `experimentalDynamicImport` flag to generate new chunks for dynamic imports as well.
* 启用`experimentalDynamicImport` 也能为动态导入生成新代码块

代码切割同时需要`output.dir` 和输入数组， `output.file` 与代码切割工作流不兼容。

#### output.entryFileNames *`--entryFileNames`*

`String`用于在使用代码切割时命名`dir` 中入口输出文件。默认`"[alias].js"`。

#### output.chunkFileNames *`--chunkFileNames`*

`String`用于在使用代码切割时命名共享模块。默认`"[alias]-[hash].js"`。

#### output.assetFileNames *`--assetFileNames`*

`String` 在使用代码切割时，用于自定义包含在输出构建中的资产名字。默认`"assets/[name]-[hash][extname]"`。

#### manualChunks *`--manualChunks`*

`{ [chunkAlias: String]: String[] }` 允许创建自定义共享模块(chunk)。提供一个模块的别名和包含在该模块中的一系列组件(module)。组件和其组件一起被嵌入模块中。如果一个组件已经存在之前的模块中，当前模块会从其引用。以这种方式定义在模块中的组件被认为是一个可以独立执行其父导入的入口。

#### optimizeChunks *`--optimizeChunks`*

`true` or `false` (默认 `false)` -优化模块组的实现性功能。当在代码切割中产生大量的模块，它运行较小的块组合在一起，只要他们在 `chunkGroupingSize` 限制内。它会导致在某些情况下加载不必要的代码，从而减少模块的整体数量。默认情况下禁用，是因为在加载意外代码时可能会导致不必要的副作用。

#### chunkGroupingSize *`--chunkGroupingSize`*

`number` (默认 5000) - 应用模块组优化的时候允许价值的不必要资源总数量

### Watch options

这些选项仅在运行 Rollup 时使用 `--watch` 标志或使用 `rollup.watch` 时生效。

#### watch.chokidar

一个 `Boolean` 值表示应该使用 [chokidar](https://github.com/paulmillr/chokidar) 而不是内置的 `fs.watch`，或者是一个传递给 chokidar 的选项对象。

如果你希望使用它，你必须单独安装chokidar。


#### watch.include

限制文件监控至某些文件：

```js
// rollup.config.js
export default {
  ...,
  watch: {
    include: 'src/**'
  }
};
```


#### watch.exclude

防止文件被监控：

```js
// rollup.config.js
export default {
  ...,
  watch: {
    exclude: 'node_modules/**'
  }
};
```

#### watch.clearScreen

`true` or `false` (默认`true`) – 重新构建的时候是否清空屏幕