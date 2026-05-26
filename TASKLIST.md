# Rewrite v2 — Task List

> Ветка: `rewrite/v2` (от `new_version`)  
> Стек: **React 19 + Vite + TypeScript + shadcn/ui (new-york) + Tailwind v4 + TanStack Query + Firebase SDK**  
> Тема: оранжевая палитра на базе CSS-переменных shadcn (primary ≈ `#b30707` legacy)

---

## Требования (зафиксировано)

### Авторизация

- **Только Google Sign-In** — одна кнопка «Войти через Google» на отдельной странице входа.
- **Whitelist email** (доступ к данным только для):
  - `user1@example.com`
  - `user2@example.com`
  - `user3@example.com`
- Защита на двух уровнях:
  1. **RTDB Security Rules** — `auth.token.email` в whitelist (основная защита данных).
  2. **Клиент** — после входа проверка email; если не в списке → toast «Нет доступа» + `signOut()`.
- В Firebase Console: включить провайдер **Google** для проекта `your-project-id`.

### Responsive (mobile + desktop)

Приложение должно нормально работать на **телефоне** и **ПК в браузере**:

| Аспект | Desktop (≥768px) | Mobile (<768px) |
|--------|------------------|-----------------|
| Layout | Sidebar 25% + content | Вертикальный stack: salary → categories → form → table |
| Таблица | Table shadcn | Card-list или scrollable table, крупные touch-targets |
| Кнопки | Стандарт new-york | min-height 44px, достаточные отступы |
| Google Auth | `signInWithPopup` | `signInWithRedirect` + обработка `getRedirectResult` (popup на mobile ненадёжен) |
| Action bar | Inline | Sticky bottom bar (Сохранить / Список / Сбросить) |
| Dialog | Center modal | Full-screen или near full-screen на узком экране |
| Viewport | — | `viewport-fit=cover`, safe-area для iOS |

---

## Итерация 0 — Каркас проекта

- [x] Создать ветку `rewrite/v2` от текущей `new_version`
- [x] Scaffold: `Vite + React + TypeScript` в корне; старый Vue → `legacy/`
- [x] `components.json` вручную — style: **new-york**, cssVariables, lucide (без интерактивного init)
- [x] Оранжевая тема в `src/index.css`: `--primary`, `--ring`, `--accent`, `--sidebar-primary` в oklch (orange hue ~40–50)
- [x] Базовые компоненты: Button, Card, Table, Input, Select, Checkbox, Dialog, Sheet, Sonner, Skeleton, Badge, Separator, AlertDialog, DropdownMenu
- [x] Firebase SDK: `firebase/app`, `auth`, `database`; env `.env.local` (`VITE_FIREBASE_*`)
- [x] `.env.example` + `.gitignore` для `.env.local`
- [x] README: локальный запуск (`npm run dev`, `npm run preview`)
- [x] Tailwind breakpoints + mobile-first utilities в layout
- [x] `index.html`: viewport meta для mobile
- [x] Структура: `src/lib/`, `src/domain/`, `src/features/`, `src/components/ui/`, `src/config/`
- [x] `.cursor/mcp.json` — shadcn MCP

## Итерация 1 — Доменная логика + тесты

- [ ] TypeScript-типы: `ListItem`, `Category`, `SalaryMonth`
- [ ] Pure functions:
  - `getListPeriodKey(date)` → `10_january` / `25_january`
  - `getFallbackListKey(date)`
  - `calcAllExpenses`, `calcRestOfMoney`, `calcCategoryTotals`
  - `sortByCostDesc`, `sortByChecked`
- [ ] **`src/config/allowed-emails.ts`** — константа whitelist (синхрон с Rules)
- [ ] **`isEmailAllowed(email)`** — для клиентской проверки после Google login
- [ ] Vitest: 100% domain + allowlist helper, edge cases

## Итерация 2 — Firebase data layer

- [ ] RTDB paths (без изменения схемы):
  - `list/{periodKey}` — `{ cost, name, sel, check, show }[]`
  - `db_opt.json` — категории
  - `yearSalary.json` — зарплата/аванс по месяцам
- [ ] Firebase SDK read/write (не REST)
- [ ] TanStack Query: `useList`, `useCategories`, `useSalary`; mutations `saveList`, `saveCategories`
- [ ] Fallback списка + toast

## Итерация 3 — Auth + Security

- [ ] **`LoginPage`** — centered Card, лого/заголовок, кнопка «Войти через Google» (shadcn Button + Google icon)
- [ ] **`useAuth` hook**: `onAuthStateChanged`, loading state
- [ ] **Google Sign-In**:
  - Desktop: `signInWithPopup`
  - Mobile (matchMedia / touch): `signInWithRedirect` + `getRedirectResult` on mount
