from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Room(Base):
    __tablename__ = "room"
    
    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(10), unique=True, index=True)
    
    