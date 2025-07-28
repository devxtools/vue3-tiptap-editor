// scripts/watch-build.ts
import chokidar from 'chokidar'
import { exec } from 'child_process'

const watcher = chokidar.watch('src', {
    ignoreInitial: true,
    ignored: ['**/__tests__/**', '**/*.test.ts']
})

let isBuilding = false

watcher.on('all', (event, path) => {
    if (isBuilding) return
    isBuilding = true

    console.log(`[watch-build] Change detected (${event}: ${path}), rebuilding...`)
    exec('vite build', (err, stdout, stderr) => {
        if (err) {
            console.error(`[watch-build] Build error:\n${stderr}`)
        } else {
            console.log(`[watch-build] Build completed.`)
        }
        isBuilding = false
    })
})
