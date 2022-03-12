//以数组的形式存方法
//先把游戏需要的准备工作做好，最后再写上下左右的操作
var game={
    data:[],    //存放数据
    score:0,    //分数
    status:0,   //当前状态，时刻监听，时刻需要改变，下面两个元素就是用来改变status元素
    gameover:0, 	//游戏结束时为0
    gameruning:1,	//游戏开始时为1

    //开始游戏的方法
    start:function(){
        this.score=0;	//游戏开始，当前分数是0
        this.data = [	//声明数组，放到2048的格子中去
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]
        
        this.status=this.gameruning; 	//游戏状态等于1时，表示游戏开始
        this.randomNum()	//调用随机数方法，下面有写到
        this.randomNum()	
        this.dataView()		//调用视图
    },

    //随机数的方法
    randomNum: function(){
        for(;;){
            var a = Math.floor(Math.random()*4);    //4行随机数
            var b = Math.floor(Math.random()*4);    //4列随机数
            if(this.data[a][b]==0){		//格子中还有0值时生成随机数
                var num = Math.random()>0.3 ? 2:4	//因为2比4出现的几率大，所以2被我设置了7层的概率
                
                //前面有写过，整个2048设置为一个二维数组，所以a和b是数组的下标，num就是随机下标中的随机数
                this.data[a][b]=num;	
                break;
            }
        }
    },

    //更新视图
    dataView:function(){
    	//用for循环从行开始遍历
        for(var a = 0;a<4;a++){
        	//当a=0时，b从0开始遍历，a=1时，b再遍历一遍，以此类推
            for(var b = 0; b < 4;b++){
            	//获取每个格子里出现的数字，对应的css属性
                var div = document.getElementById("c"+a+b);
                if(this.data[a][b] != 0){	//条件判断是否为空
                    div.innerHTML = this.data[a][b];
                    div.className = "cell n" + this.data[a][b]
                }else{
                	//为空就保持原样
                    div.innerHTML=""
                    div.className = "cell"
                }
            }
        }
        document.getElementById("score01").innerHTML = this.score;	//打印分数
        document.getElementById("score02").innerHTML = this.score;
        //监测游戏状态
        //因为前面已经把status=1了，所以再次判断，当status=0时，触发以下条件
        if(this.status == this.gameover ){
        	//游戏结束时结算分数和显示遮罩层
            document.getElementById("score02").innerHTML = this.score;
            document.getElementById("gameover").style.display='block';
        }else{
        	//没结束则为none
            document.getElementById("gameover").style.display="none"
        }
    },

    //判断游戏是否结束，没有结束返回false，结束返回true
    isgameover:function(){
        for(var a = 0;a < 4; a++){
            for(var b  = 0;b < 4;b++){
                //没有结束的三种情况

                //1.数组中还有0
                if(this.data[a][b]==0){
                    return false
                }
                 //2.上下相邻有相同数字
                if(a<3){	//行的判定范围小于3，因为后面要留最后一行比较，下面代码里有加1
                    if(this.data[a][b]==this.data[a+1][b]){
                        return false;
                    }
                }
                //3.左右相邻有相同数字
                if(b<3){	//原理同上，行和列容易在脑海里搞混的，我下面有放画图
                    if(this.data[a][b] == this.data[a][b+1]){
                        return false
                    }
                }
            }
        }
        return true;
    },
	
	//一切就绪，以下是移动操作
    //左移动
    moveLeft:function(){
        var before = String(this.data)  //移动之前
        
        //遍历行
        for(var a = 0;a < 4;a++){
            this.moveLeftInRow(a);	//调用下面的移动方法,a只是一个形参，随便什么都可以，只要一致
        }
        var after = String(this.data)   //移动之后
        if(before != after){	//移动前后比较，有改变就更新视图
            this.randomNum()
            if(this.isgameover()){	//判断游戏是否结束，是则执行结束步骤
                this.status = this.gameover;
            }
            this.dataView() //更新视图
        }
    },
    //开始移动
    moveLeftInRow:function(a){
        for(var b = 0;b < 3;b++){	//遍历列
        	// 声明变量储存下一个随机值，getNextInRow函数在下面
            var nextb = this.getNextInRow(a,b); 
            //-1只是一个判断条件，你可以写任意其他，但需要与下面调用的函数照应到
            if(nextb != -1){	
                //如果该坐标上没有数，后面新出现的数就赋值给该坐标，然后新数值的坐标归零
                if(this.data[a][b]==0){
                    this.data[a][b] = this.data[a][nextb];
                    this.data[a][nextb] = 0;
                    b--;    
                    //如果该坐标和后面数值相同，该坐标分数就叠加，总分数被遍历16次计算相加过的分数，然后新数值坐标归零
                }else if(this.data[a][b] == this.data[a][nextb]){
                    this.data[a][b] *= 2;
                    this.score += this.data[a][b]
                    this.data[a][nextb] = 0
                }
            }else{
                break;
            }
        }
    }, 
    //遍历列，返回i，与上面左移动的数组同步
    getNextInRow:function(a,b){
    	//b+1是因为左边第一列与后面的值做比较，所以第一列无需遍历
        for(var i = b+1;i < 4;i ++){
        	//注意！b值为i，返回的是i值
            if(this.data[a][i] != 0){
                return i;	
            }
        }
        return -1;
    },
	
	//以下逻辑都一样的，只是按照移动方向换了对应的遍历方向，我就不一一赘述了
    //右移动
    moveRight:function(){
        var before = String(this.data)  //移动之前
        
        //遍历行
        for(var a = 0;a < 4;a++){
            this.moveRightInRow(a);
        }

        var after = String(this.data)   //移动之后
        if(before != after){    //相比较
            this.randomNum()
            if(this.isgameover()){
                this.status = this.gameover;
            }
            this.dataView() //更新视图
        }
    },
    //开始移动
    moveRightInRow:function(a){
        for(var b = 3;b > 0;b--){
            var nextb = this.moveNextRight(a,b)
            if(nextb != -1){
                
                if(this.data[a][b]==0){
                    this.data[a][b] = this.data[a][nextb];
                    this.data[a][nextb] = 0;
                    b++;    
               }else if(this.data[a][b] == this.data[a][nextb]){
                    this.data[a][b] *= 2;
                    this.score += this.data[a][b]
                    this.data[a][nextb] = 0
                }
            }else{
                break;
            }
        }
    },

    moveNextRight:function(a,b){
        for(var i = b-1;i>=0;i--){
            if(this.data[a][i] != 0){
                return i;
            }
        }
        return -1;
    },

     //上移动
     moveTop:function(){
        var before = String(this.data)  
        for(var b = 0;b < 4;b++){
            this.moveTopInRow(b);
        }

        var after = String(this.data)  
        if(before != after){    
            this.randomNum()
            if(this.isgameover()){
                this.status = this.gameover;
            }
            this.dataView() 
        }
    },
    //开始移动
    moveTopInRow:function(b){
        for(var a = 0;a < 3;a ++){
            var nexta = this.moveNextTop(a,b)
            if(nexta != -1){

                if(this.data[a][b]==0){
                    this.data[a][b] = this.data[nexta][b];
                    this.data[nexta][b] = 0;
                    a--;    

                }else if(this.data[a][b] == this.data[nexta][b]){
                    this.data[a][b] *= 2;
                    this.score += this.data[a][b]
                    this.data[nexta][b] = 0
                }
            }else{
                break;
            }
        }
    },
    moveNextTop:function(a,b){
        for(var i = a+1;i<4;i++){
            if(this.data[i][b] != 0){
                return i;
            }
        }
        return -1;
    },

    //下移动
    moveDown:function(){
        var before = String(this.data)  
        
        for(var b = 0;b < 4;b++){
           
            this.moveDownInRow(b);
        }

        var after = String(this.data)   
        if(before != after){    
            this.randomNum()
            if(this.isgameover()){
                this.status = this.gameover;
            }
            this.dataView() 
        }
    },
    //开始移动
    moveDownInRow:function(b){
        for(var a=3;a>0;a--){
            var nexta = this.moveNextDown(a,b)
            if(nexta != -1){

                if(this.data[a][b]==0){
                    this.data[a][b] = this.data[nexta][b];
                    this.data[nexta][b] = 0;
                    a++;  

                }else if(this.data[a][b] == this.data[nexta][b]){
                    this.data[a][b] *= 2;
                    this.score += this.data[a][b]
                    this.data[nexta][b] = 0;
                }
            }else{
                break;
            }
        }
    },
    moveNextDown:function(a,b){
        for(var i = a-1;i >= 0;i--){
            if(this.data[i][b] != 0){
                return i;
            }
        }
        return -1;
    }
  }
game.start(); 	//最后调用开始方法
//给键盘按钮绑定事件
document.onkeydown=function(){
    if(event.keyCode==37)	//左
        game.moveLeft();
    if(event.keyCode==39)	//右
        game.moveRight();
    if(event.keyCode==38)	//上
        game.moveTop();
    if(event.keyCode==40)	//下
        game.moveDown();
}

//游戏结束后重新开始
function sta(){
    document.getElementById("gameover").style.display="none";
    game.start();
}