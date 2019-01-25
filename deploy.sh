#!/bin/bash
killall node
killall nodemon
rm -rf SharErasmus
git clone  https://github.com/CiccioTecchio/SharErasmus.git
cp  credeFb.json SharErasmus/server/routes/credeFb.json
cp  db.json SharErasmus/server/singleton/db.json
cp app.js SharErasmus/server/app.js
cp crede.json SharErasmus/server/routes/crede.json
cd SharErasmus/server
npm i
nodemon app.js
