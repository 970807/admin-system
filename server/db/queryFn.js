/*
  操作数据库api
 */
const { underlinetoCamelCase, camelCasetoUnderline } = require('../utils/tools')

module.exports = pool => {
  return (sql, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err)
        }
        if (!connection) {
          return reject(
            new Error('mysql连接池，创建连接失败！-- connection为undefined')
          )
        }
        // 操作数据库
        data = camelCasetoUnderline(data) // 驼峰转下划线
        connection.query(sql, data, (err, results) => {
          connection.release()
          if (err) {
            return reject(err)
          }
          results = underlinetoCamelCase(results) // 下划线转驼峰
          resolve(results)
        })
      })
    })
  }
}
