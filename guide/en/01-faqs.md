---
title: 常见问题
---

#### 为什么ES模块比CommonJS更好?

ES模块是官方标准，也是JavaScript语言明确的发展方向，而CommonJS模块是一种特殊的传统格式，在ES模块被提出之前做为暂时的解决方案。 ES模块允许进行静态分析，从而实现像 tree-shaking 的优化，并提供诸如循环引用和动态绑定等高级功能。

#### 什么是 ‘tree-shaking’?

Tree-shaking, 也被称为 "live code inclusion," 它是清除实际上并没有在给定项目中使用的代码的过程，但是它可以更加高效。词汇来源查看：[与清除无用代码相似](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n)

#### 我如何在 CommonJS 模块中使用 Rollup ?

Rollup 力图实现 ES 模块的规范，而不一定是 Node.js, npm, `require()`, 和 CommonJS 的特性。 因此，加载 CommonJS 模块和使用 Node 模块位置解析逻辑都被实现为可选插件，默认情况下不在 Rollup 内核中。 你只需要执行 `npm install` 安装 [CommonJS](https://github.com/rollup/rollup-plugin-commonjs) 和 [node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 插件然后使用 `rollup.config.js` 配置文件启用他们，那你就完成了所有设置。

#### Rollup 是用来构建库还是应用程序？

Rollup 已被许多主流的 JavaScript 库使用，也可用于构建绝大多数应用程序。但是，如果想在旧版本浏览器中使用代码分离(code-splitting)或动态导入(dynamic imports)，则需要额外的运行时来处理加载缺失的 chunk。我们建议使用 [SystemJS Production Build](https://github.com/systemjs/systemjs#browser-production)，因为它能够很好地与 Rollup 系统格式输出(system format output)集成在一起，并且正确处理所有 ES 模块的实时绑定，导出边缘情况。或者，也可以使用 AMD 加载器。

#### 谁制作了 Rollup 的 Logo。太可爱了!

是 [Julian Lloyd](https://twitter.com/jlmakes) 制作的！
