const { parentPort } = require('node:worker_threads');
const XLSX = require('xlsx');

parentPort.on('message', (filePath) => {
  // Reading excel file and coverting to JSON
  let workbook = XLSX.readFile(filePath);
  let sheet_name_list = workbook.SheetNames;
  let dealersData = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]]
  );

  // Validating data
  let errors = [];
  let isError = false;
  dealersData = dealersData.filter((dealer, i) => {
    isError = false;
    if (!dealer.phone || !isValidPhone(dealer.phone)) {
      errors.push(`row ${i + 1} have invalid phone`);
      isError = true;
    }
    if (!dealer.email || !isValidEmail(dealer.email)) {
      errors.push(`row ${i + 1} have invalid email address`);
      isError = true;
    }
    if (!dealer.panNumber || !isValidPAN(dealer.panNumber)) {
      errors.push(`row ${i + 1} have invalid pan number`);
      isError = true;
    }
    if (isError) {
      return false;
    }
    return true;
  });

  if (errors.length) {
    throw errors;
  }
  parentPort.postMessage(dealersData);
});

function isValidPhone(phone) {
  if (!phone || phone.toString().length != 10) {
    return false;
  }
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function isValidPAN(pan) {
  const pattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return pattern.test(pan);
}
