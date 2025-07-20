from flask import Blueprint, request, jsonify
from src.firebase_config import get_firestore_client
import uuid
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/bookings', methods=['GET'])
def get_bookings():
    """ดึงรายการการจองทั้งหมด"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        bookings = []
        docs = db.collection('bookings').stream()
        
        for doc in docs:
            booking_data = doc.to_dict()
            booking_data['id'] = doc.id
            bookings.append(booking_data)
        
        return jsonify({'bookings': bookings}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    """สร้างการจองใหม่"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['guest_name', 'phone_number', 'room_name', 'check_in', 'check_out', 'guests']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate booking ID
        booking_id = f"BK{str(uuid.uuid4())[:6].upper()}"
        
        # Calculate amounts (mock calculation)
        room_price = data.get('room_price', 490000)  # Default price
        nights = 1  # Calculate based on check_in and check_out dates
        total_amount = room_price * nights
        deposit_percentage = 30
        deposit_amount = int(total_amount * deposit_percentage / 100)
        remaining_amount = total_amount - deposit_amount
        
        booking_data = {
            'id': booking_id,
            'guest_name': data['guest_name'],
            'phone_number': data['phone_number'],
            'email': data.get('email', ''),
            'room_name': data['room_name'],
            'check_in': data['check_in'],
            'check_out': data['check_out'],
            'guests': data['guests'],
            'status': 'pending',
            'total_amount': total_amount,
            'deposit_amount': deposit_amount,
            'remaining_amount': remaining_amount,
            'notes': data.get('notes', ''),
            'created_at': datetime.now().isoformat()
        }
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Add to Firestore
        db.collection('bookings').document(booking_id).set(booking_data)
        
        return jsonify({'message': 'Booking created successfully', 'booking': booking_data}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    """ดึงข้อมูลการจองตาม ID"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        doc = db.collection('bookings').document(booking_id).get()
        
        if doc.exists:
            booking_data = doc.to_dict()
            booking_data['id'] = doc.id
            return jsonify({'booking': booking_data}), 200
        else:
            return jsonify({'error': 'Booking not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings/<booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """อัปเดตข้อมูลการจอง"""
    try:
        data = request.get_json()
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update booking
        data['updated_at'] = datetime.now().isoformat()
        db.collection('bookings').document(booking_id).update(data)
        
        return jsonify({'message': 'Booking updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings/<booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """ลบการจอง"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        db.collection('bookings').document(booking_id).delete()
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings/<booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    """อัปเดตสถานะการจอง"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        update_data = {
            'status': status,
            'updated_at': datetime.now().isoformat()
        }
        
        db.collection('bookings').document(booking_id).update(update_data)
        
        return jsonify({'message': 'Booking status updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

