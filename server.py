import bcrypt as bcrypt
from flask import Flask, render_template, request, redirect, url_for, session

# import data_manager
# import util
# import config

app = Flask(__name__)
app.secret_key = "96449384-97ca-4e24-bdec-58a7dc8f59fc"


@app.route('/registration', methods=['POST', 'GET'])
def registration():
    if request.method == 'GET':
        return render_template("registration.html")
    else:
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        repeat_password = request.form['repeat_password']

        errors = []

        if not password == repeat_password:
            errors.append("Passwords not match")

        if len(password) not in config.PASSWORD_LENGTH:
            errors.append(f"Password should have from {config.PASSWORD_LENGTH_MIN} to {config.PASSWORD_LENGTH_MAX} "
                          f"characters.")
        if len(username) not in config.USERNAME_LENGTH:
            errors.append(f"Username should have from {config.USERNAME_LENGTH_MIN} to {config.USERNAME_LENGTH_MAX} "
                          f"characters.")
        if data_manager.get_user_by_name(username, email):
            errors.append("User with this name or email already exists.")
        if len(errors):
            return render_template("registration.html", errors=errors)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user_id = data_manager.add_user(username, email, hashed_password.decode("utf-8"))

        if user_id:
            return render_template("registration_confirm.html")
        else:
            return render_template("registration.html", errors='Unknown error, please try later.')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    else:
        username_email = request.form['username_email']
        password = request.form['password']
        errors = []
        user = data_manager.get_user_by_name(username_email, username_email)
        if not user:
            errors.append(f'{username_email} not exist')
            return render_template("login.html", errors=errors)

        is_password_correct = bcrypt.checkpw(password.encode("utf-8"), user['password'].encode("utf-8"))

        if is_password_correct:
            session['username_email'] = username_email
            session['is_logged'] = True
            session['user_id'] = user['id']
            return redirect(f"/user/{user['id']}")
        else:
            return render_template("login.html", errors=['Password incorrect!'])
