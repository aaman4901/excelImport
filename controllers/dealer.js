const path = require('path');
const Dealer = require('../models/dealer');
const { Op } = require('sequelize');
const fs = require('fs');
const { Worker } = require('node:worker_threads');

exports.uploadExcelFile = async (req, res) => {
  try {
    const files = req.dir;
    if (!files || files.length < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'No file is uploaded' });
    }

    const filePath = path.join(
      __dirname + `/../${files[0].destination}/${files[0].fullName}`
    );

    const dealersData = await new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, './workers/uploadExcelFile.js')
      );
      worker.postMessage(filePath);
      worker.on('message', (data) => {
        resolve(data);
      });
      worker.on('error', (error) => {
        reject(error);
      });
    });

    // add data in db using updateOnDuplicate
    let dealers = await Dealer.bulkCreate(dealersData, {
      updateOnDuplicate: ['name', 'email', 'panNumber', 'city', 'address']
    });

    // removing excel file from server storage
    fs.unlinkSync(filePath);

    return res.status(200).json({ success: true, data: dealers });
  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(500).json({ success: false, error: error.message });
    } else {
      return res.status(500).json({ success: false, error: error });
    }
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

    // Using workers to move this work to separate thread  instead of main thread
    const filePath = await new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, './workers/getExcelFile.js')
      );
      worker.postMessage(dealers);
      worker.on('message', (data) => {
        resolve(data);
      });
      worker.on('error', (error) => {
        reject(error);
      });
    });

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
