import unittest
from routes import create_app
from models import db, Post


class PostTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_post_by_id(self):
        with self.app.app_context():
            post = Post(content="Test Post")
            db.session.add(post)
            db.session.commit()
            post = db.session.get(Post, post.id)

        self.assertIsNotNone(post.id)
        response = self.client.get(f"/posts/{post.id}")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["content"], "Test Post")
        self.assertEqual(data["likes"], 0)
        self.assertEqual(data["hearts"], 0)

    def test_get_post_not_found(self):
        response = self.client.get(f"/posts/1")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertEqual(data["message"], "Post not found")


if __name__ == '__main__':
    unittest.main()
