const pagination = async (dbType, option = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const queryDb = {
    ...option,
    offset,
    limit,
  };
  const result = await dbType.findAndCountAll(queryDb);
  const totalPage = Math.ceil(result.count / limit);
  return { totalPage, result };
};

module.exports = pagination;
