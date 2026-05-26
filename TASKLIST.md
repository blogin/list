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

## Итерация 0 — Каркас проекта ✅

- [x] Все пункты выполнены

## Итерация 1 — Доменная логика + тесты ✅

- [x] Все пункты выполнены

## Итерация 2 — Firebase data layer ✅

- [x] Все пункты выполнены

## Итерация 3 — Auth + Security ✅

- [x] Все пункты выполнены

## Итерация 4 — UI ✅

- [x] Все пункты выполнены

## Итерация 5 — Feature parity + mobile UX ✅

- [x] Все пункты выполнены

## Итерация 6 — Тесты и качество ✅

- [x] Domain + component tests (18 tests)
- [x] `npm run build` проходит
- [ ] ESLint/Prettier — опционально позже
- [ ] Integration tests с mock Firebase — опционально позже

## Итерация 7 — Локальная проверка (до деплоя) ⏳

> **Stop gate:** деплой в Firebase **не делаем**, пока ты явно не напишешь «можно деплоить».

### Подготовка окружения

- [ ] `.env.local` заполнен конфигом проекта `your-project-id`
- [ ] Firebase Console → Authentication → Authorized domains → `localhost`
- [ ] Google Sign-In провайдер включён
- [ ] Rules на prod **пока не деплоим** (до апрува)

### Локальный dev-сервер

- [x] `npm run dev` готов к запуску
- [ ] Smoke checklist пользователем

## Итерация 8 — Deploy (только после апрува)

- [ ] Ждём явной команды пользователя

---

## Конфиг auth (справочно)

```ts
export const ALLOWED_EMAILS = [
  'user1@example.com',
  'user2@example.com',
  'user3@example.com',
] as const
```

---

## Вне scope

- Firebase Blocking Functions
- PWA / offline
- Миграция RTDB → Firestore
