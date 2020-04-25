# vscode-color-variable
把输入的颜色值替换为预定义的颜色变量，支持 Less 和 Sass

定义颜色变量名的文件
```less
@link-color: #aaa;
```

编辑的文件
```less
.foo {
    color: #0a1;
    background: rgb(170, 170, 170);
    border: 1px solid rgba(170, 170, 170, 0.1);
}
```

替换后的文件
```less
.foo {
  color: @link-color;
  background: @link-color;
  border: 1px solid fade(@link-color, 10%);
}
```

## 配置
在项目中创建`.colorvarrc.json` 文件
```js
{
  "variableFiles": ["./src/color.less"], // 定义颜色变量的文件
  "syntax": "less", // 语法，支持 less 和 scss 。默认 less
  "autoImport": "true", // 是否自动导入依赖的 variableFile
  "alias": {
    "@": "./src" // 等同于 webpack 中的alias
  },
  "usingAlias": "@", // 自动导入 variableFile 时，使用 alias ，例如 @import '~@/src/color.less'
  "singleQuote": false, // 自动导入时是否使用单引号， 默认 false
}
```

## 插件设置
* `colorVar.onSave`: 保存时自动替换
* `colorVar.alertWarning`: 找不到颜色对应的变量时，弹出警告
