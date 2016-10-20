
var http = require("http");	//加载http模块
var fs = require("fs");		//处理文件的模块
var path = require("path");	//处理路径的模块
var MIME = require("./MIME.js");	//处理读取文件后缀名
var url = require("url");			//处理路由
var queryString = require("querystring")	//处理 & 链接的字符串 get请求的数据
//pathnor
//path.extname	//取路径的后缀名
//__dirname  当前文件绝对路径

//模拟数据库
var users = [
	{
		userName: "leo"
	},
	{
		userName:"momo"
	}
]

//文件类型
var staticExt = [".js",".css"]

//get 请求的数据 queryString
//有客户端访问连接进来会触发这个函数
var server = http.createServer(function (req,res){	//request 访问信息 ,response 响应信息	
	var router = req.url;	//获取路径
	var routerObj = url.parse(router);	//解析为路径对象
	//console.log( routerObj)
	/*		pathname 路由名
			query:get请求的数据

	 */
	var ext = path.extname(routerObj.pathname)	//获取路由后缀
	
	//获取到get请求发送的信息
	var getObj = queryString.parse(routerObj.query)	
			//console.log(getObj)
	//获取到post请求的数据
	var str = "";
	//客户端有数据传进来时触发的函数
	req.on("data",function (chunk){
		str += chunk.toString();
	})
	
	//如果是post请求，截取并更改路由
	if(routerObj.pathname === "/loginData" && req.method === "POST"){
		routerObj.pathname = "/postLoginData";
	}
	
	//筛选后缀名并读取文件
	if(staticExt.indexOf(ext) !== -1){	//如果路由的后缀为静态文件中的一中类型
		var static = __dirname;		//获取当前文件的本地路径
		//读取静态文件
		var content = fs.readFileSync(static+router);	//读取文件
		res.writeHeader(200,{
		"Content-Type":MIME[ext] 
		}); //设置响应文件头部	
		res.write(content);
		res.end();
		return;
	}
	
	
	//路由对象的路由名
	switch (routerObj.pathname) {
		case "/":
			send("./view/index.html",res);
		break;
		case "/login":
			send("./view/login.html",res);
		break;
		case "/reg":
			send("./view/reg.html",res);
		break;
		case "/loginData":	//登录
			//查找用户名
			var findObj = users.filter(function (item){
				return item.userName === getObj.userName;
			})
			//用户存在
			if(findObj.length){
				res.writeHeader(200,{
					"content-type":MIME[".json"]
				})
				res.write('{"status":0,"message":"可以登录"}');
				res.end();
			}else{
				res.writeHeader(200,{
					"content-type":MIME[".json"]
				})
				res.write('{"status":1,"message":"此用户不存在"}');
				res.end();
			}
			
		break;
		case "/postLoginData":	//注册
			req.on("end",function (chunk){
				var postObj = queryString.parse(str)	
				var findObj = users.filter(function (item){
					return item.userName === postObj.userName;
				})
				//用户存在
				if(findObj.length){
					res.writeHeader(200,{
						"content-type":MIME[".json"]
					})
					res.write('{"status":1,"message":"用户名已存在"}');
					res.end();
				}else{
					res.writeHeader(200,{
						"content-type":MIME[".json"]
					})
					res.write('{"status":0,"message":"用户名可用"}');
					res.end();
				}
			})
				
		break;
		default:
			send("./view/404.html",res);
	}
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
	res.end();
}



