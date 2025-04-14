#!/bin/bash

# Проверка аргумента
ARCHIVE_NAME="$1"

if [[ -z "$ARCHIVE_NAME" || "$ARCHIVE_NAME" != *.zip ]]; then
  echo "Укажи имя архива, например: ./zip_jsons.sh 0.3.0-rc.zip"
  exit 1
fi

# Получаем список директорий в текущей папке
for dir in */; do
  # Убираем слеш в конце
  DIR_NAME="${dir%/}"
  echo "→ Обработка папки $DIR_NAME..."

  ARCHIVE_PATH="$DIR_NAME/$ARCHIVE_NAME"

  # Удаляем старый архив, если существует
  if [ -f "$ARCHIVE_PATH" ]; then
    echo "⚠️ Удаляю существующий архив: $ARCHIVE_PATH"
    rm "$ARCHIVE_PATH"
  fi

  # Архивируем все .json файлы внутри директории
  (
    cd "$DIR_NAME" || exit
    zip -q "$ARCHIVE_NAME" *.json
  )

  echo "✅ Архив создан: $ARCHIVE_PATH"
done