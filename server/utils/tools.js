/*
  下划线转驼峰
*/
function underlinetoCamelCase(target) {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  if (target instanceof Date) {
    return target
  }
  if (Array.isArray(target)) {
    target.forEach((item, index) => {
      target[index] = underlinetoCamelCase(item)
    })
    return target
  }
  const obj = {}
  for (const key of Object.keys(target)) {
    const arr = key.split('_')
    for (let i = 1; i < arr.length; i++) {
      arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1)
    }
    obj[arr.join('')] = target[key]
  }
  return obj
}

/*
  驼峰转下划线
*/
function camelCasetoUnderline(target) {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  if (target instanceof Date) {
    return target
  }
  if (Array.isArray(target)) {
    target.forEach((item, index) => {
      target[index] = camelCasetoUnderline(item)
    })
    return target
  }
  const obj = {}
  for (const key of Object.keys(target)) {
    const newKey = key.replace(/[A-Z]+/g, (v) => '_' + v.toLowerCase(v))
    obj[newKey] = target[key]
  }
  return obj
}

module.exports = {
  underlinetoCamelCase,
  camelCasetoUnderline
}
