import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(( { command, mode } ) => {
  console.log(command)
  console.log(process.cwd())
  const env = loadEnv(mode, process.cwd());
  console.log(env)
  return {
    // previous issue (now fixed)
    // previous nginx conf file (which is what serves the app when running in production) basically couldnt find the index.js and index.css because they had /habit-tracker as the base.
    // so when we loaded the index.html file from the dist folder (which is the file used when running in docker production since we use the npm run build command)
    // it didn't see the index.js and .css files in the assets folder because it was looking in /habit-tracker/assets. we fixed the nginx conf file to account for this.
    // look there for why it works

    base: "/habit-tracker",
    plugins: [react()],
    server: {
      port: 3000,
      host:true,
      watch: {
        usePolling: true
      },
      esbuild: {
        target: "esnext",
        platform: "linux",
      },
    },
    define: {
      // can access this through import.meta.env.VITE_APP_BACKEND_ADDRESS on the frontend
      // can also pass "process.env": process.env to have everything from .env but that is discouraged
      // as long as all env vars are prefixed with VITE_ we don't need to define anything here for client to be exposed to those variables
    }
  }
})
