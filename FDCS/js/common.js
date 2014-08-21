$(document).ready(function(){
	var remain = $(document).height() - 165;
	if(remain < 400){
		remain = 400;
	}
	$("#main").css({
		"height": remain
	});
	
	Common.loadDataList();
});

Common = {};

Common.loadDataList = function(){
	$.get("data-list.csv")
		.done(function(data){
//			console.log(data);
			var list = data.split("\r\n");
//			console.log(list.length);
			
			var selector = $("<select></select>");
			selector.attr("onchange","Common.loadTable()");
			selector.appendTo("#selector");
			var language;
			$("<option value = '0'>=====请选择一类=====</option>").appendTo(selector);
			for(var i = 0; i < list.length - 1; i++){
				language = list[i].split("\t");
				$("<option value = '" + language[1] + "'>" + language[0] + "</option>").appendTo(selector);
			}
			
			var height = $("#selector").height() + 20;
//			console.log(height);
			$("#menu").css({
				"height": height
			});
			$("#exporter").css({
				"height": height - 9
			});
			$("#tableCntr").css({
				"height": $("#main").height() - height - 31
			});
			
			var a = $("<a href = 'javascript:void(0)'></a>");
			a.appendTo("#exporter");
			var button = $("<input type = 'button' value = '下载表格'>");
			button.appendTo(a);
		}).fail(function(){
			alert("Oops, we got an error...");
		});
};

Common.loadTable = function(){
	var value = $("#selector").children("select").val();
//	console.log(value);
	if(value === "0"){
		$("#exporter a").attr("href","javascript:void(0)");
		$("#exporter").css({
			"display": "none"
		});
		$("#tableCntr").empty();
		return;
	}
	
	if((value === "House Price") || (value === "China Finance")){
		$("#exporter a").attr("href","javascript:void(0)");
		$("#exporter").css({
			"display": "none"
		});
		$("#tableCntr").empty();
		
		$.get("data/" + value + "/day-list")
			.done(function(data){
//				console.log(data);
				var list = data.split("\r\n");
				
				var table = $("<table></table>");
				table.attr("id","table");
				table.attr("class","display");
				table.appendTo("#tableCntr");
				var thead = $("<thead></thead>");
				thead.appendTo(table);
				var tbody = $("<tbody></tbody>");
				tbody.appendTo(table);
				
				var tr = $("<tr></tr>");
				tr.appendTo(thead);
				var th = $("<th></th>");
				th.appendTo(tr);
				th.text("日期");
				th = $("<th></th>");
				th.appendTo(tr);
				th.text("文件");
				
				for(var i = 0; i < list.length - 1; i++){
					tr = $("<tr></tr>");
					tr.appendTo(tbody);
					var td = $("<td></td>");
					td.appendTo(tr);
					td.text(list[i]);
					td = $("<td></td>");
					td.appendTo(tr);
					td.html("<a href = 'data/" + value + "/" + list[i] + ".zip'>下载文件</a>");
				}
				
				$("#table").DataTable();
			}).fail(function(){
				alert("Oops, we got an error...");
			});
		return;
	}
	
	$("#exporter a").attr("href","data/" + value + ".csv");
	$("#exporter").css({
		"display": "block"
	});
	$("#tableCntr").empty();
	
	$.get("data/" + value + ".csv")
		.done(function(data){
//			console.log(data);
			var list = data.split("\r\n");
			
			var table = $("<table></table>");
			table.attr("id","table");
			table.attr("class","display");
			table.appendTo("#tableCntr");
			var thead = $("<thead></thead>");
			thead.appendTo(table);
			var tbody = $("<tbody></tbody>");
			tbody.appendTo(table);
			
			var tr = $("<tr></tr>");
			tr.appendTo(thead);
			var title = list[0].split(",");
			for(var i = 0; i < title.length; i++){
				var th = $("<th></th>");
				th.appendTo(tr);
				th.text(title[i]);
			}
			
			for(var i = 1; i < list.length - 1; i++){
				tr = $("<tr></tr>");
				tr.appendTo(tbody);
				var line = list[i].split(",");
				for(var j = 0; j < line.length; j++){
					var td = $("<td></td>");
					td.appendTo(tr);
					td.text(line[j]);
				}
			}
			
			$("#table").DataTable();
		}).fail(function(){
			alert("Oops, we got an error...");
		});
};