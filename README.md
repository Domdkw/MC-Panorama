# MC-Panorama - Create:Ponder 项目

## 项目概述

这是一个基于Web的Minecraft物品可视化与交互式学习平台，专注于机械动力(Create)模组的教学和展示。

## 核心功能

- **物品网格系统**: 5×9的Minecraft箱子布局，支持分页浏览
- **3D可视化引擎**: 基于Three.js构建的3D渲染引擎
- **学习流程系统**: 通过JSON配置文件定义学习流程
- **多语言支持**: 支持中文和英文界面

## 技术架构

- **核心框架**: 原生JavaScript (ES6+)
- **3D引擎**: Three.js
- **样式**: CSS3 with Minecraft风格设计
- **构建工具**: 无需构建，直接浏览器运行

### domdkw/v1引擎

核心渲染引擎位于 `/ponder/engine/domdkw/v1/` 目录，包含：
- **vanilla.js**: 实现Minecraft风格3D场景渲染
- **initCanvas.js**: 负责基础Canvas和Three.js环境初始化
- **nogltf.boot.html**: 引擎启动引导文件

## 使用方法

1. 直接打开 `index.html` 文件
2. 点击"机械动力：思索"按钮进入物品界面
3. 浏览物品网格，点击感兴趣的项目
4. 跟随3D场景中的提示进行交互学习

## 配置说明

### 物品配置 (`ponder/item.json`)
```json
[
  {
    "name": "dirt",
    "icon": "/ponder/minecraft/item/block/dirt.png",
    "process": "/ponder/process/dirt.json"
  }
]
```

### 流程配置 (domdkw/v1:`ponder/process/dirt.json`)
```json
{
  "title": {
    "name": "dirt",
    "icon": {
      "size": "normal",
      "tag": "minecraft:dirt"
    }
  },
  "loader": {
    "indexes": "minecraft/indexes/1.21.6.json",
    "engine": ["domdkw/v1/vanilla.js"],
    "boot": {
      "html": "/ponder/engine/domdkw/v1/nogltf.boot.html"
    }
  },
  "scenes": [
    {
      "description": "dirt is a block that is found in the overworld.",
      "fragment": [
        ["setblockfall('minecraft:dirt',0,0,5)", "idle(1)"]
      ]
    }
  ]
}
```

## 项目结构
```
MC-Panorama/
├── index.html          # 主页面
├── mc-background.js    # 背景管理
├── page.js            # 页面逻辑
├── styles.css         # 样式文件
├── ponder/            # 核心功能目录
│   ├── index.js       # 思索功能主逻辑
│   ├── item.json      # 物品配置
│   ├── process/       # 流程配置
│   ├── engine/        # 引擎插件
│   │   ├── domdkw/    # domdkw引擎实现
│   │   │   └── v1/    # v1版本引擎
│   │   │       ├── vanilla.js        # 核心渲染引擎(完善中)
│   │   │       └── nogltf.boot.html  # 引擎启动引导
│   │   └── create/     # Create引擎(待开发)
│   ├── minecraft/     # 资源文件
│   │   ├── indexes/   # 索引文件
│   │   ├── item/      # 物品资源(待补充)
│   │   └── textures/  # 纹理资源
│   └── process/       # 流程配置文件
├── assets/            # 静态资源
└── lang/              # 多语言支持(待补充)
```

## 未来开发计划

### 短期目标
- [ ] 增加更多机械动力物品
- [ ] 优化移动端体验
- [x] 添加声音效果
- [ ] 改进3D渲染性能

### 长期目标
- [ ] 支持更多模组
- [ ] 添加用户自定义流程功能
- [ ] 实现云端同步功能
- [ ] 构建社区分享平台

## 关于作者

作者技术水平有限，代码可能存在许多不足之处。项目仍在学习和改进中，欢迎各位提出建议和帮助改进。

## 许可证

本项目采用 **MIT许可证** - 详见 [LICENSE](LICENSE) 文件

## 支持与反馈

如有问题或建议，请通过GitHub Issues提交。

---

> 提示：本项目仍在开发中，代码质量可能不高，欢迎反馈和建议！