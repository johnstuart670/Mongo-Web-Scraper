$(document).ready(function (){
	$("#articleScraper").on("click", function(event){
		event.preventDefault();
		$.ajax({
			url: "/scrape_articles",
		}).then(function (results){
			location.reload();
		})
	})
	// end of the page function
})

