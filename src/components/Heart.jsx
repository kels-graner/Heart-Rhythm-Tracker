import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function Heart() {

  //all the data that is fetched once, and saved here in state
  const [heartData, setHeartData] = useState([]);

  //filtered data that will be displayed in the chart when nurse changes parameters
  const [displayData, setDisplayData] = useState([]);

  //sets the new start and end times when nurses makes changes
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  function handleStartTimeChange(event) {
    setStartTime(event.target.value);
  }

  function handleEndTimeChange(event) {
    setEndTime(event.target.value);
  }

  function updateData() {
    // Filter the heartData array to include only data within the specified time range
    const filteredData = heartData.filter(({dt}) => {
      return dt >= startTime && dt <= endTime;
    });
    setDisplayData(filteredData);
  }

  //on mount all the data is fetched from the csv file and stored in heartData
  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(data => data.text())
      .then(csv => {
        // Parse the CSV data into an array of objects
        const rows = csv.split('\n');
        const dataArray = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            dt: values[0],
            value: values[1] || null,
          };
        });
        setHeartData(dataArray);
      });
  }, []);


  const data = {
    labels: displayData.map(d => new Date(d.dt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: 'Heart Rate',
        data: displayData.map(d => d.value),
        fill: false,
        borderColor: 'black',
        tension: 0.1,
      },
    ],
  };

  // const options = {
  //   scales: {
  //     xAxes: [
  //       {
  //         type: 'time',
  //         time: {
  //           unit: 'hour',
  //         },
  //       },
  //     ],
  //   },
  // };

  const options = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'minute',
            distribution: 'linear',
          },
          ticks: {
            max: startTime, 
            min: endTime, 
            autoSkip: true,
          },
          
        },
      ],
    },
  };


  // var config = {
  //   type: 'bar',
  //   data: {
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [{
  //       label: 'My Dataset',
  //       data: [10, 20, 30, 40, 50, 60, 70]
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       x: {
  //         barPercentage: 0.8,
  //         categoryPercentage: 0.8
  //       }
  //     }
  //   }
  // };
  



  return (
    <div className="Heart">
      <h3>Heart Rhythm:</h3>
      <Line data={data} options={options} />

      <div>
        <label htmlFor="start-time">Start Time:</label>
        <input type="datetime-local" id="start-time" name="start-time" onChange={handleStartTimeChange} />

        <label htmlFor="end-time">End Time:</label>
        <input type="datetime-local" id="end-time" name="end-time" onChange={handleEndTimeChange} />

        <button onClick={updateData}>Update Chart</button>

      </div>
    </div>
  );
}

export default Heart;