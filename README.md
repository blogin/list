# list_v2 — React rewrite

Личный трекер расходов и списка покупок. Ветка `rewrite/v2`.

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # заполнить ключи Firebase
npm run dev
```

Откроется http://localhost:5173

Для телефона в той же сети:

```bash
npm run dev -- --host
```

Production-сборка локально:

```bash
npm run build
npm run preview
```

## Firebase Console (перед первым login)

1. Authentication → Sign-in method → **Google** — включить
2. Authentication → Settings → **Authorized domains** → добавить `localhost`
3. Скопировать Web App config в `.env.local`

## MCP

В `.cursor/mcp.json` подключён shadcn MCP. После изменения — Reload Window в Cursor.

## Legacy

Vue-приложение перенесено в `legacy/`.
