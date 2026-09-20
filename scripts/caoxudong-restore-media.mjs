import {readFile, writeFile, mkdir, rename} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
const assets=JSON.parse(await readFile(new URL('./caoxudong-media.json',import.meta.url),'utf8'));
for(const asset of assets){
 const buffers=await Promise.all(asset.parts.map(part=>readFile(part)));
 const video=Buffer.concat(buffers);
 const actual=createHash('sha256').update(video).digest('hex');
 if(actual!==asset.sha256)throw new Error('Media checksum mismatch: '+asset.target);
 await mkdir(dirname(asset.target),{recursive:true});
 await writeFile(asset.target+'.tmp',video);
 await rename(asset.target+'.tmp',asset.target);
 console.log('Restored and verified '+asset.target);
}
