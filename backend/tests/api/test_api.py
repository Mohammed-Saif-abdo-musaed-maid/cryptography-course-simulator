"""API route tests using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


class TestHealth:
    def test_health(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"

    def test_docs_available(self):
        assert client.get("/docs").status_code == 200


class TestCatalog:
    def test_catalog_has_47_algorithms(self):
        response = client.get("/api/algorithms")
        assert response.status_code == 200
        body = response.json()
        assert len(body["algorithms"]) == 47
        ids = {a["id"] for a in body["algorithms"]}
        expected = {"caesar", "vigenere", "playfair", "hill", "rail_fence",
                    "columnar", "monoalphabetic", "des", "aes", "triple_des",
                    "blowfish", "twofish", "chacha20",
                    "rsa", "diffie_hellman", "elgamal", "sha256", "sha512",
                    "sha1", "md5", "sha3", "blake2", "blake3",
                    "aes_gcm", "chacha20_poly1305", "hmac", "pbkdf2",
                    "bcrypt", "scrypt", "argon2", "hkdf", "ecdh", "x25519",
                    "ecdsa", "ed25519",
                    # Phase 5 additions.
                    "aes_cbc", "aes_ctr", "aes_ccm", "camellia", "cmac",
                    "poly1305", "x448", "dsa", "rsa_pss",
                    "sha224", "sha384", "ripemd160"}
        assert ids == expected

    def test_categories_summary(self):
        body = client.get("/api/algorithms").json()["categories"]
        assert body["total"] == 47
        assert body["classical"] == 7
        assert body["symmetric"] == 9
        assert body["asymmetric"] == 2
        assert body["key_exchange"] == 4
        assert body["hashing"] == 10
        assert body["mac"] == 3
        assert body["kdf"] == 5
        assert body["aead"] == 3
        assert body["signature"] == 4

    def test_algorithm_detail(self):
        response = client.get("/api/algorithms/aes")
        assert response.status_code == 200
        assert response.json()["security_status"] == "secure"
        assert response.json()["category"] == "symmetric"

    def test_unknown_algorithm_detail(self):
        response = client.get("/api/algorithms/nope")
        assert response.status_code == 422


class TestExecute:
    def test_caesar_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "caesar", "operation": "encrypt",
            "inputs": {"text": "HELLO", "shift": 3},
        })
        assert response.status_code == 200
        body = response.json()
        assert body["result"] == "KHOOR"
        assert body["steps"]

    def test_aes_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "aes", "operation": "encrypt",
            "inputs": {"block": "00112233445566778899AABBCCDDEEFF",
                       "key": "000102030405060708090A0B0C0D0E0F"},
        })
        assert response.status_code == 200
        assert response.json()["result"].replace(" ", "") == \
            "69c4e0d86a7b0430d8cdb78070b4c55a"

    def test_blowfish_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "blowfish", "operation": "encrypt",
            "inputs": {"block": "4E6F772069732074",
                       "key": "0123456789ABCDEFFEDCBA9876543210"},
        })
        assert response.status_code == 200
        assert response.json()["result"].replace(" ", "").upper() == \
            "E7BC6B4D8A90B712"

    def test_twofish_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "twofish", "operation": "encrypt",
            "inputs": {"block": "00000000000000000000000000000000",
                       "key": "00000000000000000000000000000000"},
        })
        assert response.status_code == 200
        assert response.json()["result"].replace(" ", "").upper() == \
            "9F589F5CF6122C32B6BFEC2F2AE8C35A"

    def test_twofish_256_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "twofish", "operation": "encrypt",
            "inputs": {"block": "00000000000000000000000000000000",
                       "key": "0" * 64},
        })
        assert response.status_code == 200
        assert response.json()["result"].replace(" ", "").upper() == \
            "57FF739D4DC92C1BD7FC01700CC8216F"

    def test_chacha20_encrypt(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "chacha20", "operation": "encrypt",
            "inputs": {
                "message": "Ladies and Gentlemen of the class of '99: If I ",
                "key": "000102030405060708090A0B0C0D0E0F"
                       "101112131415161718191A1B1C1D1E1F",
                "nonce": "000000000000004A00000000",
                "counter": 1,
            },
        })
        assert response.status_code == 200
        assert response.json()["result"]

    def test_sha256_hash(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "sha256", "operation": "hash",
            "inputs": {"message": "abc"},
        })
        assert response.status_code == 200
        assert response.json()["result"] == \
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"

    def test_diffie_hellman(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "diffie_hellman", "operation": "exchange",
            "inputs": {"p": 23, "g": 5, "a_private": 6, "b_private": 15},
        })
        assert response.status_code == 200
        assert response.json()["extra"]["shared_secret_match"] is True

    def test_invalid_input_returns_structured_error(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "caesar", "operation": "encrypt",
            "inputs": {"text": "HELLO", "shift": -5},
        })
        assert response.status_code == 422
        body = response.json()
        assert "error" in body and "message" in body
        assert body["error"] == "invalid_input"

    def test_unknown_algorithm(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "x", "operation": "encrypt",
            "inputs": {"text": "HI"},
        })
        assert response.status_code == 422
        assert response.json()["error"] == "unknown_algorithm"

    def test_unsupported_operation(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "caesar", "operation": "hash",
            "inputs": {"text": "HI", "shift": 1},
        })
        assert response.status_code == 422
        assert response.json()["error"] == "unsupported_operation"

    def test_missing_required_input(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "caesar", "operation": "encrypt",
            "inputs": {"shift": 3},
        })
        assert response.status_code == 422

    def test_no_stack_trace_leaked(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "hill", "operation": "encrypt",
            "inputs": {"text": "HI", "matrix": [[2, 4], [1, 3]]},
        })
        assert response.status_code == 422
        text = response.text
        assert "Traceback" not in text
        assert "File \"" not in text

    def test_matrix_coercion(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "hill", "operation": "encrypt",
            "inputs": {"text": "HELP", "matrix": [[3, 3], [2, 5]]},
        })
        assert response.status_code == 200
        assert response.json()["result"] == "HIAT"


class TestMathematics:
    def test_modular(self):
        response = client.post("/api/math/modular", json={"a": 17, "b": 5, "modulus": 6})
        assert response.status_code == 200
        assert response.json()["result"]["sum"] == 4

    def test_gcd(self):
        response = client.post("/api/math/gcd", json={"a": 48, "b": 18})
        assert response.json()["result"] == 6

    def test_extended_euclid(self):
        response = client.post("/api/math/extended-euclid", json={"a": 240, "b": 46})
        assert response.json()["extra"]["result"]["gcd"] == 2
        assert response.json()["extra"]["result"]["x"] < 0  # -9 verified identity

    def test_modular_inverse(self):
        response = client.post("/api/math/modular-inverse", json={"a": 3, "modulus": 11})
        assert response.json()["result"] == 4

    def test_modular_inverse_fails(self):
        response = client.post("/api/math/modular-inverse", json={"a": 2, "modulus": 4})
        assert response.status_code == 422

    def test_prime_check(self):
        response = client.post("/api/math/prime-check", json={"n": 97})
        assert response.json()["result"] is True

    def test_totient(self):
        response = client.post("/api/math/totient", json={"n": 10})
        assert response.json()["result"] == 4

    def test_mod_pow(self):
        response = client.post("/api/math/mod-pow",
                               json={"base": 4, "exponent": 13, "modulus": 497})
        assert response.json()["result"] == 445


class TestExercises:
    def test_list_exercises(self):
        response = client.get("/api/exercises")
        assert response.status_code == 200
        body = response.json()
        assert body["total"] >= 18
        # Answers hidden.
        for exercise in body["exercises"]:
            assert "answer" not in exercise

    def test_check_correct(self):
        response = client.post("/api/exercises/caesar-1/check", json={"answer": "KHOOR"})
        assert response.json()["correct"] is True

    def test_check_incorrect(self):
        response = client.post("/api/exercises/caesar-1/check", json={"answer": "MJQQT"})
        assert response.json()["correct"] is False
        assert "explanation" in response.json()


class TestQuizzes:
    def test_generate_questions(self):
        response = client.get("/api/quizzes/questions?category=classical&count=5")
        assert response.status_code == 200
        questions = response.json()["questions"]
        assert len(questions) == 5
        for q in questions:
            assert "answer" not in q

    def test_grade(self):
        response = client.post("/api/quizzes/check", json={
            "category": "mathematics",
            "answers": {"q-math-1": "2", "q-math-2": "6"},
        })
        body = response.json()
        assert body["score"] == 2
        assert body["total"] == 2
        assert body["percentage"] == 100.0

    def test_grade_partial(self):
        response = client.post("/api/quizzes/check", json={
            "category": "mathematics",
            "answers": {"q-math-1": "2", "q-math-2": "3"},
        })
        assert response.json()["score"] == 1
