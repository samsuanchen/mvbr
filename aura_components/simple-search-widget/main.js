define(['underscore','backbone','text!./template.tmpl','text!./dbs_template.tmpl',
  'text!../config.json'], 
  function(_,Backbone,template,dbs_template,config) {
  return {
    type: 'Backbone', 
    events: {
    	"input #tofind":"dosearch",
      "click #cleartofind":"cleartofind",
      "click input[name='selectdb']":"selectdb",
    },
    cleartofind:function() {
      this.$el.find("#tofind").val("").focus();
      this.dosearch();
    },
    selectdb:function(e) {
      var db=$(e.target).data('db');
      this.model.set('db',db);
      this.$el.find("#bookmark").text("與對應的"+db.split(':')[1]+"比對")
    },
    gotosource:function(opts) {
      var extra={db:opts.db,start:opts.slot,scrollto:"",tofind:opts.tofind}
      var tofind=this.model.get('tofind');
      var opts={widget:"text-widget",name:tofind,extra:extra,focus:true};
      this.sandbox.emit("newtab",opts);
    },         
    listresult:function(start) {
      var that=this;
      var db=this.model.get('db');
      var dbs=this.model.get('dbs');
      var tofind=this.model.get('tofind');
      if (!db || !tofind) return;
      var opts={db:db,tofind:tofind,highlight:true,maxcount:20,start:start||0
        ,sourceinfo:true};
      this.sandbox.yase.phraseSearch(opts,function(err,data) {
        if (opts.start==0) {
          var count=dbs[db].count;
          that.sandbox.emit('newresult',data,db,tofind);
          that.sandbox.emit('totalslot',count.count,count.hitcount);
        }
        else that.sandbox.emit('moreresult',data);
        
      });

    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        var that=this;
        var tofind=that.$("#tofind").val().trim();
        if (!tofind) {
          this.$el.find("#searchhelp").show();
          this.$el.find("#searchresult").hide();
        } else {
          this.$el.find("#searchhelp").hide();
          this.$el.find("#searchresult").show();
        }
        this.timer=setTimeout(function(){
          localStorage.setItem("tofind.kse",tofind);
          that.model.set('tofind',tofind);
          that.gethitcount(tofind);
          that.listresult();
        },500);
        
    },
    gethitcount:function(tofind) {
      var that=this;
      var dbs=this.model.get('dbs');
      for (var i in dbs) {
        this.sandbox.yase.phraseSearch({tofind:tofind,countonly:true,db:dbs[i].name},
          (function(db) {
            return function(err,data){
             dbs[db].count=data.count;
             dbs[db].extraclass='hit'
             that.showdbs();
            }
          })(i)
        );
      }
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$el.find("#tofind").focus();
    },
    showdbs:function() { var dbs, h
      this.dbs=dbs=this.model.get('dbs');
      h=_.template(dbs_template,{dbs:dbs})
      this.$el.find("#bible_related_db").html(h);
    //  console.log(h)
    },
    initialize: function() {
     	this.render();
      var that=this;
      this.model=new Backbone.Model();
      this.config=JSON.parse(config);
      this.sandbox.on('selectdb',this.selectdb,this);
      


      this.model.on('change:db',function(){that.listresult()},this);
      this.sandbox.on('more',this.listresult ,this);
      this.sandbox.on("gotosource",this.gotosource,this);

      this.model.on('change:dbs',this.showdbs,this);

      var dbs={};
      for (var i in this.config.dbs) {
        dbs["mvbr:"+this.config.dbs[i]]={count:0, name:this.config.dbs[i]};
      }
      this.model.set('dbs',dbs);      
      setTimeout(function(){
        that.$("#tofind").val(localStorage.getItem("tofind.kse"));
        that.dosearch();
      },100)
    }
  };
});
