from flask import Blueprint, request, jsonify
from src.firebase_config import get_firestore_client
import uuid
from datetime import datetime

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/rooms', methods=['GET'])
def get_rooms():
    """ดึงรายการห้องพักทั้งหมด"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        rooms = []
        docs = db.collection('rooms').stream()
        
        for doc in docs:
            room_data = doc.to_dict()
            room_data['id'] = doc.id
            rooms.append(room_data)
        
        return jsonify({'rooms': rooms}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms', methods=['POST'])
def create_room():
    """สร้างห้องพักใหม่"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate room ID
        room_id = f"R{str(uuid.uuid4())[:6].upper()}"
        
        room_data = {
            'id': room_id,
            'name': data['name'],
            'type': data['type'],
            'price': data['price'],
            'status': data.get('status', 'available'),
            'description': data.get('description', ''),
            'amenities': data.get('amenities', []),
            'max_guests': data.get('max_guests', 2),
            'images': data.get('images', []),
            'created_at': datetime.now().isoformat()
        }
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Add to Firestore
        db.collection('rooms').document(room_id).set(room_data)
        
        return jsonify({'message': 'Room created successfully', 'room': room_data}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    """ดึงข้อมูลห้องพักตาม ID"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        doc = db.collection('rooms').document(room_id).get()
        
        if doc.exists:
            room_data = doc.to_dict()
            room_data['id'] = doc.id
            return jsonify({'room': room_data}), 200
        else:
            return jsonify({'error': 'Room not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms/<room_id>', methods=['PUT'])
def update_room(room_id):
    """อัปเดตข้อมูลห้องพัก"""
    try:
        data = request.get_json()
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update room
        data['updated_at'] = datetime.now().isoformat()
        db.collection('rooms').document(room_id).update(data)
        
        return jsonify({'message': 'Room updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms/<room_id>', methods=['DELETE'])
def delete_room(room_id):
    """ลบห้องพัก"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        db.collection('rooms').document(room_id).delete()
        
        return jsonify({'message': 'Room deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms/<room_id>/status', methods=['PUT'])
def update_room_status(room_id):
    """อัปเดตสถานะห้องพัก"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['available', 'occupied', 'maintenance', 'out_of_order']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        update_data = {
            'status': status,
            'updated_at': datetime.now().isoformat()
        }
        
        db.collection('rooms').document(room_id).update(update_data)
        
        return jsonify({'message': 'Room status updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rooms_bp.route('/rooms/available', methods=['GET'])
def get_available_rooms():
    """ดึงรายการห้องพักที่ว่าง"""
    try:
        check_in = request.args.get('check_in')
        check_out = request.args.get('check_out')
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all rooms with status 'available'
        rooms = []
        docs = db.collection('rooms').stream()
        
        for doc in docs:
            room_data = doc.to_dict()
            if room_data.get('status') == 'available':
                room_data['id'] = doc.id
                rooms.append(room_data)
        
        # TODO: Check against bookings for the specified dates
        # For now, return all available rooms
        
        return jsonify({'rooms': rooms}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

