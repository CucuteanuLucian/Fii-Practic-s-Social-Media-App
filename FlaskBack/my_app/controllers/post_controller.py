from flask import jsonify, request, Blueprint, app

from my_app.models import Post, db, Comment, User
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import jwt

model_name = "clapAI/modernBERT-base-multilingual-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

auth_bp = Blueprint('auth', __name__)


def add_post():
    try:
        data = request.get_json()

        content = data.get("content")
        if not content:
            return "Content cannot be empty", 400
        if len(content) < 10:
            return "Content must be at least 10 characters long.", 400

        username = data.get('username')

        if not username:
            return jsonify({"message": "Username is required"}), 400

        post = Post(content=data["content"], username=username)
        post.sentiment = sentiment_pipeline(data["content"])[0]['label']

        post.save()

        return jsonify({
            'id': post.id,
            'content': post.content,
            'likes': post.likes,
            'hearts': post.hearts,
            'created_at': post.created_at,
            'sentiment': post.sentiment,
            'username': post.user.username
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


def get_post_by_id(post_id):
    post = db.session.get(Post, post_id)
    if post:
        return jsonify({
            'id': post.id,
            'content': post.content,
            'likes': post.likes,
            'hearts': post.hearts,
            'created_at': post.created_at,
            'sentiment': post.sentiment,
            'username': post.user.username
        }), 200
    else:
        return jsonify({'message': 'Post not found'}), 404


def get_posts():
    posts = Post.query.all()
    if not posts:
        return jsonify({"message": "No posts found"}), 404

    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "content": post.content,
            "likes": post.likes,
            "hearts": post.hearts,
            "created_at": post.created_at,
            'sentiment': post.sentiment,
            'username': post.user.username
        })
    return jsonify(result), 200


def like_post(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    post.likes += 1
    post.save()
    return jsonify({"message": "You reacted with a like", "likes": post.likes})


def get_likes(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    return jsonify({"likes": post.likes})


def love_post(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    post.hearts += 1
    post.save()

    return jsonify({"message": "You reacted with a heart", "hearts": post.hearts})


def get_hearts(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    return jsonify({"hearts": post.hearts})


def get_sentiment_analysis(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    content = post.content
    sentiment = sentiment_pipeline(content)[0]
    return jsonify({"sentiment": sentiment})


def update_post_by_id(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    data = request.get_json()
    content = data.get("content")
    if content:
        post.content = content
        post.sentiment = sentiment_pipeline(content)[0]['label']
    else:
        return jsonify({"message": "Content cannot be empty"}), 400

    db.session.commit()
    return jsonify({
        'id': post.id,
        'content': post.content,
        'likes': post.likes,
        'hearts': post.hearts,
        'created_at': post.created_at,
        'sentiment': post.sentiment,
        'username': post.user.username
    }), 200


def delete_post_by_id(post_id):
    post = db.session.get(Post, post_id)
    comments = Comment.query.filter_by(post_id=post_id).all()
    for comment in comments:
        db.session.delete(comment)

    if not post:
        return jsonify({"message": "Post not found"}), 404

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200


def get_comments():
    comments = Comment.query.all()
    if not comments:
        return jsonify({"message": "No comments found"}), 404

    result = []
    for comment in comments:
        result.append({
            "id": comment.id,
            "content": comment.content,
            "post_id": comment.post_id,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "sentiment": comment.sentiment,
            'username': comment.user.username
        })
    return jsonify(result), 200


def add_comment():
    data = request.get_json()
    content = data.get("content")
    username = data.get("username")
    post_id = data.get("post_id")
    if not content or not username:
        return jsonify({"message": "Content and username cannot be empty"}), 400

    comment = Comment(content=content, username=username, post_id=post_id)
    comment.sentiment = sentiment_pipeline(content)[0]['label']
    comment.save()

    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'post_id': comment.post_id,
        'created_at': comment.created_at,
        'sentiment': comment.sentiment,
        'username': comment.user.username
    }), 201


def add_post_comment(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    data = request.get_json()
    content = data.get("content")
    if not content:
        return jsonify({"message": "Content cannot be empty"}), 400

    comment = Comment(content=content, post_id=post_id)
    comment.sentiment = sentiment_pipeline(content)[0]['label']
    comment.save()

    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'post_id': comment.post_id,
        'created_at': comment.created_at,
        'sentiment': comment.sentiment,
        'username': comment.user.username
    }), 201


def get_post_comments(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404

    comments = Comment.query.filter_by(post_id=post_id).all()
    if not comments:
        return jsonify({"message": "No comments found for this post"}), 404

    result = []
    for comment in comments:
        result.append({
            "id": comment.id,
            "content": comment.content,
            "post_id": comment.post_id,
            "created_at": comment.created_at,
            "sentiment": comment.sentiment,
            "username": comment.user.username
        })
    return jsonify(result), 200


def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'Email already registered'}), 409

    new_user = User.create_user(data['email'], data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'User registered'}), 201


def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify(access_token=access_token, refresh_token=refresh_token, username=user.username, email=user.email), 200


def refresh():
    refresh_token = request.json.get('refresh')
    if not refresh_token:
        return jsonify({'msg': 'Missing refresh token'}), 400

    try:
        access_token = create_access_token(
            identity='user')
        return jsonify(access=access_token), 200

    except Exception as e:
        return jsonify({'msg': 'Invalid or expired refresh token'}), 401


def update_comment_by_id(comment_id):
    comment = db.session.get(Comment, comment_id)
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    data = request.get_json()
    content = data.get("content")
    if content:
        comment.content = content
        comment.sentiment = sentiment_pipeline(content)[0]['label']
    else:
        return jsonify({"message": "Content cannot be empty"}), 400

    db.session.commit()
    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'post_id': comment.post_id,
        'created_at': comment.created_at,
        'sentiment': comment.sentiment
    }), 200


def delete_comment_by_id(comment_id):
    comment = db.session.get(Comment, comment_id)
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 200


def get_comment_by_id(comment_id):
    comment = db.session.get(Comment, comment_id)
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'post_id': comment.post_id,
        'created_at': comment.created_at,
        'sentiment': comment.sentiment
    }), 200


def get_comment_sentiment_by_id(comment_id):
    comment = db.session.get(Comment, comment_id)
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    sentiment = sentiment_pipeline(comment.content)[0]
    return jsonify({"sentiment": sentiment})


def get_all_sentiments():
    posts = Post.query.all()
    if not posts:
        return jsonify({"message": "No posts found"}), 404

    sentiments = ''
    for post in posts:
        sentiments += post.content + '\n'

    sentiments = sentiments[:-1]
    sentiment = sentiment_pipeline(sentiments)[0]
    return jsonify({"sentiment": sentiment}), 200


def get_all_comments_sentiments():
    comments = Comment.query.all()
    if not comments:
        return jsonify({"message": "No comments found"}), 404

    sentiments = ''
    for comment in comments:
        sentiments += comment.content + '\n'

    sentiments = sentiments[:-1]
    sentiment = sentiment_pipeline(sentiments)[0]
    return jsonify({"all_sentiment": sentiment}), 200
