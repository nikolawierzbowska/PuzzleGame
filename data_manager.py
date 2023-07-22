import connection
@connection.connection_handler
def get_player_by_name(cursor, player_name, email):
    cursor.execute("""
                   SELECT *
                   FROM players
                   WHERE  player_name = %(player_name)s or email = %(email)s    
                    """, {"player_name":player_name, "email":email})
    return cursor.fetchone()


@connection.connection_handler
def add_player(cursor, player_name, email, password):
    cursor.execute("""
                    INSERT INTO players(player_name, email, password)
                    VALUES (%(player_name)s, %(email)s, %(password)s)
                    RETURNING id;""",
                   {"player_name":player_name , "email":email, "password": password })
    return cursor.fetchone()["id"]



@connection.connection_handler
def get_players_list(cursor):
    cursor.execute("""
                   SELECT id,player_name, email, results
                   FROM players
                     """)
    return cursor.fetchall()


@connection.connection_handler
def get_players_results(cursor):
    cursor.execut("""
                 SELECT results
                 FROM players
                 """)
    return cursor.fetchall()