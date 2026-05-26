# Rewrite v2 — итог

> Ветка: **`rewrite/v2`**

## Стек

React 19 + Vite + TypeScript + shadcn/ui (radix-lyra) + Tailwind v4 + TanStack Query + Firebase SDK

---

## Итерации

| # | Статус | Содержание |
|---|--------|------------|
| 0 | ✅ | Каркас, shadcn, Firebase SDK, `.env.example` |
| 1 | ✅ | Доменная модель + unit-тесты |
| 2 | ✅ | Firebase data layer + TanStack Query |
| 3 | ✅ | Google Auth, whitelist, `database.rules.json` |
| 4 | ✅ | Responsive UI |
| 5 | ✅ | Feature parity + mobile UX |
| 6 | ✅ | Component tests (20 tests) |
| 7 | ✅ | Локальная и prod-проверка |
| 8 | ✅ | Deploy hosting + RTDB rules |

---

## Auth

- Google Sign-In only
- Whitelist: `VITE_ALLOWED_EMAILS` в `.env.local` + `database.rules.json` (генерируется перед деплоем)
- Popup-first на mobile (fallback redirect)
- Rules: `database.rules.json`

---

## Документация

См. **[README.md](./README.md)** — установка, тесты, деплой.

---

## Вне scope (на будущее)

- ESLint/Prettier в CI
- Integration tests с mock Firebase
- PWA / offline
- Firestore migration
