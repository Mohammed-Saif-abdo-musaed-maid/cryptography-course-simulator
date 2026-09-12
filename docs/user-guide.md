# User Guide

## Getting oriented

Open the **Dashboard** for an overview: algorithm counts per category, quick
launch links and a full comparison table.

Use the **sidebar**:

| Section    | What you'll find                                   |
| ---------- | ------------------------------------------------- |
| Course     | Reading path through the theory topics            |
| Laboratory | Playground, Compare, Mathematics Lab              |
| Practice   | Exercises and Quiz Arena                          |
| Categories | One page per algorithm (23 pages)                 |
| Settings   | Language switching (العربية / English)            |
| Docs       | Architecture, API reference, curl examples        |

## Simulating an algorithm

1. Open any algorithm page (e.g. **Caesar**).
2. Choose an operation — `encrypt`, `decrypt`, or algorithm-specific extras
   like `brute_force` / `generate_keys` / `exchange`.
3. Fill the form (fields adapt to the algorithm; defaults are provided).
4. Press **Run**. You get:
   - a green verification banner with the result,
   - a copyable result card,
   - an optional **Step-by-step execution** list with inputs/outputs and
     matrices for every stage (e.g. AES round states, DES S-box detail, DH
     shared-secret derivation).

## Known examples to try

| Algorithm     | Input                       | Expected                                  |
| ------------- | --------------------------- | ----------------------------------------- |
| Caesar        | `HELLO`, shift 3            | `KHOOR`                                   |
| Vigenère      | `ATTACKATDAWN`, key `LEMON` | `LXFOPVEFRNHR`                            |
| Playfair      | `HELLO`, keyword `MONARCHY` | `CFSUPM`                                  |
| Hill          | `HELP`, matrix `[[3,3],[2,5]]` | `HIAT`                                 |
| DES           | `0123456789ABCDEF` / key `133457799BBCDFF1` | `85E813540F0AB405` |
| SHA-256       | `abc`                       | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` |
| SHA-512       | `abc`                       | `ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f` |
| SHA-1         | `abc`                       | `a9993e364706816aba3e25717850c26c9cd0d89d` |
| MD5           | `abc`                       | `900150983cd24fb0d6963f7d28e17f72` |
| SHA-3         | `abc` (SHA3-256)            | `3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532` |
| BLAKE2        | `abc` (BLAKE2b-512)         | `ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923` |
| BLAKE3        | `abc` (32 bytes)            | `6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85` |

More vectors live in the **Examples** tab of each algorithm page.

## Mathematics Lab

Pick a tool (modular arithmetic, GCD, Extended Euclidean, modular inverse,
primality, totient, modular exponentiation) and get worked steps — useful for
hand-completing course problems.

## Exercises & Quizzes

- **Exercises** return instant feedback with explanations.
- **Quiz Arena** draws shuffled questions; answers are graded by *option text*
  so order never matters. Results show your score and per-question
  explanations.

## Language & display

The interface is **English by default**; switch to **العربية** in Settings or
via the language toggle in the navbar. Arabic switches the whole document to
RTL. Your choice is remembered locally.

## Troubleshooting

| Symptom                              | Fix                                                          |
| ------------------------------------ | ------------------------------------------------------------ |
| “Cannot reach the backend…” in UI   | Start `uvicorn app.main:app` on port 8000; confirm `VITE_API_URL`. |
| 422 on real-time requests            | Check required fields (red hint). Big RSA/ElGamal messages may exceed `n` — shorten the message. |
| `.venv` python not found on Windows  | Use `D:\cryptography-course-simulator\.venv\Scripts\python.exe`. |
| Ports in use                         | Change `BACKEND_PORT` / Vite `server.port`.                   |