- [ ] После входа: `isEmailAllowed(user.email)` → иначе toast + signOut
- [ ] **`AuthGuard`**: не авторизован → LoginPage; не в whitelist → LoginPage + сообщение
- [ ] Header: email пользователя + кнопка «Выйти» (desktop: top bar; mobile: compact dropdown)
- [ ] **`database.rules.json`**:
  ```json
  ".read": "auth != null && (
    auth.token.email == 'user1@example.com' ||
    auth.token.email == 'user2@example.com' ||
    auth.token.email == 'user3@example.com'
  )"
  ```
  (аналогично для `.write`)
- [ ] `firebase.json` — секция `database` для deploy rules
- [ ] Unit-тесты: `isEmailAllowed`, mock auth flow

## Итерация 4 — UI (shadcn new-york, orange, responsive)

- [ ] **`AppLayout`**: responsive grid
  - `md+`: sidebar (salary + categories + actions) | main (form + list)
  - `<md`: stack сверху вниз
- [ ] **SalaryPanel** — Card, compact на mobile
- [ ] **CategoryPanel** — Checkbox, touch-friendly rows
- [ ] **AddItemForm** — на mobile: поля stack vertical или 2 строки; Select native-friendly
- [ ] **ExpenseList** — Table на desktop; на mobile **Card rows** (name, cost, category, actions)
- [ ] **ListDialog** — Dialog desktop / Sheet full-height mobile
- [ ] **ActionBar** — desktop inline; mobile **sticky bottom** с safe-area padding
- [ ] Sonner toasts (top-center mobile, bottom-right desktop)
- [ ] Skeleton loading

## Итерация 5 — Feature parity + mobile UX

- [ ] Tap row → toggle `check` (не только click — touch events ok)
- [ ] Edit: tap на icon / long-press alternative → Sheet/Dialog edit form (удобнее на телефоне чем inline)
- [ ] Delete → AlertDialog с крупными кнопками
- [ ] Category filter → `show` на items
- [ ] Save: list + categories; fix payload категорий
- [ ] Reset: снять все `check`
- [ ] Валидация cost — только цифры
- [ ] Проверка на реальном mobile viewport (375px, 414px) и desktop (1280px+)

## Итерация 6 — Тесты и качество

- [ ] Component tests: LoginPage, SalaryPanel, ExpenseList (desktop + mobile render)
- [ ] Integration: mock Firebase auth (allowed / denied email) + data flow
- [ ] ESLint + Prettier
- [ ] Responsive regression: snapshot или visual checklist в README

## Итерация 7 — Локальная проверка (до деплоя)

> **Stop gate:** деплой в Firebase **не делаем**, пока ты явно не напишешь «можно деплоить» / не дашь апрув.

### Подготовка окружения

- [ ] `.env.local` заполнен конфигом проекта `your-project-id`
- [ ] Firebase Console → Authentication → Authorized domains → добавлен `localhost`
- [ ] Google Sign-In провайдер включён в Console
- [ ] `database.rules.json` готов, но **rules на prod пока не деплоим** (можно проверить через Emulator или после апрува)

### Локальный dev-сервер

- [ ] `npm run dev` → `http://localhost:5173`
- [ ] `npm run dev -- --host` — доступ с телефона в той же Wi‑Fi (опционально)
- [ ] `npm run build` + `npm run preview` — проверка production-сборки локально

### Smoke checklist (локально, prod RTDB или Emulator)

- [ ] **Desktop:** Google login (whitelist email) → список / категории / salary загружаются
- [ ] **Desktop:** add / edit / delete / check / reset / save
- [ ] **Mobile viewport** (375px, 414px) или реальный телефон: layout, sticky bar, redirect login
- [ ] **Denied email:** другой Google → «Нет доступа», без доступа к данным
- [ ] Остаток денег и суммы по категориям совпадают с ожиданием
- [ ] `npm run test` — все тесты зелёные

### Handoff тебе

- [ ] Краткий отчёт: что проверено, скриншоты/заметки, известные ограничения
- [ ] **Ждём твоего апрува** перед итерацией 8

---

## Итерация 8 — Deploy в Firebase (только после апрува)

> ⚠️ **Выполняется только по твоей явной команде** («деплой», «можно выкатывать» и т.п.)

- [ ] Финальный `npm run build`
- [ ] `firebase deploy --only hosting,database`
- [ ] Smoke **prod URL** desktop: login → load → save
- [ ] Smoke **prod URL** mobile: login (redirect) → CRUD → save
- [ ] Smoke **denied email** на prod
- [ ] README: финальные шаги deploy, allowed emails, troubleshooting

---

## Конфиг auth (справочно)

```ts
// src/config/allowed-emails.ts
export const ALLOWED_EMAILS = [
  'user1@example.com',
  'user2@example.com',
  'user3@example.com',
] as const
```

> ⚠️ При добавлении email — обновить и `database.rules.json`, и этот файл.

---

## Вне scope (можно позже)

- Firebase Blocking Functions (запрет sign-in до сессии — Blaze plan)
- PWA / offline / «Add to Home Screen»
- Миграция RTDB → Firestore
