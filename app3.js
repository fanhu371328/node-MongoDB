
//配置mongodb数据库相关的内容
var mongodb=require('mongodb');
var MongoClient=mongodb.MongoClient;
var DB_CONN_STR='mongodb://localhost:27017/foobar';

//配置node服务器相关内容：
var express=require('express');
var app =express();
var bodyParder = require('body-parser'); 
app.use(bodyParder.urlencoded({extended: true}));

//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
})

//定义post请求的接口，比如用户要修改密码
app.post('/post',function(req,res){
	var password = req.body.password;
	//首先得从库里找到数据
	var updateData = function(db,callback){
		//连接到数据文档
		var collection = db.collection('persons');
		//查询数据
		var whereStr = {"username":"fanhu"};  //我们要修改的目标信息是所有包含这个内容的数据。
		var updataStr = {$set: {"password":password}}; //要修改的信息，使用不同的更新器结果不一样，昨天已经详细讲过。
		
		collection.update(whereStr,updataStr, function(err, result){
			if(err){
				console.log('Error:'+err);
				return;
			}
			callback(result);
		});
	}
	
	MongoClient.connect(DB_CONN_STR,function(err,db){
		console.log("连接成功");
		updateData(db,function(result){
			console.log(result);
			//到这里数据库中对应的信息已经进行了修改，
			db.close();
		});
	});
})
//配置服务器端口
var server = app.listen(3000, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log('服务启动 listening at http://%s:%s', host, port);
})




