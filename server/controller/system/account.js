const adminDb = require('../../db/admin')
const getList = require('../../utils/getList')

exports.getList = (req, res, next) => {
  getList({
    req,
    db: adminDb,
    dbTable: 'user_list',
    likeSearchFieldArr: [{ reqField: 'username', dbField: 'username' }],
    onSuccess: function (data) {
      if (data.list) data.list.forEach(item => delete item.password)
      res.json({ code: 0, data })
    },
    onError: function (err) {
      next(err)
    }
  })
}
