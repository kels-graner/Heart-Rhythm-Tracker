const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
app.use(cors());

//serve static files
express.static(path.resolve(__dirname, '../public'));

// Get patient data endpoint
app.get('/data', (req, res) => {
  res.sendFile(__dirname + '/data.csv');
});

// Global error handlers
app.use((req, res) => res.status(404).send('Unknown route handler error caught.'));
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


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});