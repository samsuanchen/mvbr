var dbid=process.argv[1].match(/[^\\]*$/)[0]
console.log(require('yase').build({
	dbid:dbid,
	schema:function() {
		this.toctag(["xml","testiment","book","chapter","verse"])
		    .attr("testiment","id",{"saveval":true,"unique":true})	
		    .emptytag("pb").attr("pb","n",{"prefix":"book[n]","saveval":true})
		   	.attr("book","n",{"saveval":true})			  
			.attr("chapter","n",{"prefix":"book[n]","saveval":true,"unique":true})
			.attr("verse","n",{"prefix":"chapter[n]","saveval":true,"unique":true})
	},
	toc : { 
		"logical":["testiment","book","chapter"]
		,"physical":["book","pb"] 
	},
	input:dbid+'.xml',
	output:'../'+dbid+'.ydb',
	version:'0.0.0',
}));