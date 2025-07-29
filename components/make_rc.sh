#!/bin/bash

# Проверка имени архива
ARCHIVE_NAME="$1"
shift

if [[ -z "$ARCHIVE_NAME" || "$ARCHIVE_NAME" != *.zip ]]; then
  echo "Укажи имя архива, например: ./make_rc.sh 0.3.0-rc.zip [dir1 dir2 ...] [--exclude dir3 dir4]"
  exit 1
fi

EXCLUDE_DIRS=()
INCLUDE_DIRS=()
EXCLUDE_MODE=false

# Обработка аргументов
while [[ $# -gt 0 ]]; do
  case "$1" in
    --exclude)
      EXCLUDE_MODE=true
      shift
      continue
      ;;
  esac

  if $EXCLUDE_MODE; then
    EXCLUDE_DIRS+=("${1%/}")
  else
    INCLUDE_DIRS+=("${1%/}")
  fi
  shift
done

# Получаем директории: либо переданы явно, либо все в текущей папке
if [[ ${#INCLUDE_DIRS[@]} -eq 0 ]]; then
  mapfile -t INCLUDE_DIRS < <(find . -maxdepth 1 -type d ! -name '.' -exec basename {} \;)
fi

# Удаляем из INCLUDE_DIRS все, что есть в EXCLUDE_DIRS
FILTERED_DIRS=()
for dir in "${INCLUDE_DIRS[@]}"; do
  skip=false
  for excl in "${EXCLUDE_DIRS[@]}"; do
    if [[ "$dir" == "$excl" ]]; then
      skip=true
      break
    fi
  done
  if ! $skip; then
    FILTERED_DIRS+=("$dir")
  fi
done

# Архивируем
for DIR_NAME in "${FILTERED_DIRS[@]}"; do
  if [[ ! -d "$DIR_NAME" ]]; then
    echo "⚠️ Пропускаю: '$DIR_NAME' не директория"
    continue
  fi

  echo "→ Обработка папки $DIR_NAME..."
  ARCHIVE_PATH="$DIR_NAME/$ARCHIVE_NAME"

  if [[ -f "$ARCHIVE_PATH" ]]; then
    echo "⚠️ Удаляю существующий архив: $ARCHIVE_PATH"
    rm "$ARCHIVE_PATH"
  fi

  (
    cd "$DIR_NAME" || exit
    zip -q "$ARCHIVE_NAME" *.json
  )

  echo "✅ Архив создан: $ARCHIVE_PATH"
done
