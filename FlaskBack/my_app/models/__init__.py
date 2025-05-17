from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .post import Post
from .post import Comment
from .post import User

