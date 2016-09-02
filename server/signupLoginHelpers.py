from server.database_setup import User,DBSession
import os

def check_duplicate_user(user,session):
    duplicateUser = session.query(User).filter_by(email = user.email).first()
    if duplicateUser:
        return True
    return False
    
    
def check_user(email,password,session):
    is_user = session.query(User).filter_by(email = email).first()
    if is_user and is_user.password == password:
        return is_user
    return False
        
def createFolder(name,parentFolder):
    try:
        os.mkdir(parentFolder + "/" + name)
        return True
    except:
        return False