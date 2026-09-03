# 7s Frontend Challenge

This repository contains two projects built as part of the 7s frontend challenge.

---

## Projects

### 1. todo-app

A Next.js todo list application where items are sorted into categorized columns (Fruit / Vegetable) with an auto-return timer.

**Features**
- Click an item from the main list to move it to its category column (Fruit or Vegetable)
- Item automatically returns to the main list after 5 seconds
- Click an item in a category column to manually return it before the timer ends
- State managed with `useReducer` and a pure `todoReducer` function
- Dark mode support via Tailwind CSS

**Tech Stack**
- Next.js 16 / React 19
- TypeScript
- Tailwind CSS v4
- Jest + ts-jest

**Getting Started**

```bash
cd todo-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Run Tests**

```bash
npm test
```

---

### 2. user-api

A Fastify microservice that fetches user data from an upstream API, groups users by department, and returns the result with in-memory caching.

**Features**
- `GET /api/users/by-department` — returns users grouped by department
- `GET /health` — health check endpoint
- In-memory cache with 60-second TTL to reduce upstream API calls
- Single-pass O(n) grouping algorithm
- `X-Cache` response header (HIT / MISS)

**Tech Stack**
- Fastify 4
- TypeScript
- Jest + ts-jest

**Getting Started**

```bash
cd user-api
npm install
npm run dev
```

Server runs on [http://localhost:4000](http://localhost:4000)

**Run Tests**

```bash
npm test
```

---

## Repository Structure

```
7s-frontend-challenge/
├── todo-app/        # Next.js todo application
│   └── src/
│       ├── app/         # Next.js app router (layout, page, styles)
│       ├── components/  # Column, TodoButton
│       ├── data/        # Initial item data
│       ├── hooks/       # todoReducer, useTimerManager
│       └── types/       # TypeScript types
└── user-api/        # Fastify user aggregation API
    └── src/
        ├── routes/      # User route handler
        ├── services/    # fetchService, transformService, cacheService
        └── types/       # TypeScript types
```
