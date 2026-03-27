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
tests/
  app.test.js # HTTP tests with Supertest
```

## Why separate app.js and server.js?

`app.js` sets up routes without starting a server. Tests import `app.js` directly — Supertest spins up an in-memory server, no port needed. `server.js` is only used in production via `npm start`.
