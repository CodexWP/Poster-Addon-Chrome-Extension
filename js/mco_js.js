var api_url = "http://127.0.0.1/poster/api.php";
var api_url1 = "https://www.processtel.co.uk/saiful/poster/apibeta.php";

$(document).ready(function(){
	chrome.storage.sync.get({'editpost':[]}, function (obj){
			editpost =obj.editpost;
			console.log(editpost.poc);
	});
	var currentLocation = window.location;		
	var href = currentLocation.href;
	var arr = href.split("s=");
	var cl_s =arr[1];
	var arr1=href.split("/");
	
	// First Page before login
	var position1 = jQuery("div#leftbar").find("li").eq(1).find("a");
	var data1 = position1.text();	
	
	var position2=jQuery("div.accountform-actions").find("a");
	var data2 = position2.text();
	
	var position3=jQuery("form.new_posting_thing").find("select[name='areaabb']");
	var data3 = $("section.body").find("h4").text();	
	

	if(data1!=undefined && (data1=="my account" || data1=="post to classifieds")) //Clicked on my account link	
	{		
		setTimeout(function(){position1[0].click();},1000);
		return;
	}	
	else if(data2!=undefined && data2=="Forgot password?Account help") // Login with email and pass
	{
		DoLogin();
		return;
	}
	else if(position3!=undefined && position3.length!=0) //Click on Go button for new posting
	{
		arr = $("input[value='delete']");
		if(arr.length>0)
		{
			setTimeout(function(){position1[0].click();},1000);
			arr.eq(1).click();
		}
		else
		{
			$("form.new_posting_thing").find("button").click();
		}
		return;
	}
	else if(cl_s=="type"){
		SelectType();
		return;		
	}
	else if(cl_s=="ptype")
	{		
		SelectPType();
		return;
	}
	else if(cl_s=="mix")
	{		
		SelectMix();
		return;		
	}
	else if(cl_s=="subarea")
	{		
		SelectSubarea();
		return;
	}
	else if(cl_s=="hood")
	{		
		SelectBestLocation();
		return;
	}
	else if(cl_s=="edit")
	{		
		SetPostData();
		return;
	}
	else if(cl_s=="editimage")
	{		
		SetConfig("nclick",1);	
	}
	else if(cl_s=="preview")
	{		
		Publish();		
	}	
	else if(cl_s=="tou")
	{
		TOU();		
	}
	else if(cl_s=="mailoop")
	{		
		SetConfig("vneed",1);		
	}
	else if(cl_s=="pn")
	{
		chrome.storage.sync.get({'editpost':[]}, function (obj){
			editpost =obj.editpost;
			if(editpost.poc=="0")
				SetConfig("psuccess",4);
		});
		
	}
	else if(data3.includes("Thanks for posting with us. We really appreciate it!"))
	{
		click_manage_link();
		return;
	}
	else if(arr1[3]=="manage")
	{
		data = $("div.managestatus").find("b").text();
		if(data=="This posting has been deleted from craigslist. [?]")
		{
			window.location.href="https://accounts.craigslist.org/login/home";
		}
		data2 = $("input[value='Edit this Posting']");
		if(data2.length==1)
		{
			Complete();
		}
		
		return;
	}

});

function click_manage_link(){	
	setTimeout(function(){
		$pos=$(".body").find("li").eq(0).find("a");
		$pos[0].click();
	},1000);
}
function SelectType(){
	$("ul.selection-list").find("li").eq(10).find("input").prop('checked', true);
	setTimeout(function(){
	$("form").find("button").click();
	},500);
}
function SelectPType(){
	$("ul.selection-list").find("li").eq(3).find("input").prop('checked', true);
	setTimeout(function(){
	$("form").find("button").click();
	},200);
}
function SelectMix(){
	$("input[id='w']").prop('checked', true);
	setTimeout(function(){
	$("input[id='m2']").prop('checked', true);
	},300);
	setTimeout(function(){	
	$("form").find("button").click();
	},500);
}
function SelectSubarea(){
	$("ul.selection-list").find("li").eq(0).find("input").prop('checked', true);
	setTimeout(function(){
	$("form").find("button").click();
	},200);
}
function SelectBestLocation(){
	$("ul.selection-list").find("li").eq(0).find("input").prop('checked', true);
	setTimeout(function(){
	$("form").find("button").click();
	},200);
}
function SelectByPassCity(){
	$("ul.selection-list").find("li").eq(0).find("input").prop('checked', true);
	setTimeout(function(){
	$("form").find("button").click();
	},200);
}
function SetConfig(key,value)
{
	var root = api_url+"?request=setconfig&key="+key+"&value="+value;
	$.ajax({
	url: root,
	method: 'GET',
	}).then(function(resp){console.log(resp);});	
}

function DoLogin(){		
		error = $("div.alert").find("p").text();
		if(error==undefined || error=="")
		{}
		else
		{
			if(error=="Your account has been placed on hold. If you have any questions please contact us.")
			{
				//Account Hold functions
				SetConfig("psuccess",3);
				
			}
			else if(error=="You need to reset your account password. Please use this link.")
			{
				SetConfig("psuccess",4);
			}
			else if(error=="Your email address, handle, or password is incorrect. Please try again.")
			{
				//Account Password is wrong
				SetConfig("psuccess",5);
			}		
			return;			
		}	
		chrome.storage.sync.get("login", function (obj){
			login =obj.login;
			setTimeout(function(){
					$("form").eq(0).find("input[name='inputEmailHandle']").val(login['email']);
			},1000);
			setTimeout(function(){
					$("form").eq(0).find("input[name='inputPassword']").val(login['pass']);
			},2000);	
			setTimeout(function(){
					$("form").eq(0).find("button").click();	
			},3500);			
		});
}

function SetPostData(){
		chrome.storage.sync.get({'editpost':[]}, function (obj){
			editpost =obj.editpost;
			kikinfo = "";
			if(editpost.poc=="0")
				kikinfo = editpost.kik_text+" "+editpost.kik_name;
			
			body = editpost.body+" "+kikinfo;
			if(jQuery("input[name='FromEMail']").is(":visible"))
				click_timeout=8000;
			else
				click_timeout=6000;
			
			setTimeout(function(){
					$("input[name='PostingTitle']").val(editpost.title);
			},500);
			setTimeout(function(){
					$("input[name='GeographicArea']").val(editpost.city_name);
			},1000);
			setTimeout(function(){
				$("input[name='postal']").val(editpost.zip);
			},2500);
			setTimeout(function(){
				$("textarea[name='PostingBody']").text(body);
			},4000);
			setTimeout(function(){
				var age = Math.floor(Math.random() * (32 - 25 + 1)) + 25;
				$("input[name='pers_age']").val(age);
			},5000);
			if(jQuery("input[name='FromEMail']").is(":visible"))
			{
				setTimeout(function(){				
				$("input[name='FromEMail']").val(editpost.email);
				},6000);
				setTimeout(function(){				
				$("input[name='ConfirmEMail']").val(editpost.email);
				},7000);
			}
			
			setTimeout(function(){
				$("form").find("button").click();
			},click_timeout);
		});
}

function Publish(){
	setTimeout(function(){	
		$("form").eq(0).find("button").click();	
	},1000);
}

function TOU(){
	setTimeout(function(){	
		$("form").eq(0).find("button").click();	
	},200);
}
function Complete(){	
	chrome.storage.sync.get("editpost", function (obj){
		editpost = obj.editpost;
		acc_id = editpost['acc_id'];
		kik_name = editpost['kik_name'];
		user = editpost['user'];
		group_name = editpost['group_name'];
		link =$(".managestatus").find("a").attr("href");
		setTimeout(function(){
		var root = api_url1 +'?method=insertlink&user='+user;
		$.ajax({
		url: root,
		method: 'POST',
		data: { 
			url: link,
			acc_id: acc_id,
			kik_name: kik_name,
			group_name: group_name
			}
		}).then(function(resp) {
			var obj = $.parseJSON(resp);			
			if(obj.status=="success")
			{
				html = "<strong style='color:green'>Successfully updated</strong>";
				$(".managestatus").append(html);
				SetConfig("psuccess",2);
			}
			else
			{
				html = "<strong style='color:red'>Failed: "+obj.status+"</strong>";
				$(".managestatus").append(html);
			}
			
		});
		},2000);
			
	});
}




