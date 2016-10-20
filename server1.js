
var http = require("http");	//加载http模块

//request 访问信息 ,response 响应信息

//有客户端连接进来会触发这个函数
var server = http.createServer(function (req,res){
	res.writeHead(200,{"Content-Type":"text/plain"}); //写入头部
	res.write("Hello World");//写入内容
	res.end();
})

server.listen(8082,function (){
	console.log("服务器已开启")
})






