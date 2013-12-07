define(['underscore','backbone','text!./template.tmpl','text!./dbs_template.tmpl',
  'text!../config.json'],function(_,Backbone,template,dbs_template,
  config) {
  return {

    type: 'Backbone.nested', 
    events: {
    	"input #query":"dosearch",
      "click #clearquery":"clearquery",
      "click input[name='selectdb']":"selectdb",
    },
    clearquery:function() {
      this.$el.find("#query").val("").focus();
      this.dosearch();
    },
    selectdb:function(e) {
      var db=$(e.target).data('db');
      this.model.set('db',db);
    },
    gotosource:function(opts) {
      opts.scrollto=""
      opts.dbs=this.dbs
      var extra={widget:"multitext",name:opts.query,extra:opts,focus:true}
//	var extra={db:opts.db,start:opts,scrollto:"",query:query}
//  var opts={widget:"multitext",name:query,extra:extra,focus:true};
      this.sandbox.emit("newtab",extra);
    },         
    listresult:function(start) {
      var that=this;
      var db=this.model.get('db');
      var dbs=this.model.get('dbs');
      var query=this.model.get('query');
      if (!db || !query) return;
      var opts={db:db,tofind:query,highlight:true,maxcount:20,start:start||0
        ,sourceinfo:true};
      this.sandbox.yase.phraseSearch(opts,function(err,data) {
        if (opts.start==0) {
          var count=dbs[db].count;
          that.sandbox.emit('newresult',data,db,query);
          that.sandbox.emit('totalslot',count.count,count.hitcount);
        }
        else that.sandbox.emit('moreresult',data);
        
      });

    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        var that=this;
        var query=that.$("#query").val().trim();
        if (!query) {
          this.$el.find("#searchhelp").show();
          this.$el.find("#searchresult").hide();
        } else {
          this.$el.find("#searchhelp").hide();
          this.$el.find("#searchresult").show();
        }
        this.timer=setTimeout(function(){
          localStorage.setItem("query.kse",query);
          that.model.set('query',query);
          that.gethitcount(query);
          that.listresult();
        },500);
        
    },
    gethitcount:function(query) {
      var that=this;
      var dbs=this.model.get('dbs');
      for (var i in dbs) {
        this.sandbox.yase.phraseSearch({tofind:query,countonly:true,db:dbs[i].name},
          (function(db) {
            return function(err,data){
             dbs[db].count=data;
             dbs[db].extraclass='hit'
             that.showdbs();
            }
          })(i)
        );
      }
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$el.find("#query").focus();
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
        that.$("#query").val(localStorage.getItem("query.kse"));
        that.dosearch();
      },100)
    }
  };
});
