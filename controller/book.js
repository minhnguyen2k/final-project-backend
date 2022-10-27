const db = require('../models');

const bookController = {
  getHomePage: async (req, res) => {
    let page = 1;
    const numberItemPerPage = 10;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const offset = (page - 1) * numberItemPerPage;

    try {
    } catch (error) {}
    const result = await db.Book.findAndCountAll({
      order: [['createdAt', 'ASC']],
      offset,
      limit: numberItemPerPage,
    });

    res.json(result);
  },
};
module.exports = bookController;
