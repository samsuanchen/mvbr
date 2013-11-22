console.log(require('yase').build({
	dbid:'xxx',  // <--- xxx //
	schema:function() {
		this.toctag(["xml","book","chapter","section"])
		      .emptytag("pb").attr("pb","n",{"prefix":"book[id]","saveval":true})
		      .attr("book","id",{"saveval":true,"unique":true})			  
			  .attr("chapter","n",{"prefix":"book[id]","saveval":true,"unique":true})
			  .attr("section","n",{"prefix":"chapter[n]","saveval":true,"unique":true})
	},
	toc : { 
		"logical":["book","chapter","section"]
		,"physical":["book","pb"] 
	},
	input:'xxx.lst',  // <--- xxx //
	output:'../xxx.ydb',  // <--- xxx //
	version:'0.0.0',
}));