const express = require('express');
const path = require('path');
const csvtojson = require('csvtojson');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
app.use(cors());
//are these 3 necessary?

//serve static files
express.static(path.resolve(__dirname, '../public'));

// Get patient data endpoint
app.get('/data', (req, res) => {
  console.log('in app.get /data')
  res.sendFile(__dirname + '/data.csv');
});

// OPTION 2
// app.get('/data', async (req, res) => {
//   try {
//     console.log('inside server.js')
//     const data = await csvtojson().fromFile('/data.csv');
//     res.locals.data = data;
//     res.json(data);
//   } catch(err) {
//     console.log(err);
//     res.status(500).send('Server Error')
//   }
// });

// OPTION 3
// app.get('/data', (req, res) => {
//   console.log('inside server.js')
//   // Read the contents of the file
//   const csv = fs.readFileSync('data.csv', 'utf8');

//   // Send the CSV data as a response
//   res.set('Content-Type', 'text/csv');
//   res.send(csv);
// });




//Global endpoints
// app.get('/*', (req, res) => {
//   res.status(200).sendFile(path.resolve(__dirname, '../build/index.html'));
// })

// app.use('/*', (req, res) => {
//   console.log(`Unrecognized route requested: ${req.method} request to ${req.originalUrl}`);
//   res.status(404).send('404: Not Found');
// })

// Global error handler
// app.use((req, res) => res.status(404).send('Unknown route handler error caught.'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// app.use(cors({
//   origin: 'http://localhost:3000'
// }));

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});