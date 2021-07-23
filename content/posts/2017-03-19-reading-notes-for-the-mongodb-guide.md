+++
title = "MongoDB 权威指南阅读笔记"
description = "MongoDB 是一个面向文档的数据库，文档是 MongoDB 的核心概念，文档是键值对的一个有序集"
date = 2017-03-19

[taxonomies]
tags = ["mongodb"]

[extra]
hero = "images/reading-notes-for-the-mongodb-guide/mongodb.png"
+++

## 1、概念

1. 文档是键值对的一个[**有序**]集

```js
// 两个文档是不同的
{ x: 1, y: 2 }
{ y: 2, x: 1 }
```

2. 集合是一组文档，一个集合相当于一张表
3. 使用子集合组织数据
4. 多个文档组成集合，多个集合组成数据库
5. 数据库命名：UTF-8字符串
    - 不能是空字符串 ("")
    - 不能含有 /, \, ., ", *, <, >, :, |, $ (一个空格), \0 (空字符) 。基本上,只能使用ASCII中的字母和数字。
    - 数据库名区分大小写，建议数据库名应全部小写
    - 数据库名最多为64字节

## 2、基本操作

* ### **基本命令**

1. 启动数据库服务

```bash
> mongodb
```

2. 运行SHELL

```bash
> mongo
```

3. 连接数据库

```bash
# 连接test数据库
mongo 127.0.0.1:27017/test
```

4. 查看db当前指向的数据库

```bash
> db
test # 当前数据库为test
```

5. 切换数据库

```bash
> use blog # 切换到数据库 blog
switched to db blog
> db
blog
```

* ### **插入数据**

1. 插入单条：

```bash
> post = { "title": "My blog post", "date": new Date() }
> db.blog.insert(post)
WriteResult({ "nInserted" : 1 })
```

2. 插入多条：

> batchInsert 函数已被废弃，直接使用 insert， insetMany 插入多条数据 (参数为一个数组)

> 从数据Feed 或 MySQL 导入数据使用 ***mongoimport***

- 导入数据文件到mongodb

```bash
# 导入json数组数据到blog数据库的link集合中
mongoimport -h "127.0.0.1:27017" -d "blog" -c "link" --file "/Users/eteplus/Downloads/link.json" --jsonArray

# 导入csv数据到blog数据库的article集合中
mongoimport -h "127.0.0.1:27017" -d "blog" -c "article" --fields "article_id,wechat_id,title,description,content,cover,type,published_at,created_at,updated_at,remark" --type csv --file "/Users/eteplus/Downloads/article.csv"
```

- 批量操作

```bash
> db.blog.insert([{"_id": 0}, {"_id": 1}, {"_id": 2}])
> BulkWriteResult({
  "writeErrors" : [ ],
  "writeConcernErrors" : [ ],
  "nInserted" : 3,
  "nUpserted" : 0,
  "nMatched" : 0,
  "nModified" : 0,
  "nRemoved" : 0,
  "upserted" : [ ]
})
```

> 批量插入时，当集合中已存在_id相同的文档时，这个文档以及之后的所有的文档全部插入失败：

```bash
> db.blog.insert([{"_id": 3}, {"_id": 4}, {"_id": 5}, {"_id": 5}, {"_id": 6}, {"_id": 7}])
> BulkWriteResult({
  "writeErrors" : [
    {
      "index" : 3,
      "code" : 11000,
      "errmsg" : "E11000 duplicate key error index: test.blog.$_id_ dup key: { : 5.0 }",
      "op" : {
        "_id" : 5
      }
    }
  ],
  "writeConcernErrors" : [ ],
  "nInserted" : 3,
  "nUpserted" : 0,
  "nMatched" : 0,
  "nModified" : 0,
  "nRemoved" : 0,
  "upserted" : [ ]
})
> db.blog.find() // 5, 6, 7都没有出入成功
{ "_id" : 0 }
{ "_id" : 1 }
{ "_id" : 2 }
{ "_id" : 3 }
{ "_id" : 4 }
{ "_id" : 5 }
```

> **解决办法**：使用continueOnError, (shell 不支持，驱动程序都支持)

* ### **查询数据**

```bash
> db.blog.find()
{
  "_id": ObjectId("58be4d4da36bb2b91a6cde5d"),
  "title": "My Blog Post",
  "date": ISODate("2017-03-07T06:03:44.225Z")
}
```

- find - shell会自动显示最多20个匹配的文档
- findOne - 查找一个文档
- find和findOne可以接收一个查询文档作为限定条件

* ### **更新数据**

```bash
db.{table}.update(query, object[, upsert_bool, multi_bool])
```

- update (至少接受两个参数）
- 第一个是限定条件（用于匹配待更新的文档），第二个是新的文档或修改参数
- upsert_bool 设置为true时，要是没有找到符合更新条件的文档，就会以这个条件和更新文档为基础创建一个新的文档，如果找到了匹配的文档，则正常更新
- multi_bool 默认情况下，更新只对符合匹配条件的第一个文档执行操作，要是有多个文档符合条件，只有第一个文档会被更新，其他文档不会发生变化，设置为true时，所有匹配到的文档都会执行更新操作

```bash
> post.comments = []
[]
> db.blog.update({title: "My Blog Post"}, post)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.blog.findOne()
{
  "_id": ObjectId("58be4d4da36bb2b91a6cde5d"),
  "title": "My Blog Post",
  "date": ISODate("2017-03-07T06:03:44.225Z"),
  "comments": []
}
```

* ### **删除数据**

```bash
db.{table}.remove(query)
```

- remove
- remove 方法将文档从数据库中永久删除
- 可以接受一个作为限定条件的文档作为参数

```bash
# 删除创建的文章
> db.blog.remove({title: "My Blog Post"})
```

## 3、更新文档

* ### **文档替换**

> 更新文档时建议使用**修改器**来修改键/值对，文档替换操作有风险

```bash
> db.blog.insert({"name": "joe", "friends": 32, "enemies": 2})
> WriteResult({ "nInserted" : 1 })
> ete = db.blog.findOne({"name": "joe"})
{
  "_id" : ObjectId("58cb7877af6105891ec2a46d"),
  "name" : "joe",
  "friends" : 32,
  "enemies" : 2
}
> ete.relationships = {"friends": ete.friends, "enemies": ete.enemies}
{ "friends" : 32, "enemies" : 2 }
> delete ete.friends
true
> delete ete.enemies
true
> db.blog.update({"name": "joe"}, ete)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
>db.blog.findOne({"name": "joe"})
{
  "_id" : ObjectId("58cb7877af6105891ec2a46d"),
  "name" : "joe",
  "relationships" : {
    "friends" : 32,
    "enemies" : 2
  }
}
```

* ### **修改器**

```bash
$inc: 增加字段数值 (若字段不存在，则创建)
ps: $inc 只能用于整型、长整型或双精度浮点型的值
# 用 '$inc' 修改器增加 'score' 的值
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$inc": {"score": 1}})

$set: 修改字段值 (若字段不存在，则创建)
# 用 '$set' 修改器修改 'name' 的值, 还可以修改内嵌文档的值
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$set": {"name": "ete"}})

$unset: 删除字段
# 用 '$unset' 修改器删除 'nickname' 字段
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$unset": {"nickname": 1}})

# 数组修改器
$push: 向已有的数组末尾加入一个元素 (若不存在，则创建新的数组)
# 用 '$push' 修改器向数组 'comments' 添加一条评论
eg: db.blog.update(
  {
  "_id" : ObjectId("58cb7877af6105891ec2a46d")
  },
  {
    "$push": {
      "comments": {"name": "john", "email": "abc@gamil.com", "contetn": "very good"}
    }
  }
)

# $push 子操作符
$each: 一次$push 操作添加多个值
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$push": {"course": {"$each": ['music', 'art']}}})

$slice: 限制数组只包含最后加入的N个元素(值必须为负整数）
# 限制数组只包含最后加入的10个元素，若数组的元素数量小于10，那么所有的元素都会保留
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$push": {"course": {
  "$each": ['music', 'art']
    "$slice": -10
  }}})

$addToSet 保证数组内的元素不重复, 可配合$each 添加多个值
# 保证course 数组不会重复添加'music'
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$addToSet": {"course": "music"}})

$pop 从数组任何一端删除元素
# 从数组末尾删除一个元素
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$pop": {"course": 1}})

# 从数组头部删除一个元素
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$pop": {"course": -1}})

$pull: 删除数组特定元素,
# $pull会将所有匹配到email为'abc@gmail.com'的文档删除
eg: db.blog.update({ "_id" : ObjectId("58cb7877af6105891ec2a46d")},
{"$pull": {"emails": 'abc@gmail.com'}})
```

* ### **返回被更新的操作**

```bash
db.{table}.findAndModify({
  query: {},
  update: {},
  remove: true | false,
  new: true | false,
  fields: {},
  sort: {}
  upsert: true | false
})
```

* query: 查询文档，用于检索文档的条件
* update: 修改器文档，用于对匹配的文档进行更新（update和remove必须指定一个)
* remove: 布尔类型, 表示删除符合query条件的文档，不能与update同时出现
* new: 默认是false, true：返回更新后的文档，false：返回更新前的文档
* fields: 文档中需要返回的字段（可选）
* sort: 搜索结果的条件
* upsert: 布尔类型，默认为false, 与update的upsert_bool相同

```bash
> db.blog.findAndModify({
  query: {'name': 'joe'},
  remove: true,
  sort: { 'score': -1}
})
```