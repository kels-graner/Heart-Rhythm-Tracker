import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function Heart() {

  const [heartData, setHeartData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  function handleStartTimeChange(event) {
    setStartTime(event.target.value);
  }

  function handleEndTimeChange(event) {
    setEndTime(event.target.value);
  }

  function updateChart() {
    // Use startTime and endTime values to update the chart data
    // filter the heart data and use setDisplayData to update display state
    // update chart with new display data
  }

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(data => data.text())
      .then(csv => {
        console.log('this is the csv...', csv);
        // Parse the CSV data into an array of objects
        const rows = csv.split('\n');
        // const headers = rows[0].split(',');
        const dataArray = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            dt: new Date(values[0]),
            value: values[1] || null,
          };
        });
        setHeartData(dataArray);
      });
  }, []);


  const data = {
    labels: displayData.map(d => d.dt.toLocaleString()),
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

  const options = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'hour',
          },
        },
      ],
    },
  };


  return (
    <div className="Heart">
      <h2>Heart Rhythm:</h2>
      <Line data={data} options={options} />
      
      <div>
        <label htmlFor="start-time">Start Time:</label>
        <input type="datetime-local" id="start-time" name="start-time" onChange={handleStartTimeChange} />

        <label htmlFor="end-time">End Time:</label>
        <input type="datetime-local" id="end-time" name="end-time" onChange={handleEndTimeChange} />

        <button onClick={updateChart}>Update Chart</button>

      </div>
    </div>
  );
}

export default Heart;