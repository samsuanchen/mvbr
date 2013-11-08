slotfilter
==========

a sample application for ksanapc, to demonstrate calling yase and Backbone Aura, Backbone Epoxy

###dependencies
* https://github.com/yapcheahshen/ksanapc
* npm install yadb
* npm install yase

###build a sample database
* cd slotfilter/sample
* node sample
you will get sample.ydb in slotfilter

製作 bible_chinese.ydb 的步驟:
1. 用 conv_chinese_bible.js 轉換 1ot.xm, 2nt.xml ==> 1ot1.xml, 2nt1.xml
2. 編輯 chinese_bible.lst 包括兩列 1ot1.xml, 2nt1.xml
3. 編輯 mvbr1.js 引用 chinese_bible.lst
4. node mvbr1.js 建立 chinese_bible.ydb
5. commit
6. 到 kse 資料夾, 執行 git pull (確定使用最新版本)
7. 到 ksanapc 資料夾, 執行 node scaffold.js mvbr kse --overwrite
8. 到 mvbr 資料夾, 編輯 config.json 指定 db 使用 chinese_bible.ydb

測試 bible_chinese.ydb 的步驟:
1. 到 kse 資料夾, 執行 run.cmd