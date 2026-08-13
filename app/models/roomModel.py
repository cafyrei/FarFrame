from sqlalchemy import Column, DateTime, Integer, SmallInteger, String, func
from sqlalchemy.orm import DeclarativeBase
class Base(DeclarativeBase):
    pass

class Room(Base):
    __tablename__ = "room"

    room_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_code = Column(String(10), nullable=False, unique=True, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    expires_at = Column(DateTime, nullable=False)
    status = Column(SmallInteger, nullable=False, default=0)

