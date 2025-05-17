import unittest


def calculate_total_price(subtotal, tax_rate):
    return subtotal + (subtotal * tax_rate)


class TestCalculateTotalPrice(unittest.TestCase):
    def test_total_price(self):
        self.assertEqual(calculate_total_price(100, 0.1), 110)
        self.assertEqual(calculate_total_price(50, 0.2), 60)
        self.assertEqual(calculate_total_price(0, 0.1), 0)


if __name__ == "__main__":
    unittest.main()
