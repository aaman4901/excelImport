const multer = require("multer");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    file.destination = "uploads";
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const name = uuid().replace(/-/g, "");
    const fullName = name + "." + ext;
    if (!req.dir) req.dir = [];
    req.dir.push({
      type: file.mimetype,
      name: name,
      ext: ext,
      fullName: fullName,
      destination: file.destination,
    });
    cb(null, fullName);
  },
});

module.exports = multer({ storage: storage });
