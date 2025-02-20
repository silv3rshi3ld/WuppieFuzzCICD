"""Test file containing fault test cases."""

import unittest
import timeout_decorator

class TestApi(unittest.TestCase):
    """Test cases that found faults."""

    @timeout_decorator.timeout(60)
    def test_0(self):
        """Test invalid user registration."""
        # Found 1 potential fault of type-code 400
        # (400) POST:/api/users/register
        headers = {}
        data = {
            "username": "",  # Invalid empty username
            "email": "invalid",  # Invalid email format
            "password": "123"  # Too short password
        }
        assert res.status_code == 400
        assert res.json()["error"] == "Invalid input data"

    @timeout_decorator.timeout(60)
    def test_1(self):
        """Test unauthorized access."""
        # Found 1 potential fault of type-code 401
        # (401) GET:/api/admin/users
        headers = {}
        assert res.status_code == 401
        assert res.json()["error"] == "Unauthorized access"
