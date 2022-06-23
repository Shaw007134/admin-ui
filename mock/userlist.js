const Mock = require('mockjs')

const data = Mock.mock({
  'items|3': [
    {
      id: '@id',
      content: '',
      group: 'All Telegram Groups',
      'status|1': ['Waiting', 'Added', 'Deleted'],
      'type|1': ['Scheduled'],
      creator: '@email',
      send_time: '@datetime',
      creat_time: '@datetime'
    }
  ]
})

exports.default = [
  {
    url: '/user/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  // 查询列表详细
  {
    url: '/user/item.*',
    type: 'get',
    response: config => {
      const { id } = config.query
      const items = data.items
      for (let i = 0; i < items.length; i++) {
        if (id == items[i].id) {
          return {
            code: 200,
            data: items[i]
          }
        }
      }
      return {
        code: 500,
        message: 'not found'
      }
    }
  },
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      const item = config.body
      item.id = Mock.Random.id()
      const items = data.items
      data.items.push(item)
      return {
        code: 200,
        message: 'success'
      }
    }
  },
  {
    url: '/user/list',
    type: 'put',
    response: config => {
      const item = config.body
      const items = data.items
      for (let i = 0; i < items.length; i++) {
        if (item.id == items[i].id) {
          Object.keys(items[i]).forEach(key => {
            if (item[key]) {
              items[i][key] = item[key]
            }
          })
          return {
            code: 200,
            message: 'success',
            data: items[i]
          }
        }
      }
      return {
        code: 500,
        message: 'not found'
      }
    }
  },
  {
    url: '/user/list',
    type: 'delete',
    response: config => {
      const { id } = config.query
      const items = data.items
      for (let i = 0; i < items.length; i++) {
        if (id == items[i].id) {
          items.splice(i, 1);
          return {
            code: 200,
            message: 'success'
          }
        }
      }
      return {
        code: 500,
        message: 'not found'
      }
    }
  }
]
