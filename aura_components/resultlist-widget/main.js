define(['underscore','backbone','text!./results.tmpl','text!./item.tmpl'],
	function(_,Backbone,template,itemtemplate) {
		return {
			events:{
    			"mousemove .resultitem":"resultitemhover",
    			"click .opentext":"opentext",
    			"click #bookmark":"dobookmark"
   			},
   			dobookmark:function(e) {
				if (this.db==='mvbr:hb51') return
				var slot=$(e.target).parent().data('slot');
				var that=this, w, o, n, v, t1, t2, d
    			w='給 dbName "'+that.db+'", slotNumber "'
    				+slot+'" 取 tag "verse" attrib "n" 的回傳值 data'
    			o={db:that.db,slot:slot,tag:'verse',attributes:['n']}
				that.sandbox.yase.closestTag(o,function(err,data) {
					if (err) {
    					console.log(w); alert(err); return
  					}
  					n=data[0].values.n // "1.2.22"
  					// 從 data 取 slot:58,tag:"verse" attrib:["n"] 的值 (例如: "1.2.22")
  					w='給 dbName "'+that.db+'", slotNumber "'+slot+'" 取 text 的回傳值 t1'
  					that.sandbox.yase.getText({db:that.db,slot:slot},function(err,t1) {
    					if (err) {
      						console.log(w); alert(err); return
    					}
    					t1=t1.split(/<verse n=".+?"\/>/)[1] // 刪除前置 tag "verse"
    					v='verse[n='+n+']' // 'verse[n=1.2.22]'
    					w='給 dbName "hb51", selector "'+v+'" 取 text 的回傳值 data2'
    					that.sandbox.yase.findTag({db:'hb51',selector:v},function(err,data2) {
      						if (err) {
        						console.log(w); alert(err); return
      						}
      						t2=data2[0].text.split(/<verse n=".+?"\/>/)[1] // 刪除前置 tag "verse"
      						d = new that.sandbox.diff();
      						d=d.diff_prettyHtml(d.diff_main(t1,t2))
      						that.sandbox.emit('diff',d+t2,slot)
						});
					});
				});
   			},
			diff:function(d,slot) {
				var obj=this.$el.find("[data-slot="+slot+"] .multiversion").parent().children()[2]
				obj.innerHTML=obj.innerHTML?'':d
			},
			opentext:function(e) {
				var slot=$(e.target).data('slot');
				var query=this.$el.find(".results").data('query');
	  var services={};
	  var Yase=require('yase')
	  var yase=Yase.api(services);
	  var closestTag=services['yase'].closestTag;
      var o={db:'mvbr:bible1',slot:58,tag:'verse',attributes:'n'}
      var start="verse[n="+closestTag(o)[0].values.n+"]"
      var opts={db:this.db,start:start,query:query}
			//	var opts={db:this.db,slot:slot,query:query}
				this.sandbox.emit("gotosource",opts);
			},
			resultitemhover:function(e) {
				var $b=this.$el.find('#bookmark'), t=$b.text()
				$b.text(this.db==='mvbr:hb51'?'':'diff with hb51')
				$e=$(e.target);
				while ($e.length && !$e.hasClass('resultitem')) {
					$e=$e.parent();
    			}
				var top=$e.offset().top;
				var $listmenu=this.$el.find("#listmenu");
				$listmenu.offset({top:top+8,left:200})
				var slot=$e.find("[data-slot]").data("slot");
				$listmenu.data("slot",slot);
				//console.log(slot);
			},
			type:"Backbone",
			resize:function() {
				var that=this;
				var space=parseInt(this.options.space)||0;
				//var height=this.$el.parent().parent().height()-this.$el.offset().top+40;
				//var height=$(window).height()-this.$el.offset().top;
				$(".mainview").scrollTop(0); // need this to prevent vertical scroll from the beginning
				var height=$(window).height()-this.$el.offset().top-space;
				this.$el.css("height", (height) +"px");
				this.$el.unbind('scroll');
				this.$el.bind("scroll", function() {
					if (that.$el.scrollTop()+ that.$el.innerHeight()+3> that.$el[0].scrollHeight) {
						if (that.displayed+10>that.results.length && that.displayed<that.totalslot) {
							that.sandbox.emit("more"+that.group,that.results.length);
						} else {
							that.loadscreenful();  
						}
					}
				});
			},
			moreresult:function(data) {
				this.results=this.results.concat(data);
				this.loadscreenful();
			},
			loadscreenful:function() {
				var screenheight=this.$el.innerHeight();
				var $listgroup=$(".results");
				var startheight=$listgroup.height();
				if (this.displayed>=this.results.length) return;
				var now=this.displayed||0;
				var H=0;
				for (var i=now;i<this.results.length;i++ ) {
					newitem=_.template(itemtemplate,this.results[i]);
					$listgroup.append(newitem); // this is slow  to get newitem height()
					if ($listgroup.height()-startheight>screenheight) break;
				}
				this.displayed=i+1;
			},
			render: function (data,db,query) {
				if (!data) return;
				this.results=[];
				this.db=db;
				this.displayed=0;
				this.results=data;
				this.html(_.template(template,{query:query}));
				this.resize();
				this.loadscreenful();
				var $listmenu=this.$el.find("#listmenu");
				$listmenu.offset({top:8,left:200})
			},
			settotalslot:function(count,hitcount) {
				var that=this;//totalslot might come later
				setTimeout(function(){
					that.totalslot=count;
					that.$el.find("#totalslot").html(count);
					that.$el.find("#totalhits").html(hitcount);
				},500)
			},
			finalize:function() {
				this.sandbox.off("newresult"+this.group,this.render);
				this.sandbox.off("moreresult"+this.group,this.moreresult);
				this.sandbox.off("totalslot"+this.group,this.settotalslot);
				this.sandbox.off("resize",this.resize);
				console.log("resultlist finalized")
			},
			initialize: function() {
				this.groupid=this.options.groupid;
				this.group="";
				if (this.options.groupid) this.group="."+this.options.groupid;
				this.sandbox.on("newresult"+this.group,this.render,this);
				this.sandbox.on("moreresult"+this.group,this.moreresult,this);
				this.sandbox.on("totalslot"+this.group,this.settotalslot,this);
				this.sandbox.on("resize",this.resize,this);
				this.sandbox.on("diff",this.diff,this);
				this.sandbox.once("finalize"+this.group,this.finalize,this);
			}
		}
	}
);
