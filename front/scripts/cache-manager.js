#!/usr/bin/env node

const readline = require('readline')

const CACHE_SECRET = process.env.REVALIDATE_SECRET || 'development-secret'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const actions = {
  '1': { action: 'clear-all', description: '清理所有缓存' },
  '2': { action: 'clear-products', description: '清理商品相关缓存' },
  '3': { action: 'clear-tag', description: '按标签清理缓存' },
  '4': { action: 'clear-path', description: '按路径清理缓存' },
  '5': { action: 'show-config', description: '显示缓存配置' }
}

async function makeRequest(body) {
  try {
    const response = await fetch(`${BASE_URL}/api/cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cache-token': CACHE_SECRET
      },
      body: JSON.stringify(body)
    })
    
    const result = await response.json()
    console.log(`\n${result.ok ? '✅' : '❌'} ${result.message}`)
    
    if (!result.ok) {
      console.error('错误详情:', result)
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }
}

async function showConfig() {
  try {
    const response = await fetch(`${BASE_URL}/api/cache?secret=${CACHE_SECRET}`)
    const result = await response.json()
    
    if (result.ok) {
      console.log('\n📋 缓存配置:')
      console.log(JSON.stringify(result.cacheConfig, null, 2))
      console.log('\n🏷️ 可用标签:', result.availableTags.join(', '))
    }
  } catch (error) {
    console.error('❌ 获取配置失败:', error.message)
  }
}

function showMenu() {
  console.log('\n🗂️  缓存管理工具')
  console.log('================')
  Object.entries(actions).forEach(([key, { description }]) => {
    console.log(`${key}. ${description}`)
  })
  console.log('0. 退出')
  console.log()
}

function promptAction() {
  rl.question('请选择操作 (0-5): ', async (choice) => {
    if (choice === '0') {
      console.log('👋 再见!')
      rl.close()
      return
    }
    
    const action = actions[choice]
    if (!action) {
      console.log('❌ 无效选择')
      promptAction()
      return
    }
    
    switch (action.action) {
      case 'clear-all':
      case 'clear-products':
        await makeRequest({ action: action.action })
        break
        
      case 'clear-tag':
        rl.question('请输入标签 (PRODUCTS/CATEGORIES/COLLECTIONS/REGIONS/CUSTOMER/CART): ', async (tag) => {
          await makeRequest({ action: 'clear-tag', tag })
          promptAction()
        })
        return
        
      case 'clear-path':
        rl.question('请输入路径 (如 /categories/green-tea): ', async (path) => {
          await makeRequest({ action: 'clear-path', path })
          promptAction()
        })
        return
        
      case 'show-config':
        await showConfig()
        break
    }
    
    promptAction()
  })
}

// 启动菜单
showMenu()
promptAction()
