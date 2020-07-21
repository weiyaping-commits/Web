//-------------------------Tools-------------------------
//自调用函数传入window的目的是,让变量名可以被压缩
//在老版本的浏览器中，undefined可以被重新赋值
;(function(window,undefined){
	var Tools = {
		getRandom : function(min,max){
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
		}
	}
	window.Tools = Tools;
})(window,undefined)

//------------------------Parent------------------------
;(function(window,undefined){
	//构造函数
	function Parent(options){
		options = options || {};
		this.width = options.width || 20;
		this.height = options.height || 20;
	}
	
	Parent.prototype.test = function(){
		console.log("test");
	}
	
	window.Parent = Parent;
})(window,undefined)


//------------------------Food--------------------------
;(function(window,undefined){
	position = "absolute";
	//创建一个数组，存储食物对象
	var elements = [];
	
	//1.创建Food事物对象
	function Food(options){
		options = options || {};
		//对象的属性
//		this.width = options.width || 20;
//		this.height = options.height || 20;
		
		//构造函数继承Parent
		Parent.call(this,options);

		this.left = options.left || 0;
		this.top = options.top || 0;
		this.color = options.color || "green";
	}
	
	//对象继承
	Food.prototype = new Parent();
	Food.prototype.constructor = Food;
	
	//对象的方法
	Food.prototype.render = function(map){
		//5.删除食物
		remove();
		
		// 2.动态创建div  页面上显示的食物
	    var div = document.createElement('div');
	    map.appendChild(div);
	    
	    //将食物对象放入到数组中
	    elements.push(div);
		
		//4.随机生成食物的坐标
		this.left = Tools.getRandom(0,(map.offsetWidth / this.width -1)) * this.width;
		this.top = Tools.getRandom(0,(map.offsetHeight / this.height -1))* this.height;
		
		//3.渲染
		div.style.width = this.width +"px";
		div.style.height = this.height +"px";
		div.style.left = this.left + "px";
		div.style.top = this.top + "px";
		div.style.backgroundColor = this.color;
		div.style.position = position;
	}
	
	function remove(){
		for(var i = elements.length-1;i>=0;i--){
			//删除div
			elements[i].parentNode.removeChild(elements[i]);
			//删除数组中的元素
			//splice();从第几个位置开始，删除几个元素
			elements.splice(elements.length-1,1);
		}
		
	}
	
	//6.1把Food构造函数，让外部可以访问
	window.Food = Food;

})(window,undefined)

//------------------------------Snack--------------------------------
;(function(window,undefined){
	position = "absolute";
	//创建一个数组存储蛇的对象
	var elements = [];
	
	//1.创建snack对象
	function Snack(options){
		options = options || {};
		//蛇节属性
//		this.width = options.width || 20;
//		this.height = options.height || 20;

		//构造函数继承
		Parent.call(this,options);
		
		//蛇的移动方向属性
		this.direction = options.direction || "right";
		//蛇身属性，设置为一个数组，数组中的每个元素都是一个对象
		this.body = [
			{x:3,y:2,color:"red"},
			{x:2,y:2,color:"blue"},
			{x:1,y:2,color:"blue"}
		];
	}
	
	//对象继承
	Snack.prototype = new Parent();
	Snack.prototype.constructor = Snack;
	
	//2.渲染蛇的这个对象
	Snack.prototype.render = function(map){
		//每一次渲染之前，先删除之前的蛇
		remove();
		
		//2.2设置样式
		for(var i=0,len = this.body.length; i<len; i++){
			//2.1创建元素
			var div = document.createElement("div");
			map.appendChild(div);
			
			//将蛇的对象元素存储起来
			elements.push(div);
			
			var object = this.body[i];
			//2.2.1每个蛇节的宽和高都一样
			div.style.width = this.width +"px";
			div.style.height = this.height + "px";
			//2.2.1设置蛇节的位置
			div.style.left = object.x * this.width + "px";
			div.style.top = object.y * this.height + "px";
			div.style.backgroundColor = object.color;	
			div.style.position = position;
		}
	
	}
	
	//4.移除蛇的对象
	function remove(){
		//4.1先移除蛇的元素{删除对象元素的时候,要从后往前删除,不然会出错}
		for(var i=elements.length-1; i>=0; i--){
			elements[i].parentNode.removeChild(elements[i]);
			//4.2再移除蛇的内容
			elements.splice(i,1);
		}
		
	}
	
	//3.蛇的move方法
	Snack.prototype.move=function(food,map){
		//3.1蛇节的移动
		for(var i=this.body.length-1; i>0; i--){
			this.body[i].x = this.body[i-1].x; 
			this.body[i].y = this.body[i-1].y; 
		}
		//3.2蛇头的移动
		var head = this.body[0];
		switch (this.direction){
			case "right":
				head.x += 1;
				break;
			case "left":
				head.x -=1;
				break;
			case "top":
				head.y -=1;
				break;
			case "bottom":
				head.y +=1;
				break;
			default:
				break;
		}
		
		
		//3.3当蛇移动的过程中遇到事物的时候
		//判断蛇头的坐标和食物的坐标是否重合
		var headX = head.x * this.width;
		var headY = head.y * this.height;
		
		var foodX = food.left;
		var foodY = food.top;
		
		if(headX === foodX && headY === foodY){
			//3.3.1如果坐标重合,增加一节蛇身
			//获取蛇的最后一节
			var last = this.body[this.body.length-1];
			//将最后一节添加进蛇身的数组中
//			this.body.push({
//				x:last.x,
//				y:last.y,
//				color:last.color
//			});
			var obj = {};
			extend(last,obj);
			this.body.push(obj);
			
			//3.3.2改变食物的坐标
			food.render(map);
			
		}
		
		//继承关系
		function extend(parent,child){
			for(var key in parent){
				if(child[key]){
					continue;
				}
				child[key] = parent[key];
			}
		}
	}
	
	
	//让外部可以访问Snack
	window.Snack = Snack;
	
})(window,undefined)

//------------------------------Game---------------------------------
;(function(window,undefined){
	//创建一个变量存储Game对象
	var that;
	
	//2.创建游戏对象
	function Game(map){
		//2.1游戏对象的属性
		this.food = new Food();
		this.snack = new Snack();
		this.map = map;
		that = this;
	}
	
	//2.2游戏对象的方法
	Game.prototype.start = function(){
		//2.2.1渲染food和snack
		this.food.render(this.map);
		this.snack.render(this.map);
		//2.2.2开始游戏的逻辑
		//①让蛇能够移动起来
		//②让蛇遇到边界游戏结束
		runSnack();
		//③通过键盘控制蛇移动的方向
		bindKey();
		//④当蛇遇到食物,做相应的处理
		
		//测试move方法
//		this.snack.move();
//		this.snack.move();
//		this.snack.render(this.map);
//		this.snack.move();
//		this.snack.render(this.map);
	}
	
	//3.逻辑问题
	//3.1让蛇能不停的移动
	function runSnack(){
		//设置定时器,让蛇能够不停的移动
		var timeId = setInterval(function(){
			//让蛇移动
			this.snack.move(this.food,this.map);
			//渲染
			this.snack.render(this.map);
			//3.2判断蛇是否超出地图边界
			
			var headX = this.snack.body[0].x;
			var headY = this.snack.body[0].y;
			var maxX = this.map.offsetWidth / this.snack.width;
			var maxY = this.map.offsetHeight / this.snack.height;
			
			if(headX <0 || headX >=maxX){
				clearInterval(timeId);
				alert("Game Over");
			}
			
			if(headY <0 || headY >=maxY){
				clearInterval(timeId);
				alert("Game Over");
			}
			
		}.bind(that),150);
		
		
	}
	//3.3键盘控制蛇的移动
	function bindKey(){
		document.addEventListener("keydown",function(e){
//			console.log(e.keyCode);
			//37 --left
			//38 --top
			//39 --right
			//40 --bottom
			switch (e.keyCode){
				case 37:
					this.snack.direction = "left";
					break;
				case 38:
					this.snack.direction = "top";
					break;
				case 39:
					this.snack.direction = "right";
					break;
				case 40:
					this.snack.direction = "bottom";
					break;
				default:
					break;
			}
		}.bind(that),true);
	}
	//3.4当蛇遇到食物,做相应的处理
	
	
	
	//暴露Game对象让外面可以访问到
	window.Game = Game;
	
})(window,undefined)

//--------------------------Main-------------------------------
;(function(window,undefined){
	var map = document.getElementById("map"); 
	var game = new Game(map);
	game.start();
})(window,undefined)
