var initData;
var cur_inter;
(function() {

	var store = localStorage;

	var serverUrl = "http://192.168.2.133:8080/index.do";
	// var serverUrl = "test.json";

	// var machineUrl = "machinestatus.json";
	var machineUrl = "http://192.168.2.133:8080/detail.do";

	var startMachineUrl = "http://192.168.2.133:8080/startup.do";
	var shutdownUrl = "http://192.168.2.133:8080/shutdown.do";
	// Toggle Left Menu
	// 
	// 
	var serviceStartUrl = "http://192.168.2.133:8080/start.do";
	var serviceStopUrl = "http://192.168.2.133:8080/stop.do";
	var serviceReloadUrl = "http://192.168.2.133:8080/reload.do";
	var serviceUndeployUrl = "http://192.168.2.133:8080/undeploy.do";
	var serviceDeployUrl = "http://192.168.2.133:8080/deploy.do";

	var bindToggle = function() {
		/*jQuery('.menu-list > a').click(function() {
      
	      var parent = jQuery(this).parent();
	      var sub = parent.find('> ul');
	      
	      if(!jQuery('body').hasClass('left-side-collapsed')) {
	         if(sub.is(':visible')) {
	            sub.slideUp(200, function(){
	               parent.removeClass('nav-active');
	               jQuery('.main-content').css({height: ''});
	               mainContentHeightAdjust();
	            });
	         } else {
	            visibleSubMenuClose();
	            parent.addClass('nav-active');
	            sub.slideDown(200, function(){
	                mainContentHeightAdjust();
	            });
	         }
	      }
	      return false;
	   });*/
	}


	/*$('#remoteDeploy').click(function(){
		var file = $('#war_pac')[0].files[0];
		console.log($('#war_pac')[0]);
		var ip = store.getItem('machine_ip');
		var port = store.getItem('machine_port');
		$.ajax({
			type: 'POST',
			url: serviceDeployUrl,
			dataType: 'json',
			contentType: 'multipart/form-data',
			data:{
				war: file,
				ip: ip,
				port: port
			},
			success: function(data){
				$('.modal-body').text(data.msg);
				$('#myModal').modal();
			}
		})
	});*/

	function visibleSubMenuClose() {
		jQuery('.menu-list').each(function() {
			var t = jQuery(this);
			if (t.hasClass('nav-active')) {
				t.find('> ul').slideUp(200, function() {
					t.removeClass('nav-active');
				});
			}
		});
	}

	function mainContentHeightAdjust() {
		// Adjust main content height
		var docHeight = jQuery(document).height();
		if (docHeight > jQuery('.main-content').height())
			jQuery('.main-content').height(docHeight);
	}


	var tmplNav = function(data) {

		var all = '';
		for (var i = 0; i < data.length; i++) {
			var machines = data[i].machines;
			all += '<li class="menu-list active"><a href="#"><i class="fa fa-home"></i> <span> ' + data[i].title + '</span></a>'
			all += '<ul class="sub-menu-list" id="' + data[i].name + '">';
			for (var j = 0; j < machines.length; j++) {
				var textClass = machines[j].live ? "text-success" : "text-danger";
				all += '<li ><a href="#' + '" id="' + machines[j].ip + '-' + machines[j].port + '"><span ' + ' class="' + textClass + '">' + machines[j].name + "   " + machines[j].ip + '</span></a></li>'
			};

			all += '</ul></li>';
		};

		return all;
	};

	var tmplCluster = function(cluster) {
		var all = '<div class="wrapper"><div class="row"><div class="col-md-12">' + '<section class="panel panel-primary">' + '<header class="panel-heading">集群信息：<span class="tools pull-right">' + '<a href="javascript:;" class="fa fa-chevron-down"></a></span></header><div class="panel-body">' + '<div id="visitors-chart"><div id="visitors-container" style="width: 100%;height:300px; text-align: center; margin:0 auto;">' + '</div></div></div></section></div></div></div>';

		return all;

	};


	var tmplMachine = function() {


		return all;
	};

	function init(data) {
		//console.log(data);
		$('#lnav').empty();
		$('#lnav').append(tmplNav(data));

		initStatus();
	}

	var initStatus = function() {
		var html = '';

		var machines = findCluster('webcluster').machines;
		for (var i = 0; i < machines.length; i++) {
			var live = "";
			var spanClass = "";
			if (machines[i].live) {
				live = '已开启';
				spanClass = "label label-success";
			} else {
				live = '已关闭';
				spanClass = "label label-danger";
			}
			html += '<div class="row"><div class="col-md-4">' +
				machines[i].name + '</div><div class="col-md-4">' +
				machines[i].ip + '</div><div class="col-md-4">' +
				'<span id="' + machines[i].ip + '%' + machines[i].port + '" class="' + spanClass + '">' + live + '</span></div></div><br/>';
		};
		$('#webclusterDetile').append(html);
		html = '';

		machines = findCluster('appcluster').machines;
		for (var i = 0; i < machines.length; i++) {
			var live = "";
			var spanClass = "";
			if (machines[i].live) {
				live = '已开启';
				spanClass = "label label-success";
			} else {
				live = '已关闭';
				spanClass = "label label-danger";
			}
			html += '<div class="row"><div class="col-md-4">' +
				machines[i].name + '</div><div class="col-md-4">' +
				machines[i].ip + '</div><div class="col-md-4">' +
				'<span id="' + machines[i].ip + '%' + machines[i].port + '" class="' + spanClass + '">' + live + '</span></div></div><br/>';
		};
		$('#appclusterDetile').append(html);


	}

	function requestDir() {
		$.ajax({
			type: 'GET',
			url: serverUrl,
			dataType: 'json',
			async: false,
			success: function(data) {
				initData = data;
				init(data);

				bindToggle();
				//localStorage.setItem('init',JSON.stringify(data));
				bindX();
			},
			error: function(data) {
				console.log(data);
			}
		});
	}
	requestDir();

	function requestCluster() {
		$.ajax({
			type: 'GET',
			url: serverUrl,
			dataType: 'json',
			//async: false,
			success: function(data) {
				updataCluster(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	}

	function requestMachineDetile() {
		var ip = store.getItem('machine_ip');
		var port = store.getItem('machine_port');
		$.ajax({
			type: 'GET',
			url: machineUrl,
			dataType: 'json',
			data: {
				ip: ip,
				port: port
			},
			//async: false,
			success: function(data) {
				updataMachine(data);
			},
			error: function(data) {
				$('#physics').empty();
				$("#serviceDetile").empty();
				$('#jvm').empty();
			}
		});
	}

	function updataMachine(data) {
		$('#physics').empty();
		$("#serviceDetile").empty();
		$('#jvm').empty();
		var html = '';
		if (!data.live) {
			$('#startMachine').removeClass('btn-success');
			$('#startMachine').text("已关闭");
			return;
		}
		$('#startMachine').addClass('btn-success');
		$('#startMachine').text("已开启");

		/*************物理信息*********/
		for (var i in data.osinfo) {

			html += '<li><div class="title">' + i + '</div><div class="text-success">' + data.osinfo[i] + '</div></li>'

		}
		$('#physics').append(html);

		/****************JVM信息**********/
		html = '';
		for (var i in data.jvminfo) {

			html += '<li><div class="title">' + i + '</div><div class="text-success">' + data.jvminfo[i] + '</div></li>'

		}
		$('#jvm').append(html);


		/***************服务信息*****************/
		html = '';

		for (var i = 0; i < data.serviceinfo.length; i++) {
			var service = data.serviceinfo[i];
			var btnClass = "";
			var btn_info = "";
			var status_info = "";
			if (service.live) {
				btnClass = "";
				btn_info = "关闭";
				status_info = "已开启"
			} else {
				btnClass = "btn-success";
				btn_info = "开启";
				status_info = "已关闭"
			}

			html += '<div class="row">' + '<div class="col-md-2">' + service.name + '</div>' + '<div class="col-md-2">' + status_info + '</div>' + '<div class="col-md-2">' + service.count + '</div>' + '<div class="col-md-2"><button id="' + (service.name + '_Toggle') + '" class="btn btn-default serviceToggle ' + btnClass + '">' + btn_info + '</button></div>' + ' <div class="col-md-2"><input id="' + service.name + '_Reload" type="button" class="btn btn-default btn-warning reload" value="reload"></div>' + '<div class="col-md-2"><input id="' + service.name + '_Undeploy" type="button" class="btn btn-default btn-danger undeploy" value="undeploy"></div>' + '</div><br/>';

		}
		$("#serviceDetile").append(html);


		/****bind event*****/
		$('button.serviceToggle,input.reload,input.undeploy').click(function() {
			var path = "/" + this.id.split('_')[0];
			var ip = store.getItem('machine_ip');
			var port = store.getItem('machine_port');

			var url;
			var action = this.id.split('_')[1];

			if (action == "Toggle") {
				if (!$(this).hasClass('btn-success')) {
					url = serviceStopUrl;
				} else {
					url = serviceStartUrl;
				}
			} else if (action == "Reload") {
				url = serviceReloadUrl;
			} else if (action == "Undeploy") {
				var r = confirm("卸载将永久删除服务器上的War包，确定要卸载吗？");
				if (r == true) {
					url = serviceUndeployUrl;
				} else {
					return;
				}

			}

			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				data: {
					ip: ip,
					port: port,
					path: path
				},
				success: function(data) {
					$('.modal-body').text(data.msg);
					$('#myModal').modal();
				}
			});
		});
	}

	function toggleMachine(e) {
		if (e.type === "click") {
			var ip = store.getItem('machine_ip');
			var port = store.getItem('machine_port');
		} else {
			var ip = this.id.split('%')[0];
			var port = this.id.split('%')[1];
		}

		var url;
		var type;

		if (!$(this).hasClass('btn-success')) {
			url = startMachineUrl;

			type = "start";
		} else {

			url = shutdownUrl;

			type = "shutdown";
		}
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'json',
			data: {
				ip: ip,
				port: port
			},
			// async: false,
			success: function(data) {
				$('.modal-body').text(data.msg);
				$('#myModal').modal();
				if (data.success) {
					// change the nav styles...
					var p = document.getElementById(ip + '-' + port);
					var c = p.firstElementChild;
					if (type === "start") {
						$(c).removeClass('text-danger');
						$(c).addClass('text-success');
						var btn = document.getElementById(ip + '%' + port);
						$(btn).removeClass('label-danger');
						$(btn).addClass('label-success');
						$(btn).text('已开启');
						//$(btn).bootstrapToggle('on');
					} else {
						$(c).removeClass('text-success');
						$(c).addClass('text-danger');
						var btn = document.getElementById(ip + '%' + port);
						$(btn).removeClass('label-success');
						$(btn).addClass('label-danger');
						$(btn).text('已关闭');
						//$(btn).bootstrapToggle('off');
					}
				}
			},
			error: function(data) {
				console.log(data);
			}
		});

	}

	function bindX() {

		$('#startMachine').click(toggleMachine);
		//$('input[data-toggle="toggle"]').change(toggleMachine);
		$('.menu-list > a').click(function(e) {

			var clusterName = $(this).parent().find('ul')[0].id;
			var cluster = findCluster(clusterName);


			store.setItem('pagetype', 'cluster');
			store.setItem('cluster', JSON.stringify(cluster));

			if (clusterName === "webcluster") {
				if ($('#webclusterStatus').hasClass('hide')) {
					$('#webclusterStatus').removeClass('hide');
				}
				if (!$('#appclusterStatus').hasClass('hide')) {
					$('#appclusterStatus').addClass('hide');
				}


			}
			if (clusterName === "appcluster") {
				if ($('#appclusterStatus').hasClass('hide')) {
					$('#appclusterStatus').removeClass('hide');
				}
				if (!$('#webclusterStatus').hasClass('hide')) {
					$('#webclusterStatus').addClass('hide');
				}

			}
			if (!$('#machine').hasClass('hide')) {
				$('#machine').addClass('hide');
			}

			setTite(cluster.title);

			//createClusterDetile(cluster);
			//alert(id);
			//localStorage.setItem('');			
		});


		$('.menu-list > ul >li>a').click(function(e) {

			var machineIP = this.id.split('-')[0];
			var port = this.id.split('-')[1];

			var machine = findMachine(machineIP);

			/*store.setItem('pagetype','machine');
			store.setItem('machine',JSON.stringify(machine));*/

			store.setItem('machine_ip', machineIP);
			store.setItem('machine_port', port);

			if (!$('#webclusterStatus').hasClass('hide')) {
				$('#webclusterStatus').addClass('hide');
			}
			if (!$('#appclusterStatus').hasClass('hide')) {
				$('#appclusterStatus').addClass('hide');
			}
			if ($('#machine').hasClass('hide')) {
				$('#machine').removeClass('hide');
			}

			setTite(machine.name + "  " + machine.ip);
			if (cur_inter) {
				clearInterval(cur_inter);
			}

			$('#war_ip').val(machineIP);
			$('#war_port').val(port);

			$('#war_ip_1').val(machineIP);
			$('#war_port_1').val(port);
			requestMachineDetile();
			cur_inter = setInterval(requestMachineDetile, 2000);
			//createMachineDetile(machine);
		});
	};

	function setTite(title) {
		$('.page-heading>h3').text(title);
	}

	function findMachine(ip) {
		for (var i = 0; i < initData.length; i++) {
			for (var j = 0; j < initData[i].machines.length; j++) {
				if (initData[i].machines[j].ip === ip)
					return initData[i].machines[j];
			};
		}
		return null;
	}

	function findCluster(custerName) {
		for (var i = 0; i < initData.length; i++) {
			if (initData[i].name === custerName) {
				return initData[i];
			}
		}
		return null;
	}



	function createMachineDetile(machine) {
		createPageTitle4Machine(machine);
		createContent4Machine(machine);
	}

	function createClusterDetile(cluster) {

		createPageTitle4Cluster(cluster);
		createContent4Cluster(cluster);
	}

	function createContent4Machine(machine) {
		$('.wrapper').empty();
		//$('.wrapper').append(tmplMachine(cluster));
	}

	function createContent4Cluster(cluster) {
		$('.wrapper').empty();
		$('.wrapper').append(tmplCluster(cluster));
	}

	function createPageTitle4Cluster(cluster) {
		$('.page-heading>h3').text(cluster.title);
	}

	function createPageTitle4Machine(machine) {
		$('.page-heading>h3').text(machine.name + "   " + machine.ip);
	}

})();