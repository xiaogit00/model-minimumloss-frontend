#!/bin/bash
echo "Building..."
npm run build

echo "Uploading to droplet..."
rsync -avz ./build/ deploy@206.189.156.163:/var/www/myapp/

echo "Restarting server..."
ssh deploy@206.189.156.163 "pm2 restart frontend"

echo "Done!"
