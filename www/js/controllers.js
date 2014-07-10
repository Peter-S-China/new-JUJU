'use strict';

/* Controllers */
function HomeCtrl($scope,navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };
}

function NotificationCtrl($scope) {
    $scope.alertNotify = function() {
        navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
    };
    
    $scope.beepNotify = function() {
        navigator.notification.beep(1);
    };
    
    $scope.vibrateNotify = function() {
        navigator.notification.vibrate(3000);
    };
    
    $scope.confirmNotify = function() {
        navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
    };
}

function GeolocationCtrl($scope,navSvc,$rootScope) {
    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.position=position;
        $scope.$apply();
        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });

    $scope.back = function () {
        navSvc.back();
    };
}

function AccelerCtrl($scope) {
    navigator.accelerometer.getCurrentAcceleration(function (acceleration) {
        $scope.acceleration  = acceleration;
        },function(e) { console.log("Error finding acceleration " + e) });
}

function DeviceCtrl($scope) {
    $scope.device = device;
}

function CompassCtrl($scope) {
    navigator.compass.getCurrentHeading(function (heading) {
        $scope.heading  = heading;
        $scope.$apply();
    },function(e) { console.log("Error finding compass " + e.code) });
}

function HackerNewsCtrl($scope, $rootScope) {

    
     $rootScope.items = null;
    // load in data from hacker news unless we already have
    if (!$rootScope.items) {     

        jx.load('http://api.ihackernews.com/page',function(data){
            console.log(JSON.stringify(data));
            $rootScope.items = data.items;
            $scope.$apply();
        },'json');

    } else {
        console.log('data already loaded');
    }

    $scope.loadItem = function(item) {
        navigator.notification.alert(item.url,function() {console.log("Alert success")},"My Alert","Close");
    };
}


function ContactsCtrl($scope) {
    $scope.find = function() {
        $scope.contacts = [];
        var options = new ContactFindOptions();
        //options.filter=""; //returns all results
        options.filter=$scope.searchTxt;
        options.multiple=true;
        var fields = ["displayName", "name", "phoneNumbers"];
        navigator.contacts.find(fields,function(contacts) {
            $scope.contacts=contacts;
            $scope.$apply();
        },function(e){console.log("Error finding contacts " + e.code)},options);
    }
}

function CameraCtrl($scope) {
    $scope.takePic = function() {
        var options =   {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        }
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onSuccess,onFail,options);
    }
    var onSuccess = function(imageData) {
        console.log("On Success! ");
        $scope.picData = "data:image/jpeg;base64," +imageData;
        $scope.$apply();
    };
    var onFail = function(e) {
        console.log("On fail " + e);
    };
}


//-----------全局变量-----------
var g_codenum;
var g_userid;
var g_homenum;
var g_againstid;

//-----------------------------

function GetCodesCtrl($scope, $rootScope,$location) {
    
    
  
    
    // load in data from hacker news unless we already have
    
    $scope.loadItem = function(item) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/Loginservlet?codenum=' + g_codenum ,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item4;
                
                g_userid = $rootScope.items.id;
                
                console.log("------userid-------" + g_userid);
                
                localStorage.j_username = g_userid;
                console.log("------>localStorage.j_username<-------" + localStorage.j_username);
                
                $scope.$apply();
                },'json');

        
        
        //navigator.notification.alert(item.result,function() {console.log("Alert success")},"My Alert","Close");
        
        $location.path("/step2"); // URL with query string
        
        
    };
}


