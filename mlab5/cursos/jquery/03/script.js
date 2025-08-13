	$(document).ready(function(e) {
		$("#container").hover(function (){
			$("p").stop().fadeToggle("slow");
		});
	});