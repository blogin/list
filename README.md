# Список покупок (list_v2)

Личный трекер расходов и списка покупок с бюджетом по периодам.  
Firebase RTDB + Google Sign-In, responsive UI (mobile / desktop).

**Prod:** https://your-project.web.app  
**Firebase project:** `your-project-id`

---

## Стек

- React 19, TypeScript, Vite
- shadcn/ui (radix-lyra), Tailwind CSS v4
- TanStack Query, Firebase SDK (Auth + RTDB)
- Vitest + React Testing Library

---

## Требования

- Node.js 20+
- npm 10+
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm i -g firebase-tools` или `npx firebase-tools`)
- Доступ к Firebase-проекту `your-project-id` (для деплоя)

---

## Быстрый старт

```bash
git clone git@github.com:blogin/list.git
cd list
git checkout rewrite/v2

npm install
cp .env.example .env.local
# заполнить VITE_FIREBASE_* в .env.local (см. ниже)

npm run dev
```

Откроется http://localhost:5173

### Переменные окружения (`.env.local`)

Скопируйте Web App config из [Firebase Console](https://console.firebase.google.com/project/your-project-id/settings/general) → Your apps:

| Переменная | Пример |
|------------|--------|
| `VITE_FIREBASE_API_KEY` | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | `https://your-project.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `...` |
| `VITE_FIREBASE_APP_ID` | `1:...:web:...` |

Файл `.env.local` в git не попадает.

---

## Firebase Console (один раз)

1. **Authentication → Sign-in method → Google** — включить.
2. **Authentication → Settings → Authorized domains:**
   - `localhost`
   - `your-project.web.app`
   - `your-project.firebaseapp.com`
3. **Realtime Database** — данные уже в prod; rules в репозитории: `database.rules.json`.

### Whitelist email

Доступ только для аккаунтов из `src/config/allowed-emails.ts` (дублируется в `database.rules.json`):

- `user1@example.com`
- `user2@example.com`
- `user3@example.com`

При смене списка — обновить оба файла и задеплоить rules.

---

## Локальная разработка

```bash
npm run dev          # http://localhost:5173
npm run dev -- --host   # доступ с телефона в LAN (http://<IP>:5173)
```

### Проверка на телефоне

1. `npm run dev -- --host`
2. В Firebase Console добавить `localhost` (уже есть) — для LAN-IP авторизация может требовать добавления домена или тест через prod.
3. Удобнее smoke на **prod URL** после деплоя.

---

## Тесты

```bash
npm test             # один прогон (CI)
npm run test:watch   # watch-режим
npm run lint         # ESLint
npm run build        # typecheck + production bundle
```

Тесты: доменная логика (`src/domain`), компоненты auth/salary.

---

## Production-сборка локально

```bash
npm run build
npm run preview      # http://localhost:4173 — проверить dist/
```

Сборка кладёт статику в `dist/`. Firebase Hosting раздаёт именно её.

---

## Деплой

Первый раз — авторизация в Firebase CLI:

```bash
npx firebase-tools login
```

Деплой hosting + rules:

```bash
npm run deploy
```

Только hosting (без rules):

```bash
npm run deploy:hosting
```

Вручную:

```bash
npm run build
npx firebase-tools deploy --only hosting,database
```

### После деплоя

- Проверить https://your-project.web.app
- Google Sign-In на mobile (Chrome/Safari, не in-app browser)
- CRUD списка, «Сохранить», экран «База» (категории / зарплата)

---

## Структура проекта

```
src/
  domain/           # чистая бизнес-логика + unit-тесты
  features/
    auth/           # Google Sign-In, whitelist
    list/           # список, форма, hooks
    categories/     # фильтр категорий
    salary/         # бюджет / аванс
    admin/          # управление RTDB (категории, зарплата)
    app/            # shell после входа
  lib/firebase/     # клиент, paths, CRUD
  components/ui/    # shadcn
database.rules.json
firebase.json
.env.example
```

### RTDB paths

| Путь | Данные |
|------|--------|
| `list/{periodKey}` | позиции (`10_may`, `25_may`, …) |
| `db_opt` | категории |
| `yearSalary` | зарплата / аванс по месяцам |

---

## Legacy (Vue)

Старое Vue-приложение удалено из этой ветки. История сохранена в ветках `new_version` и `master` на GitHub.

---

## Cursor / shadcn

- MCP: `.cursor/mcp.json` — после изменений Reload Window.
- Добавление компонентов: `npx shadcn add <component> -y` (не интерактивный `init`).

---

## Ветки

| Ветка | Описание |
|-------|----------|
| `rewrite/v2` | актуальная React-версия |
| `new_version` | предыдущая Vue-версия + legacy |