function GetRoomNumCtrl($scope, $rootScope,$location) {
    
    $rootScope.items = null;
    // load in data from hacker news unless we already have
    if (!$rootScope.items) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/SendHomenum',function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item5;
                g_homenum = $rootScope.items.homenum;
                $scope.$apply();
                },'json');
    } else {
        console.log('data already loaded');
    }
    
    $scope.loadItem = function(item) {
        navigator.notification.alert(item.homenum,function() {console.log("Alert success")},"My Alert","Close");
        
        
    };
    
    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    
    $scope.formData = {};
  
    $scope.CreatRoom = function() {
        
        
        console.log("------homenum-------" + g_homenum);
        console.log("------userid-------" + g_userid);
        console.log("------nickname-------" + $scope.formData.name);
        
        if (!$scope.formData.name){
            
          
            $scope.message="请输入昵称";


        }else{
        
            var g_url = 'http://10.0.0.77:8080/JujuDemo/servlet/Createhome?id='+ g_userid +'&name='+ $scope.formData.name + '&homenum='+ g_homenum +'&userid=1';
            
            console.log(g_url);
            
            $rootScope.items = null;
            if (!$rootScope.items) {
                
                jx.load(g_url,function(data){
                        console.log(JSON.stringify(data));
                        $rootScope.items = data.cerateresult;
                        
                        $scope.$apply();
                        },'json');
                
                
                
            } else {
                
                $scope.errorName = '创建房间失败';
                console.log('创建房间失败');
                
            }
            
            $location.path("/step3");
    
        }

        };
    
}



function JoinRoomCtrl($scope, $rootScope,$location) {
    
    
    console.log("------UserID-------" + localStorage.j_username);
    g_userid = localStorage.j_username;
    
   
    $scope.formData = {};
    
    $scope.JoinRoom = function() {
        
    
        
        if(!$scope.formData.roomnum || !$scope.formData.nickname){
        
            $scope.message="请输入房间号和昵称";

        
        }else{
        
            
            
         var g_url = 'http://10.0.0.77:8080/JujuDemo/servlet/Createhome?id='+ g_userid +'&name='+ $scope.formData.nickname + '&homenum='+ $scope.formData.roomnum +'&userid=0';
     
            g_homenum =  $scope.formData.roomnum;
            
            console.log("---Json---"+ g_homenum);
            
            console.log("---Json---"+ g_url);
            
            $rootScope.items = null;
            if (!$rootScope.items) {
                
                jx.load(g_url,function(data){
                        console.log(JSON.stringify(data));
                        $rootScope.items = data.cerateresult;
                        
                        $scope.$apply();
                        },'json');
                
                
            } else {
                
                console.log('创建房间失败');
            }
            
            $location.path("/step3");
        
        }
        
       
        
    }

}


function GetUserListCtrl($scope, $rootScope) {
    
    
    console.log("------getuserlist------homenum"+ g_homenum);
    
    $rootScope.items = null;
   // load in data from hacker news unless we already have
    if (!$rootScope.items) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/SendUserinfo?homenumber='+ g_homenum,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item6;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('加载失败');
    }
    
    $scope.loadItem = function(item) {
        
        console.log('用户名'+item.username);
        
        //navigator.notification.alert(item.url,function() {console.log("Alert success")},"My Alert","Close");
    };
}

function NavtoGameCtrl($scope) {
   
        console.log('游戏大厅');
    
}


function GetTeamList1Ctrl($scope, $rootScope,$location) {
    
    console.log('获取球队列表信息');
    console.log('---用户名---'+ g_userid);
    console.log('---房间号---'+ g_homenum);
    $rootScope.items = null;
    // load in data from hacker news unless we already have
    if (!$rootScope.items) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/Sendballgame?isbegin=1',function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item7;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('获取比赛列表失败');
    }

    
    $scope.loadItem = function(item) {
       
        g_againstid = item.againstid;
        //console.log('获取球队得>>>againstid<<<<'+ g_againstid);
        $location.path("/cbsteamdetail");
        
    }
    
}

function GetTeamList2Ctrl($scope, $rootScope,$location) {
    
    console.log('获取球队列表信息');
    console.log('---用户名---'+ g_userid);
    console.log('---房间号---'+ g_homenum);
    $rootScope.items = null;
    // load in data from hacker news unless we already have
    if (!$rootScope.items) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/Sendballgame?isbegin=0',function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item7;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }
    
    
    $scope.loadItem = function(item) {
        
        console.log('球队详细信息');
        
        
    };
    
}


