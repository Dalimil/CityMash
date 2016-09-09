console.log("Welcome to your web application's JavaScript!");

function saveFav() {
	var fbtn = $('#fav-btn');
	var add = true;
	if(fbtn.hasClass('fa-heart-o')){
		fbtn.removeClass('fa-heart-o').addClass('fa-heart');
	} else {
		add = false;
		fbtn.removeClass('fa-heart').addClass('fa-heart-o');
	}
	$.post("/fav", { add: add, name: current.name });
}

function refresh() {
	$.get("/refresh", function(data) {
		fillView(data);
	});
}

function fadeAndSlide() {
	$("#gallery").fadeOut("fast").animate({
		left: '100vw'
	}, 0).fadeIn(0).animate({
		left: '0'
	}, "fast");
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

function onNext() {
	slideAndSlide();
	loadCity();
}

function fillView(data, A) {
	if(A == undefined) A = "";
	
	current = data;
	console.log(data);
	$("#loc-name").text(data.name);
	data.img.forEach(function(url, ind) {
		$("#img-thumb-"+ ind).css("background-image", "url('" + (url.small) + "'");
		$("#img-full-" + ind).attr("href", (url.big));
	});

	if(data.favedBefore) {
		$('#fav-btn').removeClass('fa-heart-o').addClass('fa-heart');
	} else {
		$('#fav-btn').removeClass('fa-heart').addClass('fa-heart-o');
	}

	$('.poptrox-overlay').remove();
	var gallery = $('#gallery');
	gallery.poptrox();
}

function loadCity(A) {
	$.get("/city", function(data) {

		fillView(data, A);
	});
	
}