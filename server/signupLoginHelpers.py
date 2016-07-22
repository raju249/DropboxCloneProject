from server.database_setup import User,DBSession

def check_duplicate_user(user,session):
    duplicateUser = session.query(User).filter_by(email = user.email).first()
    if duplicateUser:
        return True
    return False