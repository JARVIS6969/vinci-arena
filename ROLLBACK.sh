#!/bin/bash

echo "🔄 VINCI-ARENA - Rollback System"
echo "================================"
echo ""
echo "Available backups:"
ls -lht ../VINCI-BACKUPS/ | head -10
echo ""
read -p "Enter backup folder name (e.g., frontend-STABLE-20260218-1430): " BACKUP
echo ""

if [ -d "../VINCI-BACKUPS/$BACKUP" ]; then
  read -p "⚠️  This will replace current files. Continue? (yes/no): " CONFIRM
  if [ "$CONFIRM" = "yes" ]; then
    rm -rf frontend backend
    cp -r "../VINCI-BACKUPS/$BACKUP" .
    echo "✅ Rollback complete!"
    echo "Run 'cd frontend && npm run dev' to start"
  else
    echo "❌ Rollback cancelled"
  fi
else
  echo "❌ Backup not found!"
fi
