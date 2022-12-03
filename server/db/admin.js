const mysql = require('mysql')
const path = require('path')
const queryFn = require('./queryFn')
const { adminDbConfig } = require(path.resolve('./config/mysql.config.js'))

const pool = mysql.createPool(adminDbConfig)

exports.query = queryFn(pool)
