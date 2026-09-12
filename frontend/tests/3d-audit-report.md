# 3D Audit Report

Generated: 2026-09-11T14:22:19.055563+00:00

| Algorithm | Status | Fixture in All | Fixture in Final | Engine in All | Engine in Final | Meta | Roundtrip |
|-----------|--------|----------------|------------------|---------------|-----------------|------|-----------|
| caesar | PASS | Y | Y | Y | Y | N | Y |
| monoalphabetic | PASS | Y | Y | Y | Y | Y | Y |
| vigenere | PASS | Y | Y | Y | Y | Y | Y |
| playfair | PASS | Y | Y | Y | Y | Y | Y |
| hill | PASS | Y | Y | Y | Y | Y | Y |
| rail_fence | PASS | Y | Y | Y | Y | Y | Y |
| columnar | PASS | Y | Y | Y | Y | Y | Y |
| des | PASS | Y | Y | Y | Y | Y | Y |
| triple_des | PASS | Y | Y | Y | Y | Y | Y |
| aes | PASS | Y | Y | Y | Y | Y | Y |
| blowfish | PASS | Y | Y | Y | Y | Y | Y |
| twofish | PASS | Y | Y | Y | Y | Y | Y |
| chacha20 | PASS | Y | Y | Y | Y | Y | Y |
| aes_gcm | PASS | N | N | Y | Y | Y | Y |
| chacha20_poly1305 | PASS | N | N | Y | Y | Y | Y |
| sha256 | PASS | Y | Y | Y | Y | Y | — |
| sha512 | PASS | Y | Y | Y | Y | Y | — |
| sha1 | PASS | Y | Y | Y | Y | Y | — |
| md5 | PASS | Y | Y | Y | Y | Y | — |
| sha3 | PASS | Y | Y | Y | Y | Y | — |
| blake2 | PASS | Y | Y | Y | Y | Y | — |
| blake3 | PASS | Y | Y | Y | Y | Y | — |
| hmac | PASS | Y | Y | Y | Y | Y | — |
| pbkdf2 | PASS | Y | Y | — | — | Y | — |
| bcrypt | PASS | Y | Y | Y | Y | Y | — |
| scrypt | PASS | Y | Y | — | — | Y | — |
| argon2 | PASS | N | N | — | — | Y | — |
| hkdf | PASS | N | N | — | — | Y | — |
| ecdh | PASS | Y | Y | Y | Y | Y | — |
| x25519 | PASS | Y | Y | Y | Y | Y | — |
| ecdsa | PASS | Y | N | — | — | Y | — |
| ed25519 | PASS | Y | Y | — | — | Y | — |
| rsa | PASS | Y | N | Y | Y | Y | Y |
| diffie_hellman | PASS | Y | Y | — | — | Y | — |
| elgamal | WARN | N | N | — | — | Y | N |

**Totals:** 34 PASS, 0 FAIL, 1 WARN, 0 ERROR (of 35)