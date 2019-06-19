var api_url = "http://127.0.0.1/poster/api.php";
setTimeout(function(){
	var root = api_url+'?request=getinfo';
	$.ajax({
	  url: root,
	  method: 'GET',
	}).then(function(resp){
		console.log(resp);
		obj = $.parseJSON(resp);
		
		if(obj['status']=="success")
		{
			accarr = obj['accinfo'].split("|");//acc_id + "|" + email + "|" + pass + "|" + city_name + "|" + state + "|" + zip + "|" + url + "|" + kik_name + "|" + poc;
			console.log(accarr);
			var id = accarr[0];
			var url = accarr[6];			
			var editpost ={};
			editpost['acc_id'] = id;
			editpost['title'] = obj['title'];
			editpost['zip'] = accarr[5];
			editpost['body'] = obj['body'];
			editpost['kik_text'] = obj['kik_text'];
			editpost['kik_name'] = accarr[7];
			editpost['city_name'] = accarr[3];
			editpost['email'] = accarr[1];
			editpost['poc'] = accarr[8];
			editpost['user'] = accarr[9];
			editpost['group_name'] = accarr[10];
			var login = {};
			login['email'] = accarr[1];
			login['pass'] = accarr[2];
			chrome.storage.sync.set({'login':login});
			chrome.storage.sync.set({'editpost':editpost});			
			window.open(url);
		}
	})				

},3000);
var timer = setInterval(function(){
		VerifyLink();
},3000);

function VerifyLink(){
	var root = api_url+'?request=getvlink';
	$.ajax({
	  url: root,
	  method: 'GET',
	}).then(function(resp){
		console.log(resp);		
		if(resp!="0")
		{			
			window.open(resp);
			clearInterval(timer);
		}		
	});
}