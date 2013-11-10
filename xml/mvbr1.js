var set=process.argv[2]||"chinese";
console.log(require('yase').build({
	dbid:'bible_'+set,
	schema:function() {
		this.toctag(["xml","testiment","book","chapter","verse"])
		    	.attr("testiment","id",{"saveval":true,"unique":true})	
		      .emptytag("pb").attr("pb","n",{"prefix":"book[id]","saveval":true})
		      .attr("book","id",{"saveval":true})			  
			  .attr("chapter","n",{"prefix":"book[id]","saveval":true,"unique":true})
			  .attr("verse","n",{"prefix":"chapter[n]","saveval":true,"unique":true})
	},
	toc : { 
		"logical":["testiment","book","chapter"]
		,"physical":["book","pb"] 
	},
	input:'bible_'+set+'.lst',
	output:'../bible_'+set+'.ydb',
	version:'0.0.0',
}));