# color-variable
把输入的颜色值替换为预定义的颜色变量（目前只支持less）

颜色变量定义文件
```less
@link-color: #aaa;
```

编辑的文件
```less
.link {
  color: #aaa;
}
```

替换后的文件
```less
.link {
  color: @link-color;
}
```

## 使用前配置
1. 在项目中创建`.colorvarrc.json` 文件
2. 设置变量文件路径
```json
{
  "variableFiles": ["./src/color.less"], // 定义颜色变量的文件
}
```

## 插件设置
* `colorVar.onSave`: 保存时自动替换
* `colorVar.alertWarning`: 找不到颜色对应的变量时，弹出警告
