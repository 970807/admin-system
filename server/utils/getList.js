const { camelCasetoUnderline } = require('./tools')

/*
  分页查询封装
*/
module.exports = async ({
  req,
  db,
  dbTable,
  queryFieldArr = [],
  searchFieldArr = [],
  likeSearchFieldArr = [],
  orderProp,
  orderSeq,
  onSuccess,
  onError
}) => {
  try {
    orderProp = camelCasetoUnderline(orderProp)
    if (orderSeq !== 'asc' && orderSeq !== 'desc') orderSeq = 'desc'
    if (!orderProp) orderProp = 'id'
    const { pageNo = 1, pageSize = 10 } = req.query
    let condition = ''
    const data = []
    for (const item of searchFieldArr) {
      const fieldValue = req.query[item.reqField]
      if (!fieldValue && fieldValue !== 0) {
        continue
      }
      if (condition.length) {
        condition += `and ${camelCasetoUnderline(item.dbField)} = ? `
      } else {
        condition = `where ${camelCasetoUnderline(item.dbField)} = ? `
      }
      data.push(fieldValue)
    }
    for (const item of likeSearchFieldArr) {
      const fieldValue = req.query[item.reqField]
      if (!fieldValue && fieldValue !== 0) {
        continue
      }
      if (condition.length) {
        condition += `and ${camelCasetoUnderline(item.dbField)} like ? `
      } else {
        condition = `where ${camelCasetoUnderline(item.dbField)} like ? `
      }
      data.push(`%${fieldValue}%`)
    }
    data.push(parseInt((pageNo - 1) * pageSize))
    data.push(parseInt(pageSize))

    let queryFieldStr
    if (queryFieldArr.length < 1) {
      queryFieldStr = '*'
    } else {
      queryFieldStr = queryFieldArr.join(',')
    }
    const [list, [{ total: totalCount }]] = await Promise.all([
      db.query(
        `select ${queryFieldStr} from ${dbTable} ${condition} order by ${orderProp} ${orderSeq} limit ?,?`,
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
