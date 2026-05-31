# Список покупок (list_v2)

Личный трекер расходов и списка покупок с бюджетом по периодам.  
Firebase RTDB + Google Sign-In, responsive UI (mobile / desktop).

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
- Свой Firebase-проект с Realtime Database и Google Auth (для деплоя)

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

Скопируйте Web App config из [Firebase Console](https://console.firebase.google.com/) → Project settings → Your apps:

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
   - домен hosting после деплоя (`*.web.app`, `*.firebaseapp.com`)
3. **Realtime Database** — шаблон rules: `database.rules.json.example`; локальный `database.rules.json` генерируется из `.env.local`.

### Whitelist email

Доступ только для аккаунтов из `VITE_ALLOWED_EMAILS` в `.env.local` (через запятую).  
Те же email должны попасть в RTDB rules — перед деплоем выполняется `npm run rules:generate` (см. `database.rules.json.example`).

При смене списка — обновить `.env.local` и задеплоить rules.

### Локально без Google (опционально)

Только для `npm run dev` (в prod-сборке **не работает**):

1. Firebase Console → **Authentication → Sign-in method → Email/Password** — включить.
2. **Users → Add user** — email из `VITE_ALLOWED_EMAILS` и пароль для dev.
3. В `.env.local`:
   ```
   VITE_DEV_AUTO_LOGIN=true
   VITE_DEV_AUTH_EMAIL=alogin2009@gmail.com
   VITE_DEV_AUTH_PASSWORD=your-dev-password
   ```

Приложение войдёт автоматически, RTDB использует тот же prod-проект с настоящим токеном.

---

## Локальная разработка

```bash
npm run dev          # http://localhost:5173
npm run dev -- --host   # доступ с телефона в LAN (http://<IP>:5173)
```

### Проверка на телефоне

1. `npm run dev -- --host`
2. Для LAN-IP авторизация может требовать добавления домена в Firebase Console.
3. Удобнее smoke-тест на задеплоенном hosting после `npm run deploy`.

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

Первый раз — авторизация в Firebase CLI и привязка проекта:

```bash
npx firebase-tools login
cp .firebaserc.example .firebaserc
# указать свой project id в .firebaserc
npx firebase-tools use --add
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

- Открыть URL из вывода Firebase CLI или Hosting в консоли
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
database.rules.json.example
.firebaserc.example
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
