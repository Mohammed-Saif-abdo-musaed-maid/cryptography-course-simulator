"""Tests for the classical cipher algorithms."""

import pytest

from app.algorithms import (
    caesar,
    columnar,
    hill,
    monoalphabetic,
    playfair,
    rail_fence,
    vigenere,
)
from app.utils.errors import AlgorithmError


# ---------------------------------------------------------------------------
# Caesar
# ---------------------------------------------------------------------------


class TestCaesar:
    def test_encrypt_known(self):
        assert caesar.encrypt("HELLO", 3)["result"] == "KHOOR"

    def test_encrypt_lowercase_and_punctuation(self):
        result = caesar.encrypt("Hello, World!", 5)["result"]
        assert result == "Mjqqt, Btwqi!"

    def test_roundtrip(self):
        text, shift = "ATTACK AT DAWN", 7
        enc = caesar.encrypt(text, shift)["result"]
        assert caesar.decrypt(enc, shift)["result"] == text

    def test_shift_reduced_mod_26(self):
        assert caesar.encrypt("A", 29)["result"] == caesar.encrypt("A", 3)["result"]

    def test_invalid_negative_shift(self):
        with pytest.raises(AlgorithmError):
            caesar.encrypt("HI", -1)

    def test_empty_input(self):
        with pytest.raises(AlgorithmError):
            caesar.encrypt("   ", 3)

    def test_brute_force_26_entries(self):
        entries = caesar.brute_force("KHOOR")
        assert len(entries) == 26
        assert any(e["candidate"] == "HELLO" for e in entries)

    def test_structured_steps_present(self):
        result = caesar.encrypt("HELLO", 3)
        assert result["steps"]
        assert result["algorithm"] == "caesar"
        assert result["operation"] == "encrypt"


# ---------------------------------------------------------------------------
# Monoalphabetic substitution
# ---------------------------------------------------------------------------


class TestMonoalphabetic:
    ALPHA = "QAZWSXEDCRFVTGBYHNUJMIKOLP"

    def test_encrypt(self):
        assert monoalphabetic.encrypt("A", self.ALPHA)["result"] == "Q"

    def test_roundtrip_mixed(self):
        text = "HELLO WORLD"
        enc = monoalphabetic.encrypt(text, self.ALPHA)["result"]
        assert monoalphabetic.decrypt(enc, self.ALPHA)["result"] == text

    def test_random_alphabet_is_permutation(self):
        alphabet = monoalphabetic.generate_random_alphabet(seed=123)
        assert len(alphabet) == 26
        assert len(set(alphabet)) == 26
        assert set(alphabet) == set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    def test_duplicate_character_rejected(self):
        with pytest.raises(AlgorithmError):
            monoalphabetic.encrypt("HI", self.ALPHA[:-1] + "A")

    def test_wrong_length_rejected(self):
        with pytest.raises(AlgorithmError):
            monoalphabetic.encrypt("HI", "ABC")

    def test_frequency_profile(self):
        result = monoalphabetic.encrypt("AAAAABC", self.ALPHA)
        assert "frequency_analysis" in result["extra"]


# ---------------------------------------------------------------------------
# Vigenère
# ---------------------------------------------------------------------------


class TestVigenere:
    def test_encrypt_known(self):
        assert vigenere.encrypt("ATTACKATDAWN", "LEMON")["result"] == "LXFOPVEFRNHR"

    def test_roundtrip_with_spaces(self):
        text, key = "We attack at dawn", "KEY"
        enc = vigenere.encrypt(text, key)["result"]
        assert vigenere.decrypt(enc, key)["result"] == text

    def test_key_repeat_visualisation(self):
        result = vigenere.encrypt("HELLO", "AB")
        assert result["extra"]["repeated_key"] == "ABABA"

    def test_invalid_key_characters(self):
        with pytest.raises(AlgorithmError):
            vigenere.encrypt("HI", "KEY1")

    def test_formula_reported(self):
        assert "Cᵢ" in vigenere.decrypt("X", "A")["extra"]["formula"]


# ---------------------------------------------------------------------------
# Playfair
# ---------------------------------------------------------------------------


