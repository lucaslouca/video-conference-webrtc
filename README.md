# video-conference-webrtc
Complete client/server application demonstrating how to setup a video conference with multiple peers using WebRTC.

<a href="http://www.foobubble.com" target="_blank">Demo</a>

<img src="https://cloud.githubusercontent.com/assets/10542894/7550897/538ec66a-f674-11e4-9f52-b0f5a5b9911d.png" width="450"/>

## How to use

Include the neccesary stylesheet and javascript files:
```
<link rel="stylesheet" type="text/css" href="jsdatepicker.css" media="screen" />
<script src='jsdatepicker.js'></script>
```

Include a simple div to hold your datepicker:
```
<div id="my-date-picker" class="js-date-picker"></div>
```

Initialise the date picker (e.g. with the current date):
```
<script>
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();
	
    var datePicker = new JSDatePicker('my-date-picker',month,year);
    datePicker.onPickedDate(function(day,month,year) {
			console.log('Picked day '+day+'/'+month+'/'+year);
    });	
</script>
```

## Public methods

> `onPickedDate(handler)`

>**handler**

>Type: Function(element, day, month, year)

>A function to execute when a date is picked. The `element` is the day element clicked. `day`, `month` and `year` is the selected date. 

<br>

> `getSelectedDate()`

>Returns an array (`[day, month, year]`) representation of the current selected date. If no date is selected array value is `[-1, -1, -1]`.
