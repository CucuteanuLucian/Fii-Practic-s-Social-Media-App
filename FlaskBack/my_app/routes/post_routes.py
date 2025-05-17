from flask import Blueprint
from my_app.controllers.post_controller import *

posts_routes = Blueprint("posts_routes", __name__)


@posts_routes.route('/', methods=['GET'])
def index():
    return jsonify("Hello, World!")


@posts_routes.route('/posts', methods=['POST'])
def create_post():
    return add_post()


@posts_routes.route('/posts', methods=['GET'])
def list_posts():
    return get_posts()

@posts_routes.route('/posts/<int:post_id>', methods=['GET'])
def list_post_by_id(post_id):
    return get_post_by_id(post_id)

@posts_routes.route('/posts/<int:post_id>', methods=['PATCH'])
def update_post(post_id):
    return update_post_by_id(post_id)

@posts_routes.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    return delete_post_by_id(post_id)


@posts_routes.route('/posts/<int:post_id>/comments', methods=['GET'])
def list_post_comments(post_id):
    return get_post_comments(post_id)


@posts_routes.route('/posts/<int:post_id>/comments', methods=['POST'])
def create_post_comment(post_id):
    return add_post_comment(post_id)


@posts_routes.route('/posts/<int:post_id>/like', methods=['POST'])
def create_like(post_id):
    return like_post(post_id)


@posts_routes.route('/posts/<int:post_id>/likes', methods=['GET'])
def list_likes(post_id):
    return get_likes(post_id)


@posts_routes.route('/posts/<int:post_id>/heart', methods=['POST'])
def create_heart(post_id):
    return love_post(post_id)


@posts_routes.route('/posts/<int:post_id>/hearts', methods=['GET'])
def list_hearts(post_id):
    return get_hearts(post_id)

@posts_routes.route('/posts/<int:post_id>/sentiment', methods=['GET'])
def sentiment_analysis(post_id):
    return get_sentiment_analysis(post_id)

@posts_routes.route('/posts/sentiments', methods=['GET'])
def list_sentiments():
    return get_all_sentiments()

@posts_routes.route('/comments', methods=['GET'])
def list_comments():
    return get_comments()

@posts_routes.route('/comments', methods=['POST'])
def create_comment():
    return add_comment()

@posts_routes.route('/register', methods=['POST'])
def register_user():
    return register()

@posts_routes.route('/login', methods=['POST'])
def login_user():
    return login()

@posts_routes.route('/refresh', methods=['POST'])
def refresh_token():
    return refresh()

@posts_routes.route('/comments/<comment_id>', methods=['PATCH'])
def update_comment(comment_id):
    return update_comment_by_id(comment_id)

@posts_routes.route('/comments/<comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    return delete_comment_by_id(comment_id)

@posts_routes.route('/comments/<comment_id>', methods=['GET'])
def get_comment_by_ids(comment_id):
    return get_comment_by_id(comment_id)

@posts_routes.route('/comments/sentiments', methods=['GET'])
def all_comments_sentim():
    return get_all_comments_sentiments()

@posts_routes.route('/comments/<comment_id>/sentiment', methods=['GET'])
def comment_sentiment(comment_id):
    return get_comment_sentiment_by_id(comment_id)


