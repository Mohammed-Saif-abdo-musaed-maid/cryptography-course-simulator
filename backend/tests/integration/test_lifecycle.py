"""End-to-end integration tests: full API lifecycle for key scenarios."""

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def _execute(algorithm, operation, inputs):
    response = client.post("/api/algorithms/execute", json={
        "algorithm": algorithm, "operation": operation, "inputs": inputs})
    assert response.status_code == 200, response.text
    return response.json()


class TestClassicalLifecycle:
    def test_caesar_full_flow(self):
        enc = _execute("caesar", "encrypt", {"text": "SECRET MESSAGE", "shift": 4})
        assert enc["result"] == "WIGVIX QIWWEKI"
        dec = _execute("caesar", "decrypt", {"text": enc["result"], "shift": 4})
        assert dec["result"] == "SECRET MESSAGE"

    def test_vigenere_full_flow(self):
        enc = _execute("vigenere", "encrypt", {"text": "CRYPTOGRAPHY", "key": "SECRET"})
        dec = _execute("vigenere", "decrypt", {"text": enc["result"], "key": "SECRET"})
        assert dec["result"] == "CRYPTOGRAPHY"

    def test_playfair_full_flow(self):
        enc = _execute("playfair", "encrypt", {"text": "MEETING", "keyword": "KEYWORD"})
        dec = _execute("playfair", "decrypt", {"text": enc["result"], "keyword": "KEYWORD"})
        assert dec["result"].startswith("MEETIN")

    def test_hill_full_flow(self):
        enc = _execute("hill", "encrypt", {"text": "HELP", "matrix": [[3, 3], [2, 5]]})
        dec = _execute("hill", "decrypt", {"text": enc["result"], "matrix": [[3, 3], [2, 5]]})
        assert dec["result"] == "HELP"


class TestModernLifecycle:
    def test_aes_roundtrip_through_api(self):
        block = "00112233445566778899AABBCCDDEEFF"
        key = "000102030405060708090A0B0C0D0E0F"
        enc = _execute("aes", "encrypt", {"block": block, "key": key})
        dec = _execute("aes", "decrypt", {"block": enc["result"].replace(" ", ""),
                                          "key": key})
        assert dec["result"].replace(" ", "").lower() == block.lower()

    def test_des_roundtrip_through_api(self):
        block, key = "0123456789ABCDEF", "133457799BBCDFF1"
        enc = _execute("des", "encrypt", {"block": block, "key": key})
        dec = _execute("des", "decrypt", {"block": enc["result"].replace(" ", ""),
                                          "key": key})
        assert dec["result"].replace(" ", "").lower() == block.lower()

    def test_rsa_roundtrip_through_api(self):
        enc = _execute("rsa", "encrypt", {"message": "HI", "p": 61, "q": 53})
        dec = _execute("rsa", "decrypt", {"p": 61, "q": 53,
                                          "message": int(enc["result"])})
        assert dec["result"] == "HI"

    def test_dh_matching_secret_through_api(self):
        result = _execute("diffie_hellman", "exchange",
                          {"p": 23, "g": 5, "a_private": 6, "b_private": 15})
        assert result["extra"]["shared_secret_match"] is True

    def test_elgamal_roundtrip_through_api(self):
        enc = _execute("elgamal", "encrypt", {"message": "HI", "p": 467, "g": 2,
                                              "x": 127})
        dec = _execute("elgamal", "decrypt",
                       {"p": 467, "g": 2, "x": 127,
                        "c1": enc["extra"]["cipher"]["c1"],
                        "c2": enc["extra"]["cipher"]["c2"]})
        assert dec["result"] == "HI"

    def test_sha256_hash_through_api(self):
        result = _execute("sha256", "hash", {"message": "abc"})
        assert result["result"] == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"


class TestStepEngine:
    def test_steps_are_structured_across_algorithms(self):
        scenarios = [
            ("caesar", "encrypt", {"text": "HI", "shift": 3}),
            ("vigenere", "encrypt", {"text": "HI", "key": "AB"}),
            ("aes", "encrypt", {"block": "00112233445566778899AABBCCDDEEFF",
                                "key": "000102030405060708090A0B0C0D0E0F"}),
            ("diffie_hellman", "exchange",
             {"p": 23, "g": 5, "a_private": 6, "b_private": 15}),
            ("rsa", "encrypt", {"message": "HI", "p": 61, "q": 53}),
        ]
        for algorithm, operation, inputs in scenarios:
            result = _execute(algorithm, operation, inputs)
            assert result["steps"], f"no steps for {algorithm}"
            for s in result["steps"]:
                assert "step" in s and "title" in s and "output" in s
                assert isinstance(s["title"], str) and s["title"]

    def test_step_count_is_sequential(self):
        result = _execute("caesar", "encrypt", {"text": "HI", "shift": 3})
        numbers = [s["step"] for s in result["steps"]]
        assert numbers == list(range(1, len(numbers) + 1))


class TestErrorHandling:
    def test_bad_json_returns_422(self):
        response = client.post("/api/algorithms/execute", json={
            "algorithm": "caesar", "operation": "encrypt", "inputs": {"shift": "x"}})
        assert response.status_code == 422
        assert "message" in response.json()

    def test_health_after_failures(self):
        # The app must remain healthy after errors.
        client.post("/api/algorithms/execute", json={
            "algorithm": "hill", "operation": "encrypt",
            "inputs": {"text": "HI", "matrix": [[2, 4], [1, 3]]}})
        assert client.get("/api/health").status_code == 200
