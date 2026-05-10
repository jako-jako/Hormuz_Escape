#!/bin/bash

# ホルムズ・エスケープ ローカル開発サーバー起動スクリプト

cd "$(dirname "$0")/web/dist"

echo "================================"
echo "ホルムズ・エスケープ"
echo "================================"
echo ""
echo "🚀 サーバーを起動中..."
echo ""
echo "📍 アクセスURL:"
echo "   http://localhost:8000"
echo ""
echo "🛑 終了するには Ctrl+C を押してください"
echo ""

python3 -m http.server 8000 --bind 127.0.0.1
