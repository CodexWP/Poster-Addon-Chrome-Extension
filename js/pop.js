	$(document).ready(function(){		
		
		chrome.storage.sync.get("cldata", function (data){
			arr = data.cldata;
			console.log(arr);
			
			if(arr==undefined)
			{
				var data=[];
				chrome.storage.sync.set({'cldata': data}, function() {});
			}
				
		});		
		//console.log(data);	
		//UpdateList(data);
		chrome.storage.sync.get("range", function (data){
			range = data.range;
			$("span#liveacc").text("Range- "+range);
		});
		
		GetList();
		ShowID();
		
		
		$("button#save").click(function(){
			id = $("input#id").val();
			state = $("input#state").val();
			city = $("input#city").val();
			link = $("input#link").val();
			
			var obj = {};
			obj['id']=id;
			obj['state']=state;
			obj['city']=city;
			obj['link']=link;
			obj['status']=0;			
			AddList(obj);
			
		});
		$("button#resetstatus").click(function(){
		    ResetStatus();
		});
		
		$("a.refresh").click(function(){
			GetList();
			ShowID();
		});
		
		$("select#mid").change(function(){
			id = $(this).val();
			if(id == "undefined")
			{
				id = 0;
			}
			console.log(id);
			FindShow(id);
		});
		
		$("button#delete").click(function(){
			index = $("input#mindex").val();
			console.log(index);
			chrome.storage.sync.get("cldata", function (data){		
				arr = data.cldata;
				arr.splice(index,1);
				chrome.storage.sync.set({'cldata': arr}, function() {});
				$("#mmsg-success").css({"display":"block"});
				setTimeout(function(){
					$("#mmsg-success").css({"display":"none"});
				},1000);
			});
		});
		
		$("button#update").click(function(){
			index = $("input#mindex").val();
			console.log(index);
			state = $("input#mstate").val();
			city = $("input#mcity").val();
			link = $("input#mlink").val();
			status = $("select#mstatus").val();
			console.log(status);
			chrome.storage.sync.get("cldata", function (data){		
				arr = data.cldata;
				arr[index].state=state;
				arr[index].city=city;
				arr[index].link=link;
				arr[index].status=status;
				chrome.storage.sync.set({'cldata': arr}, function() {});
				$("#mmsg-success").css({"display":"block"});
				setTimeout(function(){
					$("#mmsg-success").css({"display":"none"});
				},1000);
			});
			
		});
		
		$("button#export").click(function(){
			Export();
		});
		$("button#import").click(function(){
			Import();
		});
		
	});
	
function GetList(){	
	chrome.storage.sync.get("cldata", function (data){		
		arr = data.cldata;
		console.log(arr);
		html='';
		$("tbody").html(html);
		if(arr==undefined)
			return;
		for(i=0;i<arr.length;i++)
		{
			obj = arr[i];
			//console.log(obj);
			if(obj!=undefined){
			state = obj.state;
			city = obj.city;			
			if(obj.status==2)
			{
				html = '<tr class="warning"><td>'+obj.id+'</td><td>'+state+'</td><td>'+city+'</td><td><a class="startlink" index="'+i+'" url="'+obj.plink+'" data="'+obj.id+'" href="#">Waiting</a></td></tr>';
			}
			else if(obj.status==1)
			{
				html = '<tr class="success"><td>'+obj.id+'</td><td>'+state+'</td><td>'+city+'</td><td><a class="startlink" index="'+i+'" url="'+obj.plink+'" data="'+obj.id+'" email="'+obj.email+'" pass="'+obj.pass+'" href="#">Success</a></td></tr>';
			}
			else if(obj.status==0)
			{
				html = '<tr><td>'+obj.id+'</td><td>'+state+'</td><td>'+city+'</td><td><a class="startlink" index="'+i+'" url="'+obj.plink+'" data="'+obj.id+'" email="'+obj.email+'" pass="'+obj.pass+'" href="#">Start</a></td></tr>';
			}
			else
			{
				html='';
			}
			$("tbody").append(html);
			
			}
		}
		
		$("a.startlink").click(function(){
			email = $(this).attr("email");
			pass = $(this).attr("pass");
			index = $(this).attr("index");			
			url= $(this).attr("url");
			id= $(this).attr("data");
			
			chrome.storage.sync.set({'currentid': id}, function() {});
			chrome.storage.sync.set({'currentemail': email}, function() {});			
			chrome.storage.sync.set({'currentpass': pass}, function() {});
			chrome.storage.sync.set({'indexid': index}, function() {});
			
			window.open(url);				
			console.log("id="+id);
			
		});
	});	
}
function ShowID(){
	chrome.storage.sync.get("cldata", function (data){		
		arr = data.cldata;
		$("select#mid").html("<option>Select an ID</option>");
		for(i=0;i<=arr.length;i++)
		{
			obj =arr[i];			
			if(obj!=undefined){
			html = '<option val="'+obj.id+'">'+obj.id+'</option>';
			$("select#mid").append(html);
			}
		}
	});	
}

