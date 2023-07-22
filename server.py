import os

import bcrypt as bcrypt
import flask
from flask import Flask, render_template, request, redirect, session

import data_manager, connection
import config

app = Flask(__name__)
app.secret_key = "96449384-97ca-4e24-bdec-58a7dc8f59fc"


@app.route('/registration', methods=['POST', 'GET'])
def registration():
    if request.method == 'GET':
        return render_template("registration.html")
    else:
        player_name = request.form['player_name']
        email = request.form['email']
        password = request.form['password']
        repeat_password = request.form['repeat_password']

        errors = []

        if not password == repeat_password:
            errors.append("Passwords not match")

        if len(password) not in config.PASSWORD_LENGTH:
            errors.append(f"Password should have from {config.PASSWORD_LENGTH_MIN} to {config.PASSWORD_LENGTH_MAX} "
                          f"characters.")
        if len(player_name) not in config.USERNAME_LENGTH:
            errors.append(f"Username should have from {config.USERNAME_LENGTH_MIN} to {config.USERNAME_LENGTH_MAX} "
                          f"characters.")
        if data_manager.get_player_by_name(player_name, email):
            errors.append("User with this name or email already exists.")
        if len(errors):
            return render_template("registration.html", errors=errors)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        player_id = data_manager.add_player(player_name, email, hashed_password.decode("utf-8"))

        if player_id:
            return render_template("registration_confirm.html")
        else:
            return render_template("registration.html", errors='Unknown error, please try later.')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    else:
        player_name_email = request.form['player_name_email']
        password = request.form['password']
        errors = []
        player = data_manager.get_player_by_name(player_name_email, player_name_email)
        if not player:
            errors.append(f'{player_name_email} not exist')
            return render_template("login.html", errors=errors)

        is_password_correct = bcrypt.checkpw(password.encode("utf-8"), player['password'].encode("utf-8"))

        if is_password_correct:
            session['player_name_email'] = player_name_email
            session['is_logged'] = True
            session['player_id'] = player['id']
            return redirect(f"/player/{player['id']}")
        else:
            return render_template("login.html", errors=['Password incorrect!'])


@app.route('/')
def main_page():
    return render_template('main.html',is_logged=is_logged())


def is_logged():
    return "is_logged" in session and session["is_logged"]


@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect("/")



@app.route('/player/<player_id>')
@connection.is_logged_in
def player_detail_page(player_id):
    players = data_manager.get_players_list()
    player = next(player for player in players if player['id'] == int(player_id))
    return render_template('player_page.html', player=player)



@app.route('/players')
@connection.is_logged_in
def list_players():
    players = data_manager.get_players_list()
    player_id = session['player_id']
    return render_template('list_players.html', players=players, player_id= player_id, LIST_PLAYERS_HEADERS=config.LIST_PLAYERS_HEADERS)



@app.route('/difficulty_games')
@connection.is_logged_in
def chose_difficulty_game():
    return render_template('difficulty.html')



@app.route('/easy_level')
@connection.is_logged_in
def easy_level():
    return render_template('easy_level.html')



@app.route('/medium_level')
@connection.is_logged_in
def medium_level():
    return render_template('medium_level.html')



@app.route('/hard_level')
@connection.is_logged_in
def hard_level():
    return render_template('hard_level.html')


@app.route('/image')
@connection.is_logged_in
def image():
    image_files = os.listdir('static/image')
    return flask.jsonify(image_files)