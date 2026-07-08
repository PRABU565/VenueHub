const fs = require('fs');
const path = require('path');

const links = [
  "https://maps.app.goo.gl/ckbJhfsD6ZTpRyT17?g_st=ac",
  "https://maps.app.goo.gl/v7qDhBCSPvvMWgEX9?g_st=ac",
  "https://maps.app.goo.gl/j2aU3Sf16dPf7SWH8?g_st=ac",
  "https://maps.app.goo.gl/Ad8pFkTSZzhgCaL98?g_st=ac",
  "https://maps.app.goo.gl/F38z25Te4AA8FJWW9",
  "https://maps.app.goo.gl/UcejkjKgSyTRh7xW9?g_st=ac",
  "https://maps.app.goo.gl/R2fNFAeW7y21V78y5?g_st=ac",
  "https://maps.app.goo.gl/gw6BJH1xKSPEzHsy7?g_st=ac",
  "https://maps.app.goo.gl/UBw9zBBVmJq5sd9q8",
  "https://maps.app.goo.gl/drDNRACakPgGq66Y8?g_st=ac",
  "https://maps.app.goo.gl/PuHW5ip47p8vwZg39?g_st=ac",
  "https://maps.app.goo.gl/ycn9Lyp8CZyGd6vN7?g_st=ac",
  "https://maps.app.goo.gl/6cUrhv3p5ny4URBL7?g_st=ac",
  "https://maps.app.goo.gl/9PwLF7pveCvymL8X7?g_st=ac",
  "https://maps.app.goo.gl/RhaUSB192Fw1uf9j7",
  "https://maps.app.goo.gl/7xRkY1uhrQ8dg7aR8?g_st=ac",
  "https://maps.app.goo.gl/mswxUGC1yHCy6qM16?g_st=ac",
  "https://maps.app.goo.gl/akboaRnBuuVJmqu7A",
  "https://maps.app.goo.gl/vtsxYYZ5S7HtTor26",
  "https://maps.app.goo.gl/dTXHRha5zxTigRSK6?g_st=ac",
  "https://maps.app.goo.gl/BLhgDVdZfAvPca9y6?g_st=ac",
  "https://maps.app.goo.gl/HgZTJYoS9KPXMddu8?g_st=ac",
  "https://maps.app.goo.gl/bsjzc1py6EHCFtzb9?g_st=ac",
  "https://maps.app.goo.gl/4JttQCDJPxn5xD7k6?g_st=ac",
  "https://maps.app.goo.gl/aqfAuoYh7w1SUfpr5?g_st=ac",
  "https://maps.app.goo.gl/Qg7iyEanZ3EpwABE8?g_st=ac",
  "https://maps.app.goo.gl/EtjoyTTGBiw1pxfr6",
  "https://maps.app.goo.gl/cSFv3MQPDV3tftYQ7",
  "https://maps.app.goo.gl/1bvCWvBDBY6aBmaj7?g_st=ac",
  "https://maps.app.goo.gl/nvwn1FQcW6NztcQs9",
  "https://maps.app.goo.gl/gqAYdwu4EJcgNrcM8?g_st=ac",
  "https://maps.app.goo.gl/J1vzYJBc9koUeigs5?g_st=ac",
  "https://maps.app.goo.gl/MGA9HHTz3WD2hMqz7?g_st=ac",
  "https://maps.app.goo.gl/iHX3B77Vv5wjrnBL9?g_st=ac",
  "https://maps.app.goo.gl/r1sheejA8NhQdkv26?g_st=ac",
  "https://maps.app.goo.gl/oy9hTCEVAGHMiKN7A?g_st=ac",
  "https://maps.app.goo.gl/hmGox4JWmJeFiiSP8?g_st=ac",
  "https://maps.app.goo.gl/pGGg9dAXyPj8fzXZ9?g_st=ac"
];

const seedFile = path.join(__dirname, 'config', 'seed.js');
let seedContent = fs.readFileSync(seedFile, 'utf8');

let replaceIndex = 0;
seedContent = seedContent.replace(/googleMapsLink:\s*".*?"/g, (match) => {
  if (replaceIndex < links.length) {
    const newLink = links[replaceIndex++];
    return `googleMapsLink: "${newLink}"`;
  }
  return match;
});

fs.writeFileSync(seedFile, seedContent);
console.log(`Replaced ${replaceIndex} links.`);