function FindShow(id){
	chrome.storage.sync.get("cldata", function (data){		
		arr = data.cldata;
		for(i=0;i<=arr.length;i++)
		{
			obj =arr[i];
			if(obj!=undefined){
				if(obj.id==id)
				{
					$("input#mstate").val(obj.state);
					$("input#mcity").val(obj.city);
					$("input#mlink").val(obj.link);
					$("input#mindex").val(i);
					if(obj.status==0)
						$("select#mstatus").val("0");
					else if(obj.status==1)
						$("select#mstatus").val("1");
					if(obj.status==2)
						$("select#mstatus").val("2");
					break;
				}
			}
		}
	});
}
function AddList(obj){
	chrome.storage.sync.get("cldata", function (data){		
		arr = data.cldata;
		arr.push(obj);		
		chrome.storage.sync.set({'cldata': arr}, function() {
		console.log("Added");
		$("#msg-success").css({"display":"block"});
		setTimeout(function(){
			$("#msg-success").css({"display":"none"});
		},1000);
		});
	});	
}

function ResetStatus(){
	
	chrome.storage.sync.get("cldata", function (data){		
				arr = data.cldata;
				for(i=0;i<arr.length;i++)
				{
					arr[i].status=0;
				}
				chrome.storage.sync.set({'cldata': arr}, function() {});
	});
}


function Export()
{

	chrome.storage.sync.get("cldata", function (data){
		var obj = data.cldata;
		var jdata = JSON.stringify(obj);
		if(jdata=="")
		{
			console.log("Data empty");
			return;
		}
		
			account = $("select#acclist").val();
			if(account=="Select One")
			{
				alert("Select an Account First");
				return;
			}
		var root = 'http://www.fnfhost.com/clcamp/api.php?method=exdataexport&acc='+account;
		console.log(root);
		$.ajax({
		  url: root,
		  method: 'POST',
		  data: { 
					 data: jdata
				}	
		}).then(function(resp){
			console.log(resp);
			if(resp=="success")
			{
				$("#msgexportimport").css({"display":"block"});
				setTimeout(function(){
					$("#msgexportimport").css({"display":"none"});
				},1000);
			}
			
		});
	});
}

function Import()
{
	range = $("select#acclist").val();
	group = $("select#accgroup").val();
	if(group=="select")
	{
		alert("Select Group first");
		return;
	}
	if(range==0)
	{
		alert("Select Range first");
		return;
	}
		var root = 'https://www.processtel.co.uk/saiful/clcamp/api.php?method=import&range='+range+'&group='+group;
		console.log(root);
		$.ajax({
		  url: root,
		  method: 'GET',
		  dataType: "json"		  	
		}).then(function(resp){
			console.log(resp);			
			chrome.storage.sync.set({'cldata': resp}, function() {
				$("#msgexportimport").css({"display":"block"});
				setTimeout(function(){
					$("#msgexportimport").css({"display":"none"});
				},1000);				
				chrome.storage.sync.set({'range': range}, function() {					
					$("span#liveacc").text("Group-"+group+" : Range-"+range);
				});
				chrome.storage.sync.set({'currentgroup': group}, function() {});
			});
			
		
		});

}



function GetAccList()
{
		$("select#acclist").html("<option selected>Select One</option>");
		var root = 'http://www.fnfhost.com/clcamp/api.php?method=getacclist';
		console.log(root);
		$.ajax({
		  url: root,
		  method: 'GET',
		  dataType: "json"		  	
		}).then(function(resp){
			console.log(resp);
			for(i=0;i<resp.length-2;i++)
			{
				console.log(resp[i]);
				$("select#acclist").append("<option value='"+resp[i]+"'>"+resp[i]+"</option>");
			}
			
		});
		

}

function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}