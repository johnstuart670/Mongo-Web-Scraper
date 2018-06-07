$(document).ready(function () {
	$("#articleScraper").on("click", function (event) {
		event.preventDefault();
		$.ajax({
			method: "GET",
			url: "/scrape_articles",
		}).then(function (results) {
			location.reload();
		})
	});
	// on click of the save elements we will do stuff
	$("body").on("click", ".SAVE", function (event) {
		event.preventDefault();
		var buttonID = $(this).attr("data-id");
		var queryURL = "/save_article/" + buttonID
		$.ajax({
			url: queryURL,
			method: "PUT"
		}).then(
			$(this).text("Article was saved!")
			)
	});

	$("body").on("click", ".unSAVE", function (event) {
		event.preventDefault();
		var buttonID = $(this).attr("data-id");
		var queryURL = "/unsave_article/" + buttonID
		$.ajax({
			url: queryURL,
			method: "PUT"
		}).then(
			$(this).text("Article was unsaved!")
			)
	});

	$("body").on("click", ".COMMENTS", function (event) {
		event.preventDefault();
		let articleID = $(this).attr("data-id");
		updateNotesModal(articleID);
		// Manipulate the notes modal elements
	});


	// SAVE NOTE modal button clicked
	$("body").on("click", "#savenote", function () {
		let articleId = $(this).attr("data-id");
		let newnote = $("#bodyinput").val();
		$.ajax({
			method: "POST",
			url: "/comments/" + articleId,
			data: { body: newnote }
		})
			.then(function (data) {
				updateNotesModal(articleId);
			});
	})



	$("body").on("click", ".deleteNote", function () {
		let noteId = $(this).attr("data-id");
		let articleId = $(this).attr("data-article-id");
		console.log(noteId, articleId)
		$.ajax({
			method: "POST",
			url: "/commentDelete/" + noteId
		})
			.then(function () {
				updateNotesModal(articleId);
			});
	});

	// end of the page function
});

function updateNotesModal(articleId) {
	$.ajax({
		method: "GET",
		url: "/comments/" + articleId
	}).then(function (data) {
		console.log("data", data)
		if(data){
			console.log("there was data", data)
		$("#notesModal").modal();
		$("#notesModalLabel").text("Notes for Article: " + data._id);
		$("#savenote").attr("data-id", data._id);
		$("#displaynotes").empty();
		if (data.notes) {
			// Loop through all of the notes and append them to the #displaynotes div
			for (let i = 0; i < data.notes.length; i++) {
				// Build our two DIVs (card and cardbody)
				let card = $("<div>").addClass("card bg-light mb-2");
				let cardBody = $("<div>").addClass("card-body").text(data.notes[i].body);
				// Build our delete button
				let delButton = $("<button>").addClass("btn btn-danger btn-sm py-0 float-right");
				delButton.attr("data-id", data.notes[i]._id);
				delButton.attr("data-article-id", data._id);
				delButton.attr("id", "deleteNote")
				delButton.text("X");
				// Put it all together and append to the DOM
				cardBody.append(delButton);
				card.append(cardBody);
				$("#displaynotes").append(card);
			}
		} else {
			$("#displaynotes").text("No notes for this article yet!");
		}
		$('#viewnotes[data-id="' + data._id + '"]')
		// .text("NOTES (" + data.notes.length + ")");
	}else {
		;
	}
		$("#bodyinput").val("");
	 }  
)
};