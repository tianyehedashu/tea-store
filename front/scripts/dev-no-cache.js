#!/usr/bin/env node

/**
 * 开发环境无缓存启动脚本
 */

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 启动开发服务器（无缓存模式）...\n')

// 设置环境变量
const env = {
  ...process.env,
  NODE_ENV: 'development',
  DISABLE_CACHE: 'true',
  REVALIDATE_SECRET: 'development-secret'
}

// 启动 Next.js 开发服务器
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env,
  cwd: process.cwd()
})

child.on('error', (error) => {
  console.error('❌ 启动失败:', error)
  process.exit(1)
})

child.on('exit', (code) => {
  console.log(`\n👋 开发服务器已停止 (退出码: ${code})`)
  process.exit(code)
})

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n⏹️ 正在停止开发服务器...')
  child.kill('SIGINT')
})

process.on('SIGTERM', () => {
  child.kill('SIGTERM')
})
