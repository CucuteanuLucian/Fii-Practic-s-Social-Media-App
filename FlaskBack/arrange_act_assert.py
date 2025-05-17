import unittest


def add(a, b):
    return a + b


def sub(a, b):
    return a - b


class TestAddition(unittest.TestCase):
    def test_add(self):
        # ARRANGE
        x = 3
        y = 5

        # ACT
        result = add(x, y)

        # ASSERT
        self.assertEqual(result, 8)


if __name__ == "__main__":
    unittest.main()
