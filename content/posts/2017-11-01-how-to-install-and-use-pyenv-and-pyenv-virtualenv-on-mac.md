+++
title = "如何在 Mac 下安装和使用 pyenv 与 pyenv-virtualenv"
slug = "how-to-install-and-use-pyenv-and-pyenv-virtualenv-on-mac"
description = "使用 Pyenv 方便管理或切换 Python 版本"

[taxonomies]
tags = ["python"]

[extra]
hero = "images/how-to-install-and-use-pyenv-and-pyenv-virtualenv-on-mac/hero.png"
+++

## [pyenv](https://github.com/pyenv/pyenv)

> 使用Pyenv方便管理/切换Python版本

### 1、安装

```bash
# 通过 Homebrew 安装
brew update
brew install pyenv
```

### 2、配置

1. 编辑配置文件

```bash
# 使用 zsh shell
vim ~/.zshrc

# 使用系统默认
vim ~/.bash_profile
```

在 **.zshrc** 或 **.bash_profile** 文件最后写入：

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

if which pyenv > /dev/null;
  then eval "$(pyenv init -)";
fi
```

2. 使配置生效

```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

### 3、使用

* 查看可安装的版本

```bash
pyenv install --list
```

* 安装python版本

```bash
pyenv install 3.6.3
```

* 查看当前已安装的python版本

```bash
pyenv versions
```

{{ image(src="https://user-images.githubusercontent.com/9312677/32269178-a8af1d5a-bebf-11e7-904a-e8273a32742d.png", alt="pyenv") }}

*已安装3.6.2 与 3.6.3 版本, 当前使用的版本: 3.6.3*


* 设置python版本

```bash
# 对所有的Shell全局有效，会把版本号写入到~/.pyenv/version文件中
pyenv global 3.6.3

# 只对当前目录有效，会在当前目录创建.python-version文件
pyenv local 3.6.3

# 只在当前会话有效
pyenv shell 3.6.3

# 可通过配置PYENV_VERSION环境变量或编辑~/.python-version文件设置会话默认使用的python版本
echo "3.6.3" > ~/.python-version
# or
echo 'export PYENV_VERSION="3.6.3"' >> ~/.zshrc && source ~/.zshrc
```

* 重置版本设置

> 只有 pyenv shell 和 pyenv local 命令有--unset参数

```bash
pyenv shell --unset
pyenv local --unset
```

* 卸载版本

```bash
pyenv uninstall 3.6.3
```

## [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)

> pyenv-virtualenv 是pyenv的插件，为pyenv设置的python版本提供隔离的虚拟环境，设置虚拟环境后，在当前目录下面安装的第三方库都不会影响其他环境

### 1、安装

```bash
brew update
brew install pyenv-virtualenv
```

### 2、配置

1. 编辑配置文件

```bash
# 使用 zsh shell
vim ~/.zshrc

# 使用系统默认
vim ~/.bash_profile
```

在 **.zshrc** 或 **.bash_profile** 文件最后写入：

```bash
# pyenv-virtualenv
if which pyenv-virtualenv-init > /dev/null;
  then eval "$(pyenv virtualenv-init -)";
fi
```

2. 使配置生效

```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

### 3、使用

* 从当前版本创建virtualenv

```bash
# 当前版本为3.6.3
pyenv virtualenv xxx-3.6.3
```

* 指定版本创建virtualenv

```bash
#pyenv virtualenv 版本号 虚拟环境名
pyenv virtualenv 3.6.3 xxx-3.6.3
```

* 查看已创建的virtualenv

```bash
pyenv versions
```

<img width="470" alt="2017-11-01-17-20-55" src="https://user-images.githubusercontent.com/9312677/32269156-981852c2-bebf-11e7-9cdb-65fba2598f87.png">

* 激活和停用virtualenv

```bash
# 手动激活
pyenv activate 虚拟环境名
pyenv deactivate

# 自动激活
# 使用pyenv local 虚拟环境名
# 会把`虚拟环境名`写入当前目录的.python-version文件中
# 关闭自动激活 -> pyenv deactivate
# 启动自动激活 -> pyenv activate xxx-3.6.3
pyenv local xxx-3.6.3
```

* 删除现有virtualenv

```bash
pyenv uninstall 虚拟环境名
```
