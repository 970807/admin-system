/*
  分页查询封装
*/
module.exports = async ({
  req,
  db,
  dbTable,
  likeSearchFieldArr = [],
  onSuccess,
  onError
}) => {
  try {
    const { pageNo = 1, pageSize = 10 } = req.query
    let condition = ''
    const data = []
    for (const item of likeSearchFieldArr) {
      const fieldValue = req.query[item.reqField]
      if (!fieldValue && fieldValue !== 0) {
        continue
      }
      if (condition.length) {
        condition += `and ${item.dbField} like ? `
      } else {
        condition = `where ${item.dbField} like ? `
      }
      data.push(`%${fieldValue}%`)
    }
    data.push(parseInt((pageNo - 1) * pageSize))
    data.push(parseInt(pageSize))

    const [list, [{ total: totalCount }]] = await Promise.all([
      db.query(
        `select * from ${dbTable} ${condition}order by id desc limit ?,?`,
        data
      ),
      db.query(
        `select count(*) as total from ${dbTable} ${condition}`,
        data.slice(0, -2)
      )
    ])

    onSuccess?.({ list, totalCount })
  } catch (err) {
    onError?.(err)
  }
}
