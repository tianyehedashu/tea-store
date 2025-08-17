#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('清理 Next.js 缓存...')

// 清理 .next/cache 目录
const cacheDir = path.join(__dirname, '../.next/cache')
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true })
  console.log('✅ 已清理 .next/cache')
} else {
  console.log('ℹ️ .next/cache 目录不存在')
}

// 清理 .next/server 目录
const serverDir = path.join(__dirname, '../.next/server')
if (fs.existsSync(serverDir)) {
  fs.rmSync(serverDir, { recursive: true, force: true })
  console.log('✅ 已清理 .next/server')
} else {
  console.log('ℹ️ .next/server 目录不存在')
}

console.log('\n🎉 缓存清理完成！请重启开发服务器。')
