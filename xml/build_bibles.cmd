REM build_bibles.cmd
node conv_bibles.js   >build_bibles.log
call buildydb bible1 >>build_bibles.log
call buildydb hb51   >>build_bibles.log
call buildydb hgb1   >>build_bibles.log
call buildydb kjv1   >>build_bibles.log
call buildydb bbe1   >>build_bibles.log