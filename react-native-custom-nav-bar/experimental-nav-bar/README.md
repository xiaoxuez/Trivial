## 界面修改

   默认push的界面  都会有popSelf  pushPage setIndicator的方法  
   pushPage = function(com, name, params) 
   popSelf
   setIndicator 的使用方法如  setIndicator({showing: true, text: ‘’})


   当pushPage的params中含有title属性时，自动加上NavigatorRootView， 修改头部可通过setNavTitle方法。如setNavTitle({title: “距离”, rightBarItemTitle: “hh”})
   
   
   需要修改二者时，需确认控件已绘制完成。方法之一是在页面的componentDidMount中
   
   `componentDidMount() { this.setState({}, function() {		//  修改
     })
   }` 
   
   
   
   但页面加入indicator的初衷是在页面加载时的过渡。  具体还需再整理，代码也只是片段。  不能直接使用