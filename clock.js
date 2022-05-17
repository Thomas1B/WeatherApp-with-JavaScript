/*
Written by Thomas Bourgeois

JavaScript program to create a clock in the format yyyy/mm/dd HH:MM:SS am/pm

In this program afternoon is defined as anytime between 12:00pm to 12:00am
morning is defined as anytime between 12:00am to 12:00pm


*/

// Setting repeat interval
setInterval(function() {
  showTime();
}, 1000);


// Function to get grab current date and seperate
function showTime() {
  let time = new Date(); // getting today's date
  let month = time.getMonth() + 1

  // stripping date object
  let date = time.getFullYear() + "-" + month + "-" + time.getDate(); // making yyyy/mm/dd format.
  let hours = time.getHours(); // get hours.
  let mins = time.getMinutes(); // get minutes.
  let secs = time.getSeconds(); // get seconds.
  let pod = ""; // empty string to store part of day (pod) am or pm.

  // conditions for handling 24hr time into 12hr
  if (hours <= 12) {
    // if it's morning
    if (hours == 0) { // Data() counts 12am as 0 hours.
      hours = "12";
    }
    pod = "am"
  } else { // otherwise it's afternoon
    pod = "pm";
    if (hours > 12) {
      hours %= 12;
    }
  }

  // conditions for minutes and seconds to always display 2 digits
  if (mins < 10) {
    mins = "0" + mins;
  }
  if (secs < 10) {
    secs = "0" + secs;
  }


	// Making finally clock time in format HH/MM/SS am/pm
  let clock = hours + ":" + mins + ":" + secs + " " + pod;


	// "Sending" finally date and time in format yyyy/mm/dd HH/MM/SS am/pm
  $("#curtime").html(date + ", " + clock).show();
}
