/*
  操作数据库api
 */
module.exports = (pool) => {
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
        connection.query(sql, data, (err, results) => {
          connection.release()
          if (err) {
            return reject(err)
          }
          resolve(results)
        })
      })
    })
  }
}
