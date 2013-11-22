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

###製作 bible_chinese.ydb 的步驟:
* 1. 轉換 1ot.xm, 2nt.xml ==> 1ot1.xml, 2nt1.xml
* 2. 編輯 bible_chinese.lst 內含兩列 1ot1.xml, 2nt1.xml
* 3. 編輯 mvbr1.js 引用 bible_chinese.lst
* 4. node mvbr1.js 建立 bible_chinese.ydb
* 5. commit and sync
* 6. 到 kse 資料夾, 執行 git pull (確定使用最新版本)
* 7. 到 mvbr 資料夾, 編輯 config.json 指定 db 使用 chinese_bible.ydb

###下載 kse 的步驟:
* 1. 到 ksanapc 資料夾
* 2. 執行 git clone https://github.com/yapcheahshen/kse

###下載 康熙字典 的步驟:
* 1. 到 ksanapc 資料夾
* 2. 執行 git clone https://github.com/ksanaforge/kangxizidian
* 3. 到 ksanapc\kangxizidian\xml 資料夾
* 4. 執行 build.cmd

###製作 bible1, hb51, hgb1, kjv1, bbe1 對應 .ydb 的步驟:
* 1. 滑鼠連點兩下 c:\ksanapc\mvbr\xml\build_bibles.cmd 執行:
		node conv_bibles.js   >build_bibles.log
		call buildydb bible1 >>build_bibles.log
		call buildydb hb51   >>build_bibles.log
		call buildydb hgb1   >>build_bibles.log
		call buildydb kjv1   >>build_bibles.log
		call buildydb bbe1   >>build_bibles.log
     自動轉換 5 個對應的 *.txt 產生 *1.xml *1.ydb build_bibles.log
* 2. commit and sync
* 3. 到 kse 資料夾, 執行 git pull (確定使用最新版本)
* 4. 到 mvbr 資料夾, 編輯 config.json 指定 db 使用 對應的 *1.ydb 以測試

###測試 *.ydb 的步驟:
* 1. 到 mvbr 資料夾, 執行 run.cmd (對應的 *1.ydb 連上)
* 2. !!! 可能 還無法檢視 所有搜尋到的項目 !!!

###暫時測試 *.ydb 的步驟:
* 1. 到 kse 資料夾, 執行 run.cmd (所有 ksanapc 下一層資料夾內 *.ydb 都連上)

###下載 mvbr 的步驟:
* 1. 到 ksanapc 資料夾
* 2. 執行 git clone -b dev https://github.com/samsuanchen/mvbr 
