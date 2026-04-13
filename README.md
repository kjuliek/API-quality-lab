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
- [A2 — Validators](#a2--validators)
  - [isValidEmail](#isvalidemail)
  - [isValidPassword](#isvalidpassword)
  - [isValidAge](#isvalidage)
- [A3 — Reading failing tests](#a3--reading-failing-tests)
  - [Bug 1 — calculateAverage: division replaced by multiplication](#bug-1--calculateaverage-division-replaced-by-multiplication)
  - [Bug 2 — isValidEmail: missing @ check](#bug-2--isvalidemail-missing--check)
  - [Bug 3 — capitalize: missing toLowerCase](#bug-3--capitalize-missing-tolowercase)
- [A4 — TDD: sortStudents](#a4--tdd-sortstudents)
  - [Red/Green cycles](#redgreen-cycles)
- [A5 — parsePrice](#a5--parseprice)
- [A6 — groupBy](#a6--groupby)
  - [Red/Green cycles](#redgreen-cycles-1)
- [A7 — calculateDiscount](#a7--calculatediscount)
  - [percentage rules](#percentage-rules)
  - [fixed rules](#fixed-rules)
  - [buyXgetY rules](#buyxgety-rules)
- [B1 — calculateDeliveryFee](#b1--calculatedeliveryfee)
  - [Red/Green cycles](#redgreen-cycles-2)
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
  app.js         # Express config: routes + middleware (no listen)
  server.js      # Starts the server on port 3000
  utils.js       # Utility functions: capitalize, calculateAverage, slugify, clamp, sortStudents, parsePrice, groupBy, calculateDiscount
  validators.js  # Validators: isValidEmail, isValidPassword, isValidAge
  pricing.js     # Pricing engine: calculateDeliveryFee
tests/
  app.test.js        # HTTP tests with Supertest
  utils.test.js      # Unit tests for utility functions (60+ tests)
  validators.test.js # Unit tests for validators (23 tests)
  pricing.test.js    # Unit tests for pricing functions (17 tests)
docs/
  screenshots/   # Screenshots of RED/GREEN cycles and bug analyses
```

## Why separate app.js and server.js?

`app.js` sets up routes without starting a server. Tests import `app.js` directly — Supertest spins up an in-memory server, no port needed. `server.js` is only used in production via `npm start`.

---

## A1 — Utility Functions

Unit tests for pure utility functions. Each function is tested across normal inputs, edge cases, and invalid inputs. Tests follow the **AAA pattern** (Arrange / Act / Assert) and the `should [result] when [condition]` naming convention.

### capitalize

Uppercases the first alphabetic character, lowercases the rest.

| Input | Expected output |
|---|---|
| `"hello"` | `"Hello"` |
| `"WORLD"` | `"World"` |
| `""` | `""` |
| `null` | `""` |
| `"a"` | `"A"` |
| `"hello2world"` | `"Hello2world"` |
| `"!hello"` | `"!Hello"` |

### calculateAverage

Returns the average of an array of numbers, rounded to 2 decimal places. Throws a `TypeError` if the array contains a non-number.

| Input | Expected output |
|---|---|
| `[10, 12, 14]` | `12` |
| `[15]` | `15` |
| `[]` | `0` |
| `null` | `0` |
| `[-10, -5]` | `-7.5` |
| `[1, 2]` | `1.5` |
| `[1.005, 1.006]` | `1.01` |
| `[1, 'abc', 3]` | throws `TypeError` |

### slugify

Transforms a string into a URL-friendly slug: special characters removed first, then lowercase, spaces replaced by dashes, leading/trailing dashes stripped.

| Input | Expected output |
|---|---|
| `"Hello World"` | `"hello-world"` |
| `" Spaces Everywhere "` | `"spaces-everywhere"` |
| `"C'est l'ete !"` | `"cest-lete"` |
| `""` | `""` |
| `"hello   world"` | `"hello-world"` |
| `"!!!"` | `""` |
| `"Hello 123 World"` | `"hello-123-world"` |
| `"hello ! world"` | `"hello-world"` |

### clamp

Constrains a value between a minimum and a maximum.

| Input | Expected output |
|---|---|
| `clamp(5, 0, 10)` | `5` |
| `clamp(-5, 0, 10)` | `0` |
| `clamp(15, 0, 10)` | `10` |
| `clamp(0, 0, 0)` | `0` |
| `clamp(0, 0, 10)` | `0` |
| `clamp(10, 0, 10)` | `10` |
| `clamp(-3, -5, -1)` | `-3` |
| `clamp('a', 0, 10)` | throws `TypeError` |

---

## A2 — Validators

Validation functions for user input. Each function returns either a boolean or a detailed object with errors.

### isValidEmail

Returns `true` if the email contains a local part, `@`, a domain and a `.`.

| Input | Expected output |
|---|---|
| `"user@example.com"` | `true` |
| `"user.name+tag@domain.co"` | `true` |
| `"invalid"` | `false` |
| `"@domain.com"` | `false` |
| `"user@"` | `false` |
| `""` | `false` |
| `null` | `false` |

### isValidPassword

Returns `{ valid: boolean, errors: string[] }`. Validates 5 rules independently.

| Input | Expected output |
|---|---|
| `"Passw0rd!"` | `{ valid: true, errors: [] }` |
| `"short"` | `{ valid: false, errors: [length, uppercase, digit, special] }` |
| `"alllowercase1!"` | missing uppercase error |
| `"ALLUPPERCASE1!"` | missing lowercase error |
| `"NoDigits!here"` | missing digit error |
| `"NoSpecial1here"` | missing special character error |
| `""` | `{ valid: false, errors: [5 errors] }` |
| `null` | `{ valid: false, errors: [5 errors] }` |

### isValidAge

Returns `true` if the age is an integer between 0 and 150 (inclusive).

| Input | Expected output |
|---|---|
| `25` | `true` |
| `0` | `true` |
| `150` | `true` |
| `-1` | `false` |
| `151` | `false` |
| `25.5` | `false` |
| `"25"` | `false` |
| `null` | `false` |

---

## A3 — Reading failing tests

The goal of this exercise is to learn how to read test error messages. Each bug was introduced intentionally, tests were run, and the output was analysed before fixing.

---

### Bug 1 — calculateAverage: division replaced by multiplication

**Change made:** replaced `/` by `*` in `calculateAverage`.

```js
// buggy
return parseFloat((sum * numbers.length).toFixed(2));
```

**Tests failed:** 4 out of 7 — all cases where the result is not 0 or 1-element arrays.

**Reading the errors:**

`[10, 12, 14]` → sum is `36`, multiplied by `3` gives `108` instead of `12`.

![calculateAverage bug error 1](docs/screenshots/a3-calculate-average-bug-error1.png)

`[-10, -5]` → sum is `-15`, multiplied by `2` gives `-30` instead of `-7.5`.

![calculateAverage bug error 2](docs/screenshots/a3-calculate-average-bug-error2.png)

`[1, 2]` → sum is `3`, multiplied by `2` gives `6` instead of `1.5`.

![calculateAverage bug error 3](docs/screenshots/a3-calculate-average-bug-error3.png)

`[1.005, 1.006]` → sum is `2.011`, multiplied by `2` gives `4.02` instead of `1.01`.

![calculateAverage bug error 4](docs/screenshots/a3-calculate-average-bug-error4.png)

**Why the other tests still passed:** `[15]` — single element, sum × 1 = sum / 1. `[]` and `null` — early return `0`, never reaches the formula.

**Fix:** restore `/`.

---

### Bug 2 — isValidEmail: missing @ check

**Change made:** removed `@` from the regex in `isValidEmail`.

```js
// buggy
return /^[^\s@]+[^\s@]+\.[^\s@]+$/.test(email);
```

**Tests failed:** 2 out of 7 — the two valid email cases.

**Reading the errors:**

`"user@example.com"` → received `false` instead of `true`. Without `@` in the regex, the pattern no longer matches valid emails containing `@`.

![isValidEmail bug error 1](docs/screenshots/a3-is-valid-email-bug-error1.png)

`"user.name+tag@domain.co"` → same issue.

![isValidEmail bug error 2](docs/screenshots/a3-is-valid-email-bug-error2.png)

**Why the other tests still passed:** the invalid cases (`"invalid"`, `"@domain.com"`, `"user@"`, `""`, `null`) were already expected to return `false` — the broken regex still returned `false` for them, so those tests passed by coincidence.

**Fix:** restore `@` in the regex.

---

### Bug 3 — capitalize: missing toLowerCase

**Change made:** removed `.toLowerCase()` from `capitalize`.

```js
// buggy
return str.slice(0, index) + str[index].toUpperCase() + str.slice(index + 1);
```

**Tests failed:** 1 out of 7 — only `"WORLD"`.

**Reading the error:**

`"WORLD"` → received `"WORLD"` instead of `"World"`. Without `.toLowerCase()`, the remaining characters keep their original case.

![capitalize bug error 1](docs/screenshots/a3-capitalize-bug-error1.png)

**Why the other tests still passed:** `"hello"`, `"a"`, `"hello2world"`, `"!hello"` — all inputs were already lowercase, so removing `.toLowerCase()` had no effect. `""` and `null` — early return, never reaches the logic.

**Fix:** restore `.toLowerCase()` on `str.slice(index + 1)`.

---

## A4 — TDD: sortStudents

`sortStudents(students, sortBy, order)` sorts an array of `{ name, grade, age }` objects by any field in ascending or descending order. Built using strict TDD: each test was written first (RED), then the minimum code was written to make it pass (GREEN).

**Signature:**
```js
sortStudents(students, sortBy, order = 'asc')
```

| Parameter | Type | Description |
|---|---|---|
| `students` | `array` | Array of `{ name, grade, age }` objects |
| `sortBy` | `string` | `"name"`, `"grade"` or `"age"` |
| `order` | `string` | `"asc"` (default) or `"desc"` |

**Tests written:**

| # | Test | Result |
|---|---|---|
| 1 | should sort students by grade ascending | RED → GREEN |
| 2 | should sort students by grade descending | RED → GREEN |
| 3 | should sort students by name ascending | RED → GREEN |
| 4 | should sort students by age ascending | free test (GREEN) |
| 5 | should return empty array for null input | RED → GREEN |
| 6 | should return empty array for empty input | free test (GREEN) |
| 7 | should not modify the original array | free test (GREEN) |
| 8 | should default to ascending order when order is not specified | free test (GREEN) |

### Red/Green cycles

**Test 1 — sort by grade ascending**

RED: function didn't exist yet → `TypeError: sortStudents is not a function`

![sort by grade asc RED](docs/screenshots/a4-sort-by-grade-asc-red.png)

GREEN: implemented minimum — sort by `grade` ascending only, `order` ignored.

---

**Test 2 — sort by grade descending**

RED: `order` parameter ignored → result was ascending instead of descending.

![sort by grade desc RED](docs/screenshots/a4-sort-by-grade-desc-red.png)

GREEN: added `order === 'asc'` condition to reverse comparison.

---

**Test 3 — sort by name ascending**

RED: `sortBy` parameter ignored, always sorted by `grade`.

![sort by name asc RED](docs/screenshots/a4-sort-by-name-asc-red.png)

GREEN: replaced `a.grade` with `a[sortBy]` to support any field.

---

**Tests 4, 6, 7, 8 — age / empty / original / default order**

These were **free tests** — the existing implementation already handled these cases correctly. No code change needed.

---

**Test 5 — null input**

RED: `null` passed to spread operator → `TypeError: students is not iterable`

![null input RED](docs/screenshots/a4-null-input-red.png)

GREEN: added `if (!students) return []` guard.

---

## A5 — parsePrice

Converts a price in various formats to a number.

```js
parsePrice(input)
```

| Input | Expected output |
|---|---|
| `"12.99"` | `12.99` |
| `"12,99"` | `12.99` |
| `"12.99 €"` | `12.99` |
| `"€12.99"` | `12.99` |
| `12.99` (number) | `12.99` |
| `"gratuit"` | `0` |
| `"abc"` | `null` |
| `"-5.00"` | `null` |
| `null` | `null` |

**Logic:**
1. `null` / `undefined` → `null`
2. Number → negative returns `null`, otherwise return as-is
3. String `"gratuit"` → `0`
4. String → strip `€`, replace `,` with `.`, parse float → `NaN` or negative returns `null`

---

## A6 — groupBy

Groups an array of objects by the value of a given key. Built using TDD.

```js
groupBy(array, key)
```

| Parameter | Type | Description |
|---|---|---|
| `array` | `array` | Array of objects to group |
| `key` | `string` | The key to group by |

**Tests written:**

| # | Test | Result |
|---|---|---|
| 1 | should group objects by a key with multiple groups | RED → GREEN |
| 2 | should group objects by any given key | RED → GREEN |
| 3 | should return `{}` when given an empty array | free test |
| 4 | should return `{}` when given null | RED → GREEN |
| 5 | should throw a TypeError when key does not exist on objects | RED → GREEN |
| 6 | should correctly group when key value is falsy (0) | free test |
| 7 | should throw a TypeError when key value is null | RED → GREEN |
| 8 | should preserve the order of items within each group | free test |
| 9 | should group 1 and "1" into the same group (JS key coercion) | RED → GREEN |
| 10 | should not modify the original array | free test |

### Red/Green cycles

**Test 1 — multiple groups**

RED: function didn't exist → `TypeError: groupBy is not a function`

![groupBy multiple groups RED](docs/screenshots/a6-group-by-multiple-groups-red.png)

GREEN: implemented with `for...of` loop, hardcoded `item.role`.

---

**Test 2 — any key**

RED: `sortBy` hardcoded to `role` → result grouped by `role` instead of `department`.

![groupBy any key RED](docs/screenshots/a6-group-by-any-key-red.png)

GREEN: replaced `item.role` with `item[key]`.

---

**Test 4 — null input**

RED: `for...of null` → `TypeError: array is not iterable`

![groupBy null input RED](docs/screenshots/a6-null-input-red.png)

GREEN: added `if (!array) return {}` guard.

---

**Test 5 — unknown key**

RED: function returned `{ undefined: [...] }` instead of throwing.

![groupBy unknown key RED](docs/screenshots/a6-unknown-key-red.png)

GREEN: added `if (!(key in item)) throw new TypeError(...)`.

---

**Test 7 — null key value**

RED: function grouped items under `"null"` instead of throwing.

![groupBy null key value RED](docs/screenshots/a6-null-key-value-red.png)

GREEN: added `if (group === null || group === undefined) throw new TypeError(...)`.

---

**Test 9 — type coercion**

RED: `1` and `"1"` were expected to be different groups but JS coerces object keys to strings.

![groupBy type coercion RED](docs/screenshots/a6-type-coercion-red.png)

GREEN: updated the test to document the real behavior — `1` and `"1"` end up in the same group `"1"`. No code change needed.

---

## A7 — calculateDiscount

Applies cumulative discount rules to a price. Rules are applied in order. The result cannot be negative.

```js
calculateDiscount(price, discountRules)
```

**Rule types:**

| Type | Fields | Description |
|---|---|---|
| `percentage` | `value` | Reduces price by a percentage |
| `fixed` | `value` | Reduces price by a fixed amount |
| `buyXgetY` | `buy`, `free`, `itemPrice` | Every N items bought, M items are free |

### percentage rules

| # | Test | Result |
|---|---|---|
| 1 | should apply a percentage discount | RED → GREEN |
| 2 | should return original price when percentage value is 0 | free test |
| 3 | should return 0 when percentage value is 100 | free test |
| 4 | should return 0 when percentage discount exceeds the price | RED → GREEN |
| 5 | should apply multiple percentage discounts cumulatively | free test |
| 6 | should throw a TypeError when percentage value is not a number | RED → GREEN |
| 7 | should throw a TypeError when percentage value is negative | RED → GREEN |
| 8 | should throw a TypeError when price is negative | RED → GREEN |
| 9 | should throw a TypeError when price is null | RED → GREEN |
| 10 | should throw a TypeError when rules is null | free test |
| 11 | should return original price when rules is empty | free test |

**Red/Green cycles:**

**Test 1 — percentage discount**

RED: function didn't exist → `TypeError: calculateDiscount is not a function`

![calculateDiscount percentage RED](docs/screenshots/a7-percentage-discount-red.png)

GREEN: implemented loop over rules, handle `percentage` type only.

---

**Test 4 — discount exceeds price**

RED: `value: 150` → result was `-50` instead of `0`.

![calculateDiscount exceeds price RED](docs/screenshots/a7-percentage-exceeds-price-red.png)

GREEN: added `Math.max(0, result)` at the end.

---

**Test 6 — value not a number**

RED: function returned `NaN` silently instead of throwing.

![calculateDiscount value not number RED](docs/screenshots/a7-percentage-value-not-number-red.png)

GREEN: added `typeof rule.value !== 'number'` check.

---

**Test 7 — negative value**

RED: function applied a negative discount (price increased) instead of throwing.

![calculateDiscount negative value RED](docs/screenshots/a7-negative-percentage-value-red.png)

GREEN: added `rule.value < 0` check.

---

**Test 8 — negative price**

RED: function returned a result instead of throwing.

![calculateDiscount negative price RED](docs/screenshots/a7-negative-price-red.png)

GREEN: added `price < 0` guard.

---

**Test 9 — null price**

RED: function returned `NaN` instead of throwing.

![calculateDiscount null price RED](docs/screenshots/a7-null-price-red.png)

GREEN: added `price === null || price === undefined` guard.

### fixed rules

| # | Test | Result |
|---|---|---|
| 1 | should apply a fixed discount | RED → GREEN |
| 2 | should return 0 when fixed discount exceeds the price | free test |
| 3 | should throw a TypeError when fixed value is negative | RED → GREEN |
| 4 | should apply percentage then fixed discount in order | free test |

**Red/Green cycles:**

**Test 1 — fixed discount**

RED: `fixed` type not handled → price unchanged, returned `100` instead of `95`.

![calculateDiscount fixed RED](docs/screenshots/a7-fixed-discount-red.png)

GREEN: added `else if (rule.type === 'fixed')` branch.

---

**Test 3 — negative fixed value**

RED: function applied a negative fixed discount (price increased) instead of throwing.

![calculateDiscount negative fixed RED](docs/screenshots/a7-negative-fixed-value-red.png)

GREEN: added `rule.value < 0` check in the `fixed` branch.

### buyXgetY rules

For every group of `buy + free` items, `free` items are free. Quantity is derived from `price / itemPrice`.

| # | Test | Result |
|---|---|---|
| 1 | should apply a buyXgetY discount | RED → GREEN |
| 2 | should return original price when quantity is not enough | free test |
| 3 | should apply buyXgetY multiple times when quantity allows it | free test |
| 4 | should apply buyXgetY then percentage in order | free test |
| 5 | should return original price when free is 0 | free test |
| 6 | should handle price not divisible by itemPrice | free test |
| 7 | should throw TypeError when itemPrice is not a number | RED → GREEN |
| 8 | should throw TypeError when buy is not a number | free test |
| 9 | should throw TypeError when free is not a number | free test |
| 10 | should throw TypeError when itemPrice is 0 | free test |
| 11 | should throw TypeError when buy is 0 | free test |

**Red/Green cycles:**

**Test 1 — buyXgetY discount**

RED: `buyXgetY` type not handled → price unchanged, returned `40` instead of `30`.

![calculateDiscount buyXgetY RED](docs/screenshots/a7-buyxgety-discount-red.png)

GREEN: added `buyXgetY` branch — derive quantity from `price / itemPrice`, compute free items, subtract discount.

---

**Test 7 — itemPrice not a number**

RED: function returned `NaN` silently instead of throwing.

![calculateDiscount buyXgetY itemPrice not number RED](docs/screenshots/a7-buyxgety-itemprice-not-number-red.png)

GREEN: added type checks for `itemPrice`, `buy`, `free` and value checks for `itemPrice > 0` and `buy > 0`.

---

**Unknown rule type**

RED: function silently ignored unknown rule types instead of throwing.

![calculateDiscount unknown rule type RED](docs/screenshots/a7-unknown-rule-type-red.png)

GREEN: added `else` branch that throws `TypeError`.

---

## B1 — calculateDeliveryFee

Computes the delivery fee from a distance (km) and weight (kg). Built using TDD.

```js
calculateDeliveryFee(distance, weight)
```

**Pricing rules:**

| Condition | Rule |
|---|---|
| `distance === 0` | Click & collect — fee is `0.00` (no weight surcharge) |
| `distance > 10` | Throws `RangeError` — delivery unavailable |
| `distance < 0` or `weight < 0` | Throws `TypeError` |
| Either argument is not a number | Throws `TypeError` |
| Base fee | `2.00` for any distance ≤ 3 km |
| Distance surcharge | `+0.50` per km beyond 3 km |
| Weight surcharge | `+1.50` if weight > 5 kg |

**Tests written:**

| # | Test | Result |
|---|---|---|
| 1 | should return 2.00 when distance is 2 km and weight is 1 kg | RED → GREEN |
| 2 | should throw a TypeError when distance is not a number | RED → GREEN |
| 3 | should throw a TypeError when weight is not a number | free test |
| 4 | should return 2.00 when weight is 0 | free test |
| 5 | should return 2.25 when distance is 3.5 km | RED → GREEN |
| 6 | should return 3.50 when weight is 5.1 kg and distance is 2 km | RED → GREEN |
| 7 | should return 0.00 when distance is 0 (click & collect) | RED → GREEN |
| 8 | should throw a TypeError when weight is negative | RED → GREEN |
| 9 | should throw a RangeError when distance is greater than 10 km | RED → GREEN |
| 10 | should throw a TypeError when distance is negative | RED → GREEN |
| 11 | should return 2.00 when distance is 2 km and weight is exactly 5 kg | free test |
| 12 | should return 7.00 when distance is 10 km and weight is 6 kg | free test |
| 13 | should return 4.50 when distance is 5 km and weight is 8 kg | free test |
| 14 | should return 5.50 when distance is exactly 10 km | free test |
| 15 | should return 2.00 when distance is exactly 3 km | free test |
| 16 | should return 3.50 when distance is 6 km and weight is 2 kg | free test |
| 17 | should return 4.00 when distance is 7 km and weight is 3 kg | free test |

### Red/Green cycles

**Test 1 — base fee**

RED: function didn't exist → `TypeError: calculateDeliveryFee is not a function`

![base fee RED](docs/screenshots/b1-delivery-fee-base-red.png)

GREEN: created function, hardcoded `return 2.00`.

---

**Test 2 — distance not a number**

RED: no type check → function silently returned `NaN`.

![not a number RED](docs/screenshots/b1-delivery-fee-not-a-number-red.png)

GREEN: added `typeof distance !== 'number'` and `typeof weight !== 'number'` checks.

---

**Test 5 — distance surcharge**

RED: always returned `2.00` regardless of distance.

![distance surcharge RED](docs/screenshots/b1-delivery-fee-distance-red.png)

GREEN: added `if (distance > 3) fee += (distance - 3) * 0.50`.

---

**Test 6 — weight surcharge**

RED: weight ignored → returned `2.00` instead of `3.50`.

![weight surcharge RED](docs/screenshots/b1-delivery-fee-weight-red.png)

GREEN: added `if (weight > 5) fee += 1.50`.

---

**Test 7 — click & collect**

RED: distance=0 was treated as a normal delivery → returned `2.00` instead of `0.00`.

![click and collect RED](docs/screenshots/b1-delivery-fee-click-and-collect-red.png)

GREEN: added `if (distance === 0) return 0.00` before the base fee.

---

**Test 8 — negative weight**

RED: negative weight passed silently → no error thrown.

![negative weight RED](docs/screenshots/b1-delivery-fee-negative-weight-red.png)

GREEN: added `if (weight < 0) throw new TypeError(...)`.

---

**Test 9 — distance out of range**

RED: distance > 10 returned a fee instead of throwing.

![out of range RED](docs/screenshots/b1-delivery-fee-out-of-range-red.png)

GREEN: added `if (distance > 10) throw new RangeError(...)`.

---

**Test 10 — negative distance**

RED: negative distance was being accepted silently.

![negative distance RED](docs/screenshots/b1-delivery-fee-negative-distance-red.png)

GREEN: added `if (distance < 0) throw new TypeError(...)`.

---

**Tests 3, 4, 11–17 — boundary and combination cases**

These were **free tests** — the implementation already covered these cases correctly. No code change needed.

---

## Issues encountered

**ESLint — `require` / `module` / `process` not defined**

ESLint v9 does not assume any runtime environment by default. It flagged Node.js globals (`require`, `module`, `process`, `console`) as undefined.

Fix: explicitly declare the Node.js globals in `eslint.config.js` using the `globals` package:

```js
const globals = require('globals');

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

Fix: add a `.replace(/^-+|-+$/g, '')` step to strip leading and trailing dashes after cleanup.

---

**slugify — double dash when a special character is surrounded by spaces**

Input `"hello ! world"` was producing `"hello--world"` instead of `"hello-world"`.

Root cause: spaces were replaced by dashes before special characters were removed — `"hello-!-world"` → `"hello--world"`.

Fix: remove special characters **before** replacing spaces with dashes:

```js
return text
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '') // remove special chars first
  .replace(/\s+/g, '-')          // then replace spaces
  .replace(/^-+|-+$/g, '');      // strip leading/trailing dashes
```

---

**clamp — non-number arguments produce NaN silently**

`clamp('a', 0, 10)` would return `NaN` without error because `Math.max('a', 0)` propagates `NaN` silently in JavaScript.

Fix: validate all three arguments upfront and throw a `TypeError` if any is not a number:

```js
if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
  throw new TypeError('value, min and max must be numbers');
}
```

---

**capitalize — special character at the start**

`"!hello"` was producing `"!hello"` instead of `"!Hello"` because `charAt(0)` was targeting `!`, not the first letter.

Fix: use `str.search(/[a-zA-Z]/)` to find the index of the first alphabetic character:

```js
const index = str.search(/[a-zA-Z]/);
if (index === -1) return str;
return str.slice(0, index) + str[index].toUpperCase() + str.slice(index + 1).toLowerCase();
```
