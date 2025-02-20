"""Test file containing successful test cases."""

import unittest
import timeout_decorator

class TestApi(unittest.TestCase):
    """Test cases that were successful."""

    @timeout_decorator.timeout(60)
    def test_0(self):
        """Test successful user registration."""
        # (200) POST:/api/users/register
        headers = {}
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
        assert res.status_code == 200
        assert res.json()["message"] == "User registered successfully"

    @timeout_decorator.timeout(60)
    def test_1(self):
        """Test successful product retrieval."""
        # (200) GET:/api/products/1
        headers = {}
        assert res.status_code == 200
        assert res.json()["name"] == "Test Product"
        assert res.json()["price"] == 99.99
