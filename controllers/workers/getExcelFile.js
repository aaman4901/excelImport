const { parentPort } = require('node:worker_threads');
const XLSX = require('xlsx');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

parentPort.on('message', (dealers) => {
  // Creating sheet with data and returning
  dealers = dealers.map((dealer) => {
    return dealer.dataValues;
  });
  const sheetName = 'Dealers';
  const filePath = path.join(__dirname + `/../../uploads/${uuidv4()}.xlsx`);

  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.json_to_sheet(dealers);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);

  parentPort.postMessage(filePath);
});
