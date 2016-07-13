$(function(){
	var $fans = $('#admirers');
	var $name = $('#name');
	var $age = $('#age');

	function addFan(fan){ //need to add to front instead
		$fans.prepend('<li>' + fan.name + ', ' + fan.age +'</li>');
	}

	$.ajax({
		type: 'GET',
		url: 'http://rest.learncode.academy/api/johnbob/friends',
		success: function(fans){
			$.each(fans, function(i, fan){
				if(fan.name && fan.age){ //is there a name and age?
					if(/\S/.test(fan.name)){ //if there's at least one non white space character
						addFan(fan);						
					}	
				}
			});
		},
		error: function(){
			alert('error loading fans');
		}
	});

	$('#add-admirer').on('click', function(){
		var fan = {
			name: $name.val(),
			age: $age.val(),
		};

		$.ajax({
			type: 'POST',
			url: 'http://rest.learncode.academy/api/johnbob/friends',
			data: fan,
			success: function(newFan) {
				if(newFan.name && newFan.age){ //is there a name and age?
					if(/\S/.test(newFan.name)){ //if there's at least one non white space character
						addFan(newFan);						
					}	
				}
			},
			error: function(){
				alert('error loading fans');
			}
		});
	});
});

//retrieving data from reddit's JSON(p) API using jquery
//partly taken from https://gist.github.com/sente/947491
function getRedditFeed(){
	$.getJSON( "https://www.reddit.com/r/leagueoflegends.json?limit=100&after=t3_10omtd/",
		function foo(data){
			var output = '<div data-role="collapsible-set" data-filter="true">';
			$.each( data.data.children.slice(0, 100), function (i, post) {
				output+='<div data-role="collapsible" data-collapsed="true">';
				output+='<h4>' + post.data.title + '</h4>';
				output+='<p>' + post.data.title + '</p>';
				output+='<p><a href="' + post.data.url + '">' + post.data.url + '</a></p>';
				output+='</div>';
			}); //go through each post
			output+='</div>';
			$('#reddit-content').html(output).trigger('create');
		} //lists all the posts
	) 	
}	

//partly taken from https://github.com/themattharris/tmhOAuth
function getTwitterFeed(){
	$.getJSON( "http://web.engr.oregonstate.edu/~tungr/mobileWebApp/tweetest/tweets_json.php?limit=100&screen_name=lolesports",
		function foo(data){
			var output = '<ul data-role="listview">';
			$.each(data, function(key, val){
				var text = data[key].text;
				var thumbnail = data[key].user.profile_image_url;
				var name = data[key].user.name;

				text=text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, 
					function(i){
						var url=i.link(i);
						return url;
					}
				); //parse urls

				text=text.replace(/[@]+[A-Za-z0-9-_]+/g, 
					function(i){
						var item = i.replace("@", '');
						var url = i.link("http://twitter.com/"+item);
						return url;
					}
				); //parse usernames

				text=text.replace(/[#]+[A-Za-z0-9-_]+/g, 
					function(i){
						var item = i.replace("#", '%23');
						var url = i.link("https://twitter.com/hashtag/"+ item + "?src=hash");
						return url;
					}
				); //hashtags

				output += '<li>';
				output += '<img src="' + thumbnail + '" alt="' + name + '"/>';
				output += '<p class="wrap">' + text + '</p>';
				output += '</li>';
			});
			output += '</ul>';
			$('#tweetList').html(output).trigger('create');
		} //lists all the posts
	) 	
};