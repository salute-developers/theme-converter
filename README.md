# Theme Converter

Это технический репозиторий, который позволяет конвертировать темы, лежащие в [директории](https://github.com/salute-developers/plasma/tree/dev/packages/plasma-tokens/data/themes) из старого формата в новый.

Результаты конвертации лежат в директории `themes` в формате `zip` архивов. 

## Использование

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
| `all` | false | Флаг, который позволяет перегенирировать все темы.
 