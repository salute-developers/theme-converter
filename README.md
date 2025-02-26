# Theme Converter

Это технический репозиторий, который позволяет конвертировать темы, лежащие в [директории](https://github.com/salute-developers/plasma/tree/dev/packages/plasma-tokens/data/themes) из старого формата в новый.

Результаты конвертации лежат в директории `themes` в формате `zip` архивов. 

## Использование

### Генерация
Для генерации конкретной темы необходимо выполнить следующую команду:

```bash
npm run convert theme='default'
```

Доступны несколько параметров при вызове скрипта `convert`:

| Параметр | Значение по умолчанию | Описание | 
| - | - | - |
| `theme` | default | Название темы, которое должно совпадать с именем файла json в [директории](https://github.com/salute-developers/plasma/tree/dev/packages/plasma-tokens/data/themes).
|`version` | 0.1.0 | Версия темы, которая будет отображаться в файле с метаинформацией и файле самого `zip` архива.
| `branch` | master | Ветка, из которой нужно будет забирать файл темы  
| `all` | false | Флаг, который позволяет перегенерировать все темы.

### Внесение изменений вручную
Если вы изменяете тему вручную:

- Убедитесь, что содержимое собранного `.zip`-архива имеет плоскую структуру (при распаковке отсутствует корневая папка)

```bash
# Например, для plasma_stards
plasma_stards $ unzip latest.zip
```

```bash
# Верно
├── 0.1.0.zip
├── 0.2.0-alpha.zip
├── 0.3.0.zip
├── android <- папка из latest.zip
├── ios <- папка из latest.zip
├── latest.zip
├── meta.json <- файл из latest.zip
├── reactNative <- папка из latest.zip
└── web <- папка из latest.zip
```

```bash
# Неверно
├── 0.1.0.zip
├── 0.2.0-alpha.zip
├── 0.3.0.zip
├── latest <- корневая папка
│   ├── android
│   ├── ios
│   ├── meta.json
│   ├── reactNative
│   └── web 
├── latest.zip
```

- (для MacOS) Убедитесь, что в собранный `.zip`-архив не попадут специфичные для MacOS файлы и папки (`__MACOSX`, `.DS_Store`). Для этого при сборке архива можно воспользоваться флагом `-x` у команды `zip`:

```bash
zip -r YOUR_ARCHIVE_NAME.zip YOUR_FILE.json -x "__MACOSX/*" "*.DS_Store"
```