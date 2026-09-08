import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { buildContent } from "./content.mjs";
import { optimizeImages } from "./optimize-images.mjs";
buildContent();
await optimizeImages();
const child = spawn(process.execPath,["node_modules/next/dist/bin/next","dev",...process.argv.slice(2)],{stdio:"inherit"});
let timer;
const watcher = watch("content/issues",{recursive:true},()=>{
  clearTimeout(timer);
  timer=setTimeout(()=>{
    void (async()=>{
      try { buildContent(); await optimizeImages(); }
      catch(error) { console.error(error.message); }
    })();
  },150);
});
for(const signal of ["SIGINT","SIGTERM"]) process.on(signal,()=>{watcher.close();child.kill(signal);});
child.on("exit",code=>{watcher.close();process.exit(code || 0);});
