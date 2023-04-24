const Router = require('express').Router();
const multer = require('../services/multer');

const dealerController = require('../controllers/dealer');

Router.post(
  '/upload-excel-file',
  multer.single('file'),
  dealerController.uploadExcelFile
);

Router.get('/get-excel-file', dealerController.getExcelFile);

module.exports = Router;