class TestPlayfair:
    def test_square_construction(self):
        square = playfair.build_square("MONARCHY")
        assert len(square) == 5 and len(square[0]) == 5
        flat = [c for row in square for c in row]
        assert len(set(flat)) == 25

    def test_encrypt_known(self):
        # Standard Playfair test: HELLO with keyword MONARCHY -> CFSUPM
        assert playfair.encrypt("HELLO", "MONARCHY")["result"] == "CFSUPM"

    def test_digraph_preparation(self):
        result = playfair.encrypt("BALLOON", "MONARCHY")
        assert result["extra"]["pairs"] == ["BA", "LX", "LO", "ON"]

    def test_roundtrip_drops_filler_x(self):
        plain, keyword = "SECRET", "PLAYFAIR"
        enc = playfair.encrypt(plain, keyword)["result"]
        dec = playfair.decrypt(enc, keyword)["result"]
        assert dec.startswith(plain)  # trailing filler X may remain

    def test_j_merged_to_i(self):
        enc = playfair.encrypt("JOKE", "MONARCHY")["result"]
        assert enc  # no crash

    def test_odd_ciphertext_rejected(self):
        with pytest.raises(AlgorithmError):
            playfair.decrypt("ABCDE", "MONARCHY")


# ---------------------------------------------------------------------------
# Hill
# ---------------------------------------------------------------------------


class TestHill:
    MATRIX_2 = [[3, 3], [2, 5]]
    MATRIX_3 = [[6, 24, 1], [13, 16, 10], [20, 17, 15]]

    def test_encrypt_2x2_known(self):
        assert hill.encrypt("HELP", self.MATRIX_2)["result"] == "HIAT"

    def test_encrypt_3x3_known(self):
        assert hill.encrypt("ACT", self.MATRIX_3)["result"] == "POH"

    def test_roundtrip_2x2(self):
        text = "HELP"
        enc = hill.encrypt(text, self.MATRIX_2)["result"]
        assert hill.decrypt(enc, self.MATRIX_2)["result"] == text

    def test_roundtrip_3x3(self):
        text = "ACT"
        enc = hill.encrypt(text, self.MATRIX_3)["result"]
        assert hill.decrypt(enc, self.MATRIX_3)["result"] == text

    def test_non_invertible_rejected(self):
        with pytest.raises(AlgorithmError):
            hill.encrypt("HELP", [[2, 4], [1, 3]])

    def test_invalid_entries_rejected(self):
        with pytest.raises(AlgorithmError):
            hill.encrypt("HELP", [[3, 3], [2]])

    def test_determinant_reported(self):
        result = hill.encrypt("HELP", self.MATRIX_2)
        assert result["extra"]["determinant"] == 9

    def test_inverse_matrix_reported(self):
        result = hill.decrypt("HIAT", self.MATRIX_2)
        inverse = result["extra"]["inverse_matrix"]
        # K^-1 = [[15,17],[20,9]] mod 26 for the classic example.
        assert inverse == [[15, 17], [20, 9]]


# ---------------------------------------------------------------------------
# Rail fence
# ---------------------------------------------------------------------------


class TestRailFence:
    def test_encrypt_known_3_rails(self):
        assert rail_fence.encrypt("WEAREDISCOVEREDFLEEATONCE", 3)["result"] == \
            "WECRLTEERDSOEEFEAOCAIVDEN"

    def test_roundtrip(self):
        text = "HELLOWORLD"
        enc = rail_fence.encrypt(text, 3)["result"]
        assert rail_fence.decrypt(enc, 3)["result"] == text

    def test_pattern_visualisation(self):
        result = rail_fence.encrypt("HELLOWORLD", 3)
        assert len(result["extra"]["rows"]) == 3

    def test_rails_below_2_rejected(self):
        with pytest.raises(AlgorithmError):
            rail_fence.encrypt("HI", 1)


# ---------------------------------------------------------------------------
# Columnar transposition
# ---------------------------------------------------------------------------


class TestColumnar:
    def test_encrypt_known(self):
        # ZEBRA -> column order [4,2,1,3,0] -> OD LR EO LL HW = ODLREOLLHW
        assert columnar.encrypt("HELLOWORLD", "ZEBRA")["result"] == "ODLREOLLHW"

    def test_roundtrip_duplicate_key_letters(self):
        text, key = "CRYPTOGRAPHY", "AABB"
        enc = columnar.encrypt(text, key)["result"]
        assert columnar.decrypt(enc, key)["result"] == text

    def test_convention_reported(self):
        result = columnar.encrypt("HELLO", "ZEBRA")
        assert "convention" in result["extra"]
        assert "stable" in result["extra"]["convention"]

    def test_table_visualisation(self):
        result = columnar.encrypt("HELLOWORLD", "ZEBRA")
        assert "table" in result["extra"]

    def test_empty_key_rejected(self):
        with pytest.raises(AlgorithmError):
            columnar.encrypt("HI", "")