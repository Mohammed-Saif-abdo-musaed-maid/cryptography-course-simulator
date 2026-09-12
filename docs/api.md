# API Reference

Base URL: `http://127.0.0.1:8000/api`. Interactive docs: `/docs` (Swagger UI).

## System

### `GET /health`

```json
{ "status": "ok", "app": "…", "version": "1.0.0" }
```

## Catalog

### `GET /algorithms`

Array of algorithms with `id`, `name`, `category`, `category_label`,
`operations`, `fields` (UI form specs: `type` ∈ `text|textarea|number|matrix`,
`required`, `default`, `min`, `max`, `placeholder`), `security_status`,
`reversible`, `key_kind`, `block_size`, `description`, `formula`, plus a
`categories` summary.

### `GET /algorithms/{id}`

Single algorithm metadata (used by the frontend to render the simulator card).

## Execution

### `POST /algorithms/execute`

Body:

```json
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "inputs": { "text": "HELLO", "shift": 3 }
}
```

Response — `AlgorithmResult`:

```json
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "input": "HELLO",
  "parameters": { "shift": 3 },
  "result": "KHOOR",
  "extra": { "ciphertext": "KHOOR", "mapping": [ … ] },
  "steps": [ { "step": 1, "title": "…", "description": "…",
               "input": "…", "output": "…", "detail": {…} } ]
}
```

Identical envelope for `math/*` results.

### Input conventions

- `text` field → `plaintext` for encrypt, `ciphertext` for decrypt.
- RSA decrypt: the `message` field carries the cipher integer; `p`/`q` (and
  optionally `e`) are required. `decrypt` also works with method-specific
  `cipher` for ElGamal.
- ElGamal decrypt: `p, g, x, c1, c2`.
- Keys for DES/3DES/AES are hex strings (16/48/32|48|64 digits respectively).

### Errors

Structured error payload with status 422/500:

```json
{ "error": "missing_input", "message": "'Shift (k)' is required", "status": 422, "path": "/api/algorithms/execute" }
```

| Field    | Meaning                                              |
| -------- | ---------------------------------------------------- |
| `error`  | Machine-readable code (`unknown_algorithm`, `unsupported_operation`, `message_too_large`, `invalid_cipher`, `no_inverse`, …) |
| `message`| Human-readable, UI-safe message                     |
| `status` | HTTP status                                          |
| `path`   | Request path                                         |

## Mathematics

### `POST /math/{tool}`

Tools: `modular`, `gcd`, `extended-euclid`, `modular-inverse`, `prime-check`,
`totient`, `mod-pow`.

| Tool               | Body                                        | Example            |
| ------------------ | ------------------------------------------- | ------------------ |
| `modular`          | `{"a":…,"b":…,"modulus":…}`                 | `17,9,5`           |
| `gcd` / `extended-euclid` | `{"a":…,"b":…}`                    | `270,192`          |
| `modular-inverse`  | `{"a":…,"modulus":…}`                       | `3,11 → 4`         |
| `prime-check`      | `{"n":…}`                                   |                    |
| `totient`          | `{"n":…}`                                   | `36 → 12`          |
| `mod-pow`          | `{"base":…,"exponent":…,"modulus":…}`       | `4,13,497`         |

## Practice

### `GET /exercises?category=all|classical|symmetric|…`

Returns an exercise list (answers hidden).

### `POST /exercises/{id}/check`

```json
{ "answer": "KHOOR" }
```

→ `{ "exercise_id", "correct", "expected", "submitted", "explanation" }`

### `GET /quizzes/questions?category=mixed&difficulty=mixed&count=8`

Questions come with shuffled `options`; answers are never included.

### `POST /quizzes/check`

```json
{ "category": "mathematics", "difficulty": "easy",
  "answers": { "q-math-1": "2" } }
```

Answers are keyed by question id → **option text** (shuffle-independent).
Returns `{ score, total, percentage, details[] }` where each detail includes
`correct_answer` and `explanation`.