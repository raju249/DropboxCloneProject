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
    
engine = create_engine("sqlite:///saveit.db")
Base.metadata.create_all(engine)
Base.metadata.bind = engine
DBSession = sessionmaker(bind = engine)