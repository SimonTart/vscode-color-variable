# vscode-color-variable
[EN](./README) | [ZH](./zh.md)


Replace color with corresponding variable name. Support Less, Sass.

Define color variable file:
```less
@link-color: #aaa;
```

Edit content:
```less
.foo {
    color: #0a1;
    background: rgb(170, 170, 170);
    border: 1px solid rgba(170, 170, 170, 0.1);
}
```

Output content after replaced:
```less
.foo {
  color: @link-color;
  background: @link-color;
  border: 1px solid fade(@link-color, 10%);
}
```

## Config
Create file `.colorvarrc.json` in project.
```js
{
  "variableFiles": ["./src/color.less"], // define color variable file path
  "syntax": "less", // syntax，support less, sass. default is less
  "autoImport": "true", // if auto import variable file
  "alias": {
    "@": "./src" // equal webpack alias
  },
  "usingAlias": "@", // when auto import variable file, using alias. for example @import '~@/src/color.less'
  "singleQuote": false, // auto import if using single quote. default is false
}
```

## Setting
* `colorVar.onSave`: Auto replace when save
* `colorVar.alertWarning`: If there is a color not found variable name. Alert warning