function LoginRoomCtrl($scope){

    $scope.message = g_homenum;
    console.log("roomnum" + g_homenum);
    
}

function LoginCtrl($scope,$location,$rootScope) {
  /*
    if(!localStorage.j_username){
     console.log(">>>>>>>" + localStorage.j_username);
        
    }else{
    
        console.log(">>>>>>>" + localStorage.j_username);
        $location.path( "/step2" );
    }
*/
 
        
        if (!$rootScope.items) {
            
            jx.load('http://10.0.0.77:8080/JujuDemo/servlet/sendnum?username=139',function(data){
                    console.log(JSON.stringify(data));
                    $rootScope.items = data.item3 ;
                    
                    g_codenum = $rootScope.items.result;
                    
                    console.log("------codenum-------" + g_codenum);
                    $scope.$apply();
                    },'json');
            
            
            
        } else {
            console.log('data already loaded');
        }

        console.log("验证码" + g_codenum);
    
   

}

function AnonymousChatCtrl($scope, $rootScope,$location){

    $scope.message ="匿名白板";
    console.log("匿名白板房间号" + g_homenum);
    
    $rootScope.items=null;
    if (!$rootScope.items) {
        
        jx.load('http://10.0.0.77:8080/JujuDemo/servlet/SendMessage?homenum='+g_homenum,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item8;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }
    
    
    $scope.loadItem = function(item) {
        
        console.log("will open AnonymousChat windows ");
        $location.path("/mainchat");
        
        
    };
}


function SendAnonymousMessageCtrl($scope, $rootScope,$location){
    
     $scope.message ="局:"+ g_homenum + "用户ID:" + g_userid;
    //
    
    $scope.formData = {};
    
    
    
    $scope.sendmessage=function(){
        
        
        if(!$scope.formData.s_message){
        
        $scope.message ="匿名消息不能为空";
        
        }
        
    var smmurl = "http://10.0.0.77:8080/JujuDemo/servlet/GetMessage?homenum="+g_homenum+"&id="+g_userid+"&message="+$scope.formData.s_message+"&flag=0";
        console.log("------sending----message-------" + smmurl);
        
        $rootScope.items=null;
        if (!$rootScope.items) {
            
            jx.load(smmurl,function(data){
                    console.log(JSON.stringify(data));
                    $rootScope.items = data.item9;
                    $scope.$apply();
                    },'json');
            
        } else {
            console.log('data already loaded');
        }
     
     $location.path("/step3");
        
    }

}

function GetGuessScore($scope,$rootScope){
   
   console.log('获取房间号>>>g_homenum<<<<'+ g_homenum);
   console.log('获取用户ID>>>g_userid<<<<'+ g_userid);
   var gsurl='http://10.0.0.77:8080/JujuDemo/servlet/Sendballgameuser?userid='+g_userid+'&homenum='+g_homenum;
    
    console.log(gsurl);
    
  
    if (!$rootScope.itemss) {
        
        jx.load(gsurl,function(data){
                console.log(JSON.stringify(data));
                $rootScope.itemss = data.item10;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }
    
    
    }


function GetBallAgainstinfo($scope,$rootScope,$location){
    
    console.log('获取球队得>>>againstid<<<<'+ g_againstid);
    var agurl ='http://10.0.0.77:8080/JujuDemo/servlet/BallAgainst?againstid='+g_againstid;
    
    console.log(agurl);
    $rootScope.items=null;
    if (!$rootScope.items) {
        
        jx.load(agurl,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item9;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }

    
    $scope.formData = {};
    
    $scope.homewin=function(){
        
        console.log('homewin'+ $scope.formData.guesscore);
        
        var hwurl='http://10.0.0.77:8080/JujuDemo/servlet/Getballgamecore?userid='+g_userid+'&againstid='+g_againstid+'&homewincore='+$scope.formData.guesscore+'&homenum='+g_homenum;
        
        console.log(hwurl);
        $rootScope.items=null;
        if (!$rootScope.items) {
            
            jx.load(hwurl,function(data){
                    console.log(JSON.stringify(data));
                    $rootScope.items = data.cerateresult;
                    $scope.$apply();
                    },'json');
            
        } else {
            console.log('data already loaded');
        }
        
        navigator.notification.alert("完成比赛竞猜",function() {console.log("完成比赛竞猜")},"完成比赛竞猜","关闭");
        
        $location.path("/cbsview");
        
        
    }
    
    $scope.flat=function(){
        
        console.log('flat');
        $location.path("/flatview");
        
        console.log('>>>>flat<<<<'+ $scope.formData.guesscore);
        
        var gfurl='http://10.0.0.77:8080/JujuDemo/servlet/Getballgamecore?userid='+g_userid+'&againstid='+g_againstid+'&flatcore='+$scope.formData.guesscore+'&homenum='+g_homenum;
        
        console.log(gfurl);
        $rootScope.items=null;
        if (!$rootScope.items) {
            
            jx.load(gfurl,function(data){
                    console.log(JSON.stringify(data));
                    $rootScope.items = data.cerateresult;
                    $scope.$apply();
                    },'json');
            
        } else {
            console.log('data already loaded');
        }
        
        navigator.notification.alert("完成比赛竞猜",function() {console.log("完成比赛竞猜")},"完成比赛竞猜","关闭");
        
        $location.path("/cbsview");
        
        
        
    }
    $scope.visitingwin=function(){
        
        console.log('visitingwin');
        
        $location.path("/homlostview");
        
        console.log('>>>>visitingwin<<<<'+ $scope.formData.guesscore);
        
        var hlurl='http://10.0.0.77:8080/JujuDemo/servlet/Getballgamecore?userid='+g_userid+'&againstid='+g_againstid+'&visitingcore='+$scope.formData.guesscore+'&homenum='+g_homenum;
        
        console.log(hlurl);
        $rootScope.items=null;
        if (!$rootScope.items) {
            
            jx.load(hlurl,function(data){
                    console.log(JSON.stringify(data));
                    $rootScope.items = data.cerateresult;
                    $scope.$apply();
                    },'json');
            
        } else {
            console.log('data already loaded');
        }
        
        navigator.notification.alert("完成比赛竞猜",function() {console.log("完成比赛竞猜")},"完成比赛竞猜","关闭");
        
        $location.path("/cbsview");
        

    }

}

function Sendballgamecore($scope,$rootScope){
    
    console.log('获取房间号>>>g_homenum<<<<'+ g_homenum);
    console.log('获取用户ID>>>g_userid<<<<'+ g_userid);
    
    var gusurl='http://10.0.0.77:8080/JujuDemo/servlet/Sendballgamecore?userid='+g_userid+'&homenum='+g_homenum;
    
    console.log(gusurl);
    
    $rootScope.items=null;
    
    if (!$rootScope.items) {
        
        jx.load(gusurl,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.item11;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }
    
}

function Exithome($scope,$rootScope,$location){

    
  var exurl ='http://10.0.0.77:8080/JujuDemo/servlet/Exithome?id='+g_userid;
  console.log('>>>>>>>>>>>>>>>' + exurl);
  
    $scope.exhome=function(){
  
    $rootScope.items = null;
    
    if (!$rootScope.items) {
        
        jx.load(exurl,function(data){
                console.log(JSON.stringify(data));
                $rootScope.items = data.cerateresult;
                $scope.$apply();
                },'json');
        
    } else {
        console.log('data already loaded');
    }
    
        navigator.notification.alert("",function() {console.log("您已经退出房间")},"退出房间","确定");
        
        $location.path("/step2");

        
    }

}