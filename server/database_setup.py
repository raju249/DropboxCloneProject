from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_login import UserMixin

Base = declarative_base()

class User(Base,UserMixin):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(250), unique = False, nullable = False)
    email = Column(String(250), unique = True, nullable = False)
    password = Column(String(250), unique = False, nullable = True)
    rootFolder = Column(String(250), unique = True, nullable = False)
    
    
class Folders(Base):
    __tablename__ = 'folder'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(250), unique = False, nullable = False)
    num_files = Column(Integer, unique = False, nullable = False)
    user_id = Column(Integer)
    parentRootFolder = Column(String(250), unique = False, nullable = False)


class Files(Base):
    __tablename__ = "files"
    
    id = Column(Integer,primary_key = True)
    name = Column(String(500), unique = False, nullable = False)
    folder_id = Column(Integer)
    parentFolder = Column(String(250), unique = False, nullable = False)
    
    
engine = create_engine("sqlite:///saveit.db")
Base.metadata.create_all(engine)
Base.metadata.bind = engine
DBSession = sessionmaker(bind = engine)