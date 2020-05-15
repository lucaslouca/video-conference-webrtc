'use strict';

var meeting;
var host = HOST_ADDRESS; // HOST_ADDRESS gets injected into room.ejs from the server side when it is rendered

$(document).ready(function () {
	/////////////////////////////////
	// CREATE MEETING
	/////////////////////////////////
	meeting = new Meeting(host);

	meeting.onLocalVideo(function (stream) {
		document.querySelector('#localVideo').srcObject = stream;

		$("#micMenu").on("click", function callback(e) {
			toggleMic();
		});

		$("#videoMenu").on("click", function callback(e) {
			toggleVideo();
		});

		$("#localVideo").prop('muted', true);
	}
	);

	meeting.onRemoteVideo(function (stream, participantID) {
		addRemoteVideo(stream, participantID);
	}
	);

	meeting.onParticipantHangup(function (participantID) {
		// Someone just left the meeting. Remove the participants video
		removeRemoteVideo(participantID);
	}
	);

	meeting.onChatReady(function () {
		console.log("Chat is ready");
	}
	);

	var room = window.location.pathname.match(/([^\/]*)\/*$/)[1];
	meeting.joinRoom(room);

}); // end of document.ready

function addRemoteVideo(stream, participantID) {
	var $videoBox = $("<div class='videoWrap' id='" + participantID + "'></div>");

	const video = document.createElement('video');
	video.setAttribute("class", "videoBox");
	video.autoplay = true;
	video.srcObject = stream;

	$videoBox.append(video);
	$("#videosWrapper").append($videoBox);
	adjustVideoSize();

}

function removeRemoteVideo(participantID) {
	$("#" + participantID).remove();
	adjustVideoSize();
}

function adjustVideoSize() {
	var numOfVideos = $(".videoWrap").length;
	if (numOfVideos > 2) {
		var $container = $("#videosWrapper");
		var newWidth;
		for (var i = 1; i <= numOfVideos; i++) {
			newWidth = $container.width() / i;

			// check if we can start a new row
			var scale = newWidth / $(".videoWrap").width();
			var newHeight = $(".videoWrap").height() * scale;
			var columns = Math.ceil($container.width() / newWidth);
			var rows = numOfVideos / columns;

			if ((newHeight * rows) <= $container.height()) {
				break;
			}
		}

		var percent = (newWidth / $container.width()) * 100;
		$(".videoWrap").css("width", percent - 5 + "%");
		$(".videoWrap").css("height", "auto");


		//var numOfColumns = Math.ceil(Math.sqrt(numOfVideos));
		var numOfColumns;
		for (var i = 2; i <= numOfVideos; i++) {
			if (numOfVideos % i === 0) {
				numOfColumns = i;
				break;
			}
		}
		$('#videosWrapper').find("br").remove();
		$('.videoWrap:nth-child(' + numOfColumns + 'n)').after("<br>");
	} else if (numOfVideos == 2) {
		$(".videoWrap").width('auto');
		$("#localVideoWrap").css("width", 20 + "%");
		$('#videosWrapper').find("br").remove();
	} else {
		$("#localVideoWrap").width('auto');
		$('#videosWrapper').find("br").remove();
	}
}