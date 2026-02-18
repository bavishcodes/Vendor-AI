from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # admin, official, company
    is_active = Column(Boolean, default=True)

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    location_lat = Column(Float)
    location_lng = Column(Float)
    business_type = Column(String)
    language = Column(String, default="en")
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    inventory = relationship("InventoryItem", back_populates="vendor")
    sales = relationship("Sale", back_populates="vendor")

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    item_name = Column(String, index=True)
    quantity = Column(Float)
    unit = Column(String) # kg, liters, pieces
    price = Column(Float)
    expiry_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    vendor = relationship("Vendor", back_populates="inventory")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_amount = Column(Float)
    items_summary = Column(Text) # JSON string of items sold
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    vendor = relationship("Vendor", back_populates="sales")
