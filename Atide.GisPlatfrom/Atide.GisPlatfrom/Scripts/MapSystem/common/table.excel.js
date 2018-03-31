//导出Excel
function exportExcel(id,filename) {
	var rows = $("#"+ id).datagrid("getRows");
	var bodyData = JSON.stringify(rows);  //转成json字符串
	//替换中文标题
	var a = bodyData.replace(/XZQDM/g, "行政区代码").replace(/TBBH/g, "图斑编号").replace(/XZHC/g, "变更调查现状核查")
   .replace(/YSBM/g, "要素编码").replace(/XMMC/g, "项目名称").replace(/ZRR/g, "责任人").replace(/YDWZ/g, '用地位置')
   .replace(/YDLX/g, "设施农用地类型").replace(/BABH/g, "备案编号").replace(/BASJ/g, "备案时间").replace(/SJMJ/g, "实际面积")
   .replace(/HCJG/g, "变更调查核查结果").replace(/YDMJ/g, "用地面积").replace(/GDMJ/g, "占用耕地").replace(/YDGM/g, "用地规模")
   .replace(/YEAR/g, "图斑年份").replace(/BZ/g, "备注");

	var postData = {
		data: a,
		filename: filename
	};

	$.ajax({
		type: "POST",
		url: "MapSystem/ExportExcel",
		data: postData,
		success: function (data) {
			if (data == "1") {
				layer.msg("操作成功,文件已存放到桌面！", {
					icon: 6,
					time: 2000,
				});
			} else if (data == "-1") {
				layer.msg("操作失败！", { icon: 2 });
			}
		}
	});
}