#!/usr/bin/env bash
set -e

echo "==> Installing server dependencies..."
cd server && npm install
cd ..

echo "==> Installing frontend dependencies..."
cd user && npm install

echo "==> Building frontend for production..."
npm run build
cd ..

echo "==> Build complete!"
