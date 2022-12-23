const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const signCloud = async (req, res) => {
  let public_id;
  let folder;
  if (req.query && req.query.public_id && req.query.folder) {
    public_id = req.query.public_id;
    folder = req.query.folder;
  }
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = { timestamp, public_id, folder };
  const signature = await cloudinary.utils.api_sign_request(params, process.env.API_SECRET);
  res.status(200).json({ timestamp, signature });
};

module.exports = signCloud;
