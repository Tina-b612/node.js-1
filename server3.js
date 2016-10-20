
var http = require("http");	//加载http模块

var fs = require("fs");

//request 访问信息 ,response 响应信息

//有客户端连接进来会触发这个函数
var server = http.createServer(function (req,res){
	
	var router = req.url;
	console.log(router)
	
	switch (router) {
		case "/":
			send("./view/index.html",res);
		break;
		case "/login":
			send("./view/login.html",res);
		break;
	}
	res.end();
})

server.listen(8082,function (){
	console.log("服务器已开启")
})

function send(path,res){
	var content = fs.readFileSync(path);
	
	res.writeHeader(200,{
		"Content-Type":"text/html;charset=UTF-8;"
		}); //写入头部
		
	res.write(content);
}




