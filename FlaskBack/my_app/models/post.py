from datetime import datetime
from . import db
from .extensions import bcrypt


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)
    hearts = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sentiment = db.Column(db.Text, nullable=True, default=None)

    username = db.Column(db.String(80), db.ForeignKey('users.username'), nullable=False)
    user = db.relationship('User', backref='posts')

    def __repr__(self):
        return f'<Post {self.id}: {self.title}>'

    def save(self):
        db.session.add(self)
        db.session.commit()


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sentiment = db.Column(db.Text, nullable=True, default=None)

    username = db.Column(db.String(80), db.ForeignKey('users.username'), nullable=False)
    user = db.relationship('User', backref='comments')

    def __repr__(self):
        return f'<Comment {self.id}: {self.content}>'

    def save(self):
        db.session.add(self)
        db.session.commit()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @staticmethod
    def create_user(email, password):
        base_username = email.split('@')[0]
        username = base_username
        counter = 1

        while User.query.filter_by(username=username).first():
            username = f"{base_username}{counter}"
            counter += 1

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        return User(email=email, password_hash=password_hash, username=username)

