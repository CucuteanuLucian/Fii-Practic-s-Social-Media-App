from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from my_app.models.extensions import bcrypt
from flask_cors import CORS
from flask_migrate import Migrate

from my_app.models import db
from my_app.config import Config
from my_app.controllers.post_controller import auth_bp
from my_app.routes.post_routes import posts_routes

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, support_credentials=True)

    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_routes)

    with app.app_context():
        db.create_all()

    return app
