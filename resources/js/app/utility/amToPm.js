const amTopm = (timestart)=>{

  var hrs = Number(timestart.match(/^(\d+)/)[1]);
  var mnts = Number(timestart.match(/:(\d+)/)[1]);
  var format = timestart.match(/\s(.*)$/)[1];
  if (format == "PM" && hrs < 12) hrs = hrs + 12;
  if (format == "AM" && hrs == 12) hrs = hrs - 12;
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    var timeend = hours + ":" + minutes + ":00";
    return timeend; //h:i:s
}


export default amTopm