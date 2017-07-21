# pubsubr
[![Build Status](https://travis-ci.org/FengYuHe/pubsubr.svg?branch=master)](https://travis-ci.org/FengYuHe/pubsubr)

pub and sub to loopback

## Installation

```sh
$ npm install --save pubsubr
```

## Example Usage

### server
```js
const pubsubr = require('pubsubr');
const client = new pubsubr.server('mqtt://test.mosquitto.org', app.models.EventLog);
```

### client
```js
const pubsubr = require('pubsubr');
const client = new pubsubr.client('mqtt://test.mosquitto.org', 'http://0.0.0.0:3000/api/eventLog');
```

## create model
创建`EventLog`模型，用于客户端重连或重新运行获取丢失的`publish`

**⚠️注意**：模型字段会解析`topic`和字段`topic`、`message`、`createdAt`、`updatedAt`组成对象存进数据库，所以`topic`配置需和`model`字段相匹配

### loopback
* 从模块中使用已定义好的模型，配置`model-config.json`:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models",
      "pubsubr/models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "../common/mixins",
      "./mixins"
    ]
  },
  "EventLog": {
    "dataSource": "db",
    "public": true
  }
}
```

### other
配置好模型，在创建`server`对象时传入

## Topic
`tipic`的处理和格式,`key/value`形式，`+`为级别任意通配符，`#`为层级任意通配符
    
* `publish`时，会解析`topic`成为`object`加上字段`topic`、`message`、`createdAt`、`updatedAt`存入数据库事件日志表，例如：`uid/123456789/model/Account/oid/abcdefg/action/create`解析为`{uid: '123456789', model: 'Account', oid: 'abcdefg', action: 'create'}`
* `subscribe`时，可通过通配符监听，同样会把`topic`解析放入`payload`中传入`handler`

## API

### pubsubr
**pubsubr.server(options, model)**
create pubsubr server

* `options` connect to `mosquitto` ro `mosca`, `String`: `mqtt://test.mosquitto.org` , `Object`: `{host: 'localhost', port: '1883'}`
* `model` - `EventLog`，用于客户端重连或重新运行获取丢失的`publish`，会使用模型的`create`创建一条数据，为`null`不创建数据

**pubsubr.client(options, api)**
create pubsubr client

* `options` connect to `mosquitto` ro `mosca`, `String`: `mqtt://test.mosquitto.org` , `Object`:
    * `host` default `localhost`
    * `port` default `1883`
* `api` 获取事件日志数据的`api`

### server
**server.publish(topic, message, [options], [callback])**
Publish a message to a topic

* `topic` is the topic to publish to, `String`
* `message` is the message to publish,`Object` or `String`
* `options` is the options to publish with, including:
    * `qos` QoS level, Number, default 0
    * `retain` retain flag, `Boolean`, default `false`
    * `dup` mark as duplicate flag, `Boolean`, default `false`
* `callback` - `function (err)`, fired when the QoS handling completes, or at the next tick if QoS 0. An error occurs if client is disconnecting.

### client
**client.subscribe(topic, [options], handler)**
Subscribe to a topic or topics

* `topic` is a `String` topic of subscribe to topics to subscribe to. It can also be an object, it has as object keys the topic name and as value the QoS, like `{'test1': 0, 'test2': 1}`. MQTT topic wildcard characters are supported (`+` - for single level and `#` - for multi level)
* `options` is the options to subscribe with, including:
    * `qos` qos subscription level, default 0
    * `time` 最后一次收到事件的时间，用于重新获取漏处理的事件，发生于客户端重起和`mqtt`服务断线重连的时候，**重连暂时只支持`loopback`的`REST API`风格**
* `callback` - `function (err, granted)` callback fired on suback where:
    * `err` a subscription error or an error that occurs when client is disconnecting
    * `granted` is an array of `{topic, qos}` where:
        * `topic` is a subscribed to topic
        * `qos` is the granted qos level on it

        
**unsubscribe(topic, [callback])**
Unsubscribe from a topic or topics

* topic is a `String` topic or an `array` of topics to unsubscribe from
* `callback` - `function (err)`, fired on unsuback. An error occurs if client is disconnecting.



