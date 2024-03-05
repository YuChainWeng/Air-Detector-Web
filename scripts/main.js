window.addEventListener('load', getReadings);

var dataPoints = Array.from({length: 60}, (_, i) => {
    var date = new Date();
    date.setSeconds(date.getSeconds() - (60 - i));
    return { x: date, y: 0 };
  });

var dataPoints2 = Array.from({length: 60}, (_, i) => {
    var date = new Date();
    date.setSeconds(date.getSeconds() - (60 - i));
    return { x: date, y: 0 };
  });

var humidity = 0;
var temperature = 0;

window.onload = function () {
    var chart = new CanvasJS.Chart("HumiditychartContainer",
    {
      title:{
      text: "Humidity"
      },
      axisX: {
        interval: 1,
        intervalType: "minute",
        valueFormatString: "hh:mm"
      },
       data: [
      {
        type: "line",
        xValueType: "dateTime",
        dataPoints: dataPoints
      }
      ]
    });
    chart.render();
    setInterval(function () {
        // Get the current date and time
        var currentDate = new Date();
    
        // Add a new data point
        dataPoints.push({ x: currentDate, y: humidity/*put the humidity here*/});
    
        // Remove the oldest data point if there are more than 12 data points
        if (dataPoints.length > 62) {
          dataPoints.shift();
        }
    
        // Update the chart
        chart.render();
      }, 1000); // Update every minute

      var chart2 = new CanvasJS.Chart("TemperaturechartContainer",
      {
        title:{
        text: "Temperature"
        },
        axisX: {
          interval: 1,
          intervalType: "minute",
          valueFormatString: "hh:mm"
        },
         data: [
        {
          type: "line",
          xValueType: "dateTime",
          dataPoints: dataPoints2
        }
        ]
      });
      chart2.render();
      setInterval(function () {
        // Get the current date and time
        var currentDate = new Date();
    
        // Add a new data point
        dataPoints2.push({ x: currentDate, y: temperature/*put the temperature here*/  });
    
        // Remove the oldest data point if there are more than 12 data points
        if (dataPoints2.length > 62) {
          dataPoints2.shift();
        }
    
        // Update the chart
        chart2.render();
    }, 1000); // Update every minute
    }

    // Function to get current readings on the webpage when it loads for the first time
function getReadings(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      console.log(myObj);
      temperature = myObj.temperature;
      humidity = myObj.humidity;
    }
  }; 
  xhr.open("GET", "http://192.168.0.6/readings", true);
  xhr.send();
}

if (!!window.EventSource) {
  var source = new EventSource('/events');
  
  source.addEventListener('open', function(e) {
    console.log("Events Connected");
  }, false);

  source.addEventListener('error', function(e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnected");
    }
  }, false);
  
  source.addEventListener('message', function(e) {
    console.log("message", e.data);
  }, false);
  
  source.addEventListener("new_readings", function(e) {
    console.log("new_readings", e.data);
    var myObj = JSON.parse(e.data);
    console.log(myObj);
    temperature = myObj.temperature;
    humidity= myObj.humidity;
  }, false);
}

function LedControl(){
  $("#LED").buttonset();
  $(".SW").change(function(evt){
    var state = $(this).val();
    $.get("/sw",{led:state});
  });
}