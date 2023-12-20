const express = require('express');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(fileUpload());
app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// app.post('/upload', (req, res) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   let excelFile = req.files.excelFile;
//   let uploadPath = __dirname + '/uploads/' + excelFile.name;

//   excelFile.mv(uploadPath, function (err) {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     const data = readExcel(uploadPath);
//     // Optionally, add unpivot and highlight logic here

//     // Send the data back to the client
//     res.json(data);

//     // const data = readExcel(uploadPath);
//     // const unpivotedData = unpivot(data); // Implement this function
//     // // Implement highlightValues function
//     // const highlightedData = highlightValues(unpivotedData, [
//     //   'value1',
//     //   'value2',
//     // ]); // Replace with actual values to highlight

//     // // Save the processed data to a file or in-memory for later retrieval
//     // fs.writeFileSync('processedData.json', JSON.stringify(highlightedData));

//     // res.send(
//     //   'File uploaded and processed. <a href="/data">View processed data</a>'
//     // );
//   });
// });

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let excelFile = req.files.excelFile;
  let uploadPath = __dirname + '/uploads/' + excelFile.name;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  excelFile.mv(uploadPath, function (err) {
    if (err) {
      console.error('File Upload Error: ', err);
      return res.status(500).send('Error occurred: ' + err.message);
    }

    try {
      const data = readExcel(uploadPath);
      // Process your data here...

      res.json(data); // Or send back confirmation message
    } catch (processingError) {
      console.error('Data Processing Error: ', processingError);
      res.status(500).send('Error processing file: ' + processingError.message);
    }
  });
});

app.get('/data', (req, res) => {
  res.sendFile(path.join(__dirname, '/processedData.json'));
});

function readExcel(file) {
  const workbook = xlsx.readFile(file);
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

function unpivot(data) {
  // Unpivot logic here
}

function highlightValues(data, valuesToHighlight) {
  // Highlight logic here
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
