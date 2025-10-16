
	$(document).ready(function(e) {
		$("#in").click(function(){
			$("#fade").fadeIn("slow");
		});
		$("#out").click(function(){
			$("#fade").fadeOut("slow");
		});
		$("#to").click(function(){
			$("#fade").fadeToggle("slow");
		});
	});