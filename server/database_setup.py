from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(250), unique = False, nullable = False)
    email = Column(String(250), unique = True, nullable = False)
    password = Column(String(250), unique = False, nullable = True)
    
    
class Folders(Base):
    __tablename__ = 'folder'
    
    id = Column(Integer, primary_key = True)
    name = Column(String(250), unique = True, nullable = False)
    num_files = Column(Integer, unique = False, nullable = False)
    
    
class FolderOwner(Base):
    __tablename__ = 'ownerfolder'
    
    id = Column(Integer, primary_key = True)
    fid = Column(Integer, unique = False, nullable = False)
    name = Column(String(250), unique = False, nullable = False)
    
engine = create_engine("sqlite:///saveit.db")
Base.metadata.create_all(engine)
Base.metadata.bind = engine
DBSession = sessionmaker(bind = engine)