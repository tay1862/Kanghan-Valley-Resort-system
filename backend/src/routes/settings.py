from flask import Blueprint, request, jsonify
from src.firebase_config import get_firestore_client
from datetime import datetime

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    """ดึงการตั้งค่าทั้งหมด"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get resort info
        resort_doc = db.collection('settings').document('resort_info').get()
        resort_info = resort_doc.to_dict() if resort_doc.exists else {}
        
        # Get invoice settings
        invoice_doc = db.collection('settings').document('invoice_settings').get()
        invoice_settings = invoice_doc.to_dict() if invoice_doc.exists else {}
        
        # Get website settings
        website_doc = db.collection('settings').document('website_settings').get()
        website_settings = website_doc.to_dict() if website_doc.exists else {}
        
        settings = {
            'resort_info': resort_info,
            'invoice_settings': invoice_settings,
            'website_settings': website_settings
        }
        
        return jsonify({'settings': settings}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/resort', methods=['PUT'])
def update_resort_info():
    """อัปเดตข้อมูลรีสอร์ท"""
    try:
        data = request.get_json()
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update resort info
        data['updated_at'] = datetime.now().isoformat()
        db.collection('settings').document('resort_info').set(data)
        
        return jsonify({'message': 'Resort info updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/invoice', methods=['PUT'])
def update_invoice_settings():
    """อัปเดตการตั้งค่าใบเสร็จ"""
    try:
        data = request.get_json()
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Validate deposit percentage
        if 'deposit_percentage' in data:
            if not isinstance(data['deposit_percentage'], (int, float)) or data['deposit_percentage'] < 0 or data['deposit_percentage'] > 100:
                return jsonify({'error': 'Invalid deposit percentage'}), 400
        
        # Update invoice settings
        data['updated_at'] = datetime.now().isoformat()
        db.collection('settings').document('invoice_settings').set(data)
        
        return jsonify({'message': 'Invoice settings updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/website', methods=['PUT'])
def update_website_settings():
    """อัปเดตการตั้งค่าเว็บไซต์"""
    try:
        data = request.get_json()
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Update website settings
        data['updated_at'] = datetime.now().isoformat()
        db.collection('settings').document('website_settings').set(data)
        
        return jsonify({'message': 'Website settings updated successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/gallery', methods=['POST'])
def upload_gallery_image():
    """อัปโหลดรูปภาพไปยัง gallery"""
    try:
        # TODO: Implement file upload to Firebase Storage
        # For now, return mock response
        
        data = request.get_json()
        image_url = data.get('image_url', '')
        
        if not image_url:
            return jsonify({'error': 'Image URL is required'}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get current gallery images
        gallery_doc = db.collection('settings').document('gallery').get()
        gallery_data = gallery_doc.to_dict() if gallery_doc.exists else {'images': []}
        
        # Add new image
        gallery_data['images'].append({
            'url': image_url,
            'uploaded_at': datetime.now().isoformat()
        })
        
        # Update gallery
        db.collection('settings').document('gallery').set(gallery_data)
        
        return jsonify({'message': 'Image uploaded successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/gallery/<int:image_index>', methods=['DELETE'])
def delete_gallery_image(image_index):
    """ลบรูปภาพจาก gallery"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get current gallery images
        gallery_doc = db.collection('settings').document('gallery').get()
        gallery_data = gallery_doc.to_dict() if gallery_doc.exists else {'images': []}
        
        # Remove image at index
        if 0 <= image_index < len(gallery_data['images']):
            gallery_data['images'].pop(image_index)
            
            # Update gallery
            db.collection('settings').document('gallery').set(gallery_data)
            
            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'Invalid image index'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

