# API Quality Lab

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![ESLint](https://img.shields.io/badge/lint-ESLint%20v9-4B32C3)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933)

REST API built with **Express** (Node.js), tested with **Jest + Supertest**, and linted with **ESLint**.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Commands](#commands)
- [Structure](#structure)
- [Why separate app.js and server.js?](#why-separate-appjs-and-serverjs)
- [A1 — Utility Functions](#a1--utility-functions)
  - [capitalize](#capitalize)
  - [calculateAverage](#calculateaverage)
  - [slugify](#slugify)
  - [clamp](#clamp)
- [Issues encountered](#issues-encountered)

## Tech Stack

| Role | Tool |
|---|---|
| Runtime | Node.js |
| HTTP Framework | Express |
| Tests + HTTP tests | Jest + Supertest |
| Coverage | Jest `--coverage` (built-in) |
| Linter | ESLint v9 |

## Prerequisites

- Node.js (v18+)
- npm

## Installation

```bash
npm install
```

## Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Start the server
npm start
```

## Structure

```
src/
  app.js      # Express config: routes + middleware (no listen)
  server.js   # Starts the server on port 3000
  utils.js    # Utility functions: capitalize, calculateAverage, slugify, clamp
tests/
  app.test.js   # HTTP tests with Supertest
  utils.test.js # Unit tests for utility functions (16 tests)
```

## Why separate app.js and server.js?

`app.js` sets up routes without starting a server. Tests import `app.js` directly — Supertest spins up an in-memory server, no port needed. `server.js` is only used in production via `npm start`.

---

## A1 — Utility Functions

Unit tests for pure utility functions. Each function is tested with at least 4 cases covering normal inputs, edge cases, and invalid inputs. Tests follow the **AAA pattern** (Arrange / Act / Assert) and the `should [result] when [condition]` naming convention.

### capitalize

Uppercases the first letter, lowercases the rest.

| Input | Expected output |
|---|---|
| `"hello"` | `"Hello"` |
| `"WORLD"` | `"World"` |
| `""` | `""` |
| `null` | `""` |

### calculateAverage

Returns the average of an array of numbers, rounded to 2 decimal places.

| Input | Expected output |
|---|---|
| `[10, 12, 14]` | `12` |
| `[15]` | `15` |
| `[]` | `0` |
| `null` | `0` |

### slugify

Transforms a string into a URL-friendly slug: lowercase, spaces replaced by dashes, special characters removed.

| Input | Expected output |
|---|---|
| `"Hello World"` | `"hello-world"` |
| `" Spaces Everywhere "` | `"spaces-everywhere"` |
| `"C'est l'ete !"` | `"cest-lete"` |
| `""` | `""` |

### clamp

Constrains a value between a minimum and a maximum.

| Input | Expected output |
|---|---|
| `clamp(5, 0, 10)` | `5` |
| `clamp(-5, 0, 10)` | `0` |
| `clamp(15, 0, 10)` | `10` |
| `clamp(0, 0, 0)` | `0` |

---

## Issues encountered

**ESLint — `require` / `module` / `process` not defined**

ESLint v9 does not assume any runtime environment by default. It flagged Node.js globals (`require`, `module`, `process`, `console`) as undefined.

Fix: explicitly declare the Node.js globals in `eslint.config.js` using the `globals` package:

```js
const globals = require('globals');

// inside the config object:
languageOptions: {
  globals: {
    ...globals.node,
  },
},
```

---

**slugify — trailing dash on input ending with a special character**

Input `"C'est l'ete !"` was producing `"cest-lete-"` instead of `"cest-lete"`.

Root cause: the space before `!` was converted to `-`, then `!` was removed — leaving a trailing dash.

Fix: add a final `.replace(/^-+|-+$/g, '')` step to strip leading and trailing dashes after cleanup:

```js
return text
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
```
