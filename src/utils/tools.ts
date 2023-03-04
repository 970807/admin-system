/**
 * 防抖
 * @description 思路：先开启一个定时任务执行，定时任务完成后则清空；当再调用时，如果定时任务仍存在则清空原来任务，创建新的定时任务
 */
export function debounce(fn: Function, space: number) {
  let task = null
  return function (...args) {
    if (task) {
      clearTimeout(task)
    }
    task = setTimeout(fn.bind(this, ...args), space)
  }
}

/**
 * 节流
 * @description 思路：先开启一个定时任务执行，定时任务完成后则清空，当再调用时，如果定时任务仍存在则不执行任何操作
 */
export function throttle(fn: Function, space: number) {
  let task = null
  return function (...args) {
    if (task) return
    task = setTimeout(function () {
      task = null
      fn.apply(this, args)
    }, space)
  }
}
