import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def initialize_firebase():
    """
    Initialize Firebase Admin SDK
    """
    try:
        # ตรวจสอบว่า Firebase ได้ถูก initialize แล้วหรือยัง
        if not firebase_admin._apps:
            # ใช้ service account key file
            service_account_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                'credentials', 
                'serviceAccountKey.json'
            )
            
            if os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
                print("Firebase initialized successfully with service account")
                return True
            else:
                print("Service account key file not found. Please download from Firebase Console.")
                print(f"Expected path: {service_account_path}")
                return False
        return True
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return False

def get_firestore_client():
    """
    Get Firestore client
    """
    try:
        if initialize_firebase():
            return firestore.client()
        return None
    except Exception as e:
        print(f"Error getting Firestore client: {e}")
        return None

# Mock classes สำหรับ fallback (ถ้าไม่มี Firebase)
class MockFirestoreClient:
    """
    Mock Firestore client สำหรับ development เมื่อไม่มี Firebase
    """
    
    def __init__(self):
        # Mock data สำหรับ development
        self.mock_data = {
            'bookings': [
                {
                    'id': 'BK001',
                    'guest_name': 'ທ້າວ ສົມຊາຍ',
                    'phone_number': '020 5555 1234',
                    'email': 'somchai@email.com',
                    'room_name': 'ເຮືອນສາມຫຼ່ຽມ A',
                    'check_in': '2024-07-20',
                    'check_out': '2024-07-23',
                    'guests': 2,
                    'status': 'confirmed',
                    'total_amount': 980000,
                    'deposit_amount': 294000,
                    'remaining_amount': 686000,
                    'created_at': '2024-07-18'
                }
            ],
            'rooms': [
                {
                    'id': 'R001',
                    'name': 'ເຮືອນສາມຫຼ່ຽມ A',
                    'type': 'villa',
                    'price': 490000,
                    'status': 'available',
                    'description': 'ເຮືອນຮູບສາມຫຼ່ຽມທີ່ສະດວກສະບາຍພ້ອມວິວພູທີ່ສວຍງາມ',
                    'amenities': ['ສະລອງນ້ຳສ່ວນຕົວ', 'ວິວພູເຂົາ', 'ເຕຍງຂະໜາດໃຫຍ່', 'ຫ້ອງນ້ຳຫຼູຫຼາ']
                }
            ],
            'users': [
                {
                    'id': 'U001',
                    'name': 'ທ້າວ ບຸນມີ',
                    'email': 'bunmee@kanghanvalley.com',
                    'role': 'manager',
                    'created_at': '2024-01-15'
                }
            ],
            'settings': {
                'resort_info': {
                    'name': 'Kanghan Valley Resort & Camping',
                    'phone': '+856 20 9674 8657, +856 20 9980 4879',
                    'address': 'Kanghan Valley, ລາວ',
                    'email': 'info@kanghanvalley.com'
                },
                'invoice_settings': {
                    'deposit_percentage': 30,
                    'currency': 'LAK',
                    'terms': 'ກະລຸນາຊໍາລະຄ່າມັດຈໍາກ່ອນລ່ວງຫນ້າ 1 ມື້...'
                }
            }
        }
    
    def collection(self, collection_name):
        return MockCollection(self.mock_data.get(collection_name, []))

class MockCollection:
    def __init__(self, data):
        self.data = data if isinstance(data, list) else [data]
    
    def stream(self):
        return [MockDocument(item) for item in self.data]
    
    def document(self, doc_id):
        return MockDocument(next((item for item in self.data if item.get('id') == doc_id), {}))
    
    def add(self, data):
        # Mock add operation
        return MockDocument(data)
    
    def get(self):
        return [MockDocument(item) for item in self.data]

class MockDocument:
    def __init__(self, data):
        self._data = data
        self.id = data.get('id', 'mock_id')
    
    def to_dict(self):
        return self._data
    
    def set(self, data):
        # Mock set operation
        self._data.update(data)
        return True
    
    def update(self, data):
        # Mock update operation
        self._data.update(data)
        return True
    
    def delete(self):
        # Mock delete operation
        return True

