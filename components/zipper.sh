#!/bin/bash

FOLDERS=("plasma_b2c" "plasma_giga" "plasma_giga_app" "plasma_stards" "sdds_serv" "stylesSalute")  # Папки для архивации
ZIP_FILE_NAME="0.3.0-rc"

echo "--- Архивирование JSON файлов ---"
for FOLDER in "${FOLDERS[@]}"; do
  if [ -d "$FOLDER" ]; then
    echo "Обработка папки $FOLDER..."

    if [ -f "$FOLDER/${ZIP_FILE_NAME}.zip" ]; then
      echo "Удаляем старый архив ${ZIP_FILE_NAME}.zip"
      rm -f "$FOLDER/${ZIP_FILE_NAME}.zip"
    fi
    
    JSON_FILES=$(find "$FOLDER" -type f -name "*.json")
    
    if [ -n "$JSON_FILES" ]; then
      zip -r "${ZIP_FILE_NAME}.zip" $JSON_FILES
      
      mv "${ZIP_FILE_NAME}.zip" "$FOLDER/"
    else
      echo "В папке $FOLDER нет JSON файлов, пропускаем."
    fi
  else
    echo "Папка $FOLDER не найдена, пропускаем."
  fi
done

echo "--- Готово! ---"