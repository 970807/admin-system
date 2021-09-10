const mysql = require('mysql')
const path = require('path')
const queryFn = require('./queryFn')
const { meishijieDbConfig } = require(path.resolve('./config/mysql.config.js'))

const pool = mysql.createPool(meishijieDbConfig)

exports.query = queryFn(pool)
