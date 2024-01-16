var dataPoints = Array.from({length: 10}, (_, i) => {
    var date = new Date();
    date.setMinutes(date.getMinutes() - (10 - i));
    return { x: date, y: Math.random() * 1000 };
  });
window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
      text: "Co2"
      },
      axisX: {
        interval: 1,
        intervalType: "minute",
        valueFormatString: "HH:mm"
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
        dataPoints.push({ x: currentDate, y: Math.random() * 1000 });
    
        // Remove the oldest data point if there are more than 12 data points
        if (dataPoints.length > 12) {
          dataPoints.shift();
        }
    
        // Update the chart
        chart.render();
      }, 60000); // Update every minute
    }
  