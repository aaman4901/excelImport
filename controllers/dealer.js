const XLSX = require('xlsx');
const path = require('path');
const Dealer = require('../models/dealer');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const fs = require('fs');

exports.uploadExcelFile = async (req, res) => {
  try {
    const files = req.dir;
    if (!files || files.length < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'No file is uploaded' });
    }

    // Reading excel file and coverting to JSON
    const filePath = path.join(
      __dirname + `/../${files[0].destination}/${files[0].fullName}`
    );
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
      return res.status(400).json({ success: false, error: errors });
    }

    // add data in db using updateOnDuplicate
    let dealers = await Dealer.bulkCreate(dealersData, {
      updateOnDuplicate: ['name', 'email', 'panNumber', 'city', 'address']
    });

    // removing excel file from server storage
    fs.unlinkSync(filePath);

    return res.status(200).json({ success: true, data: dealers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getExcelFile = async (req, res) => {
  try {
    let queryParams = req.query;

    let dealerOpts = {
      where: {},
      attributes: ['name', 'phone', 'email', 'panNumber', 'city', 'address']
    };
    if (queryParams.name) {
      dealerOpts.where.name = { [Op.like]: `${queryParams.name}%` };
    }
    // Finding all data from db
    let dealers = await Dealer.findAll(dealerOpts);

    // Creating sheet with data and returning
    dealers = dealers.map((dealer) => {
      return dealer.dataValues;
    });
    const sheetName = 'Dealers';
    const filePath = path.join(__dirname + `/../uploads/${uuidv4()}.xlsx`);

    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(dealers);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);

    return res.sendFile(filePath, (error) => {
      if (error) {
        throw error;
      } else {
        // removing excel file from server storage
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

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
