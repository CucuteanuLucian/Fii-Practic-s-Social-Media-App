from flask import Flask, request, jsonify
from flask_cors import CORS
import unittest

app = Flask(__name__)
CORS(app)

def calculate_total_price(subtotal, tax_rate):
    return subtotal + (subtotal * tax_rate)


@app.route('/total', methods=['POST'])
def total_price():
    data = request.json
    subtotal = data.get("subtotal", 0)
    tax_rate = data.get("tax_rate", 0)
    total = calculate_total_price(subtotal, tax_rate)
    return jsonify({"total_price": total})


class TestIntegration(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_total_price_endpoint(self):
        response = self.app.post('/total', json={"subtotal": 100, "tax_rate": 0.1})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"total_price": 110})


if __name__ == "__main__":
    unittest.main()


