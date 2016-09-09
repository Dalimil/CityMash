console.log("Welcome to your web application's JavaScript!");

function saveFav(A) {
	var myName;
	if(A == undefined){
		A = "";
		myName = current.name;
	} else {
		if(A == 'A')
			myName = currentA.name;
		else 
			myName = currentB.name;
	}


	var fbtn = $('#fav-btn'+A);
	var add = true;
	if(fbtn.hasClass('fa-heart-o')){
		fbtn.removeClass('fa-heart-o').addClass('fa-heart');
	} else {
		add = false;
		fbtn.removeClass('fa-heart').addClass('fa-heart-o');
	}

	$.post("/fav", { add: add, name: myName });
}

function refresh(both) {
	if(both == 'both') {
		$.get("/refresh?m=" + currentA.id, function(data) {
			fillView(data, 'A');
		});
		$.get("/refresh?m=" + currentB.id, function(data) {
			fillView(data, 'B');
		});
	} else {
		$.get("/refresh?m=" + current.id, function(data) {
			fillView(data);
		});
	}
}

function fadeAndSlide(A) {
	if(A == undefined) A = "";

	$("#gallery" + A).fadeOut("fast").fadeIn("fast");
}

function slideAndSlide() {
	$("#gallery").animate({
		left: '-100vw'
	}, "fast").animate({
		left: '100vw'
	}, 0).animate({
		left: '0'
	}, "fast");
}

function onNext(A) {
	
	if(A != undefined) {
		fadeAndSlide(A);
		loadCity(A);
	} else {
		slideAndSlide();
		loadCity();
	}
}

function fillView(data, A) {
	if(A == undefined){
		A = "";
		current = data;
	} else {
		if(A == 'A')
			currentA = data;
		else 
			currentB = data;
	}

	console.log(data);
	if(A == ""){
		$("#loc-name").text(data.name);
	}
	data.img.forEach(function(url, ind) {
		$("#img-thumb-"+A+ ind).css("background-image", "url('" + (url.small) + "'");
		$("#img-full-" +A+ ind).attr("href", (url.big));
	});

	if(data.favedBefore) {
		$('#fav-btn'+A).removeClass('fa-heart-o').addClass('fa-heart');
	} else {
		$('#fav-btn'+A).removeClass('fa-heart').addClass('fa-heart-o');
	}

	$('.poptrox-overlay').remove();
	var gallery = $('#gallery'+A);
	gallery.poptrox( { windowMargin: 5 });
}

function loadCity(A) {
	$.get("/city", function(data) {

		fillView(data, A);
	});
	
}