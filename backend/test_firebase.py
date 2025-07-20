#!/usr/bin/env python3
"""
Test Firebase connection
"""
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from firebase_config import initialize_firebase, get_firestore_client

def test_firebase_connection():
    """Test Firebase connection"""
    print("Testing Firebase connection...")
    
    # Test initialization
    if initialize_firebase():
        print("✅ Firebase initialized successfully")
    else:
        print("❌ Firebase initialization failed")
        return False
    
    # Test Firestore client
    client = get_firestore_client()
    if client:
        print("✅ Firestore client created successfully")
        
        # Test basic operations
        try:
            # Test reading from settings collection
            settings_ref = client.collection('settings')
            docs = settings_ref.stream()
            print("✅ Successfully connected to Firestore")
            return True
        except Exception as e:
            print(f"❌ Error testing Firestore operations: {e}")
            return False
    else:
        print("❌ Failed to create Firestore client")
        return False

def create_initial_data():
    """Create initial data in Firestore"""
    print("\nCreating initial data...")
    
    client = get_firestore_client()
    if not client:
        print("❌ No Firestore client available")
        return False
    
    try:
        # Create settings collection
        settings_ref = client.collection('settings')
        
        # Resort info
        resort_info = {
            'name': 'Kanghan Valley Resort & Camping',
            'phone': '+856 20 9674 8657, +856 20 9980 4879',
            'address': 'Kanghan Valley, ລາວ',
            'email': 'info@kanghanvalley.com'
        }
        settings_ref.document('resort_info').set(resort_info)
        print("✅ Created resort_info")
        
        # Invoice settings
        invoice_settings = {
            'deposit_percentage': 30,
            'currency': 'LAK',
            'terms': 'ກະລຸນາຊໍາລະຄ່າມັດຈໍາກ່ອນລ່ວງຫນ້າ 1 ມື້, ຖ້າຫາກບໍ່ຊໍາລະເງິນຄ່າມັດຈໍາ ການຈອງຈະເປັນໂມຄະ.\nຄ່າທໍານຽມທີ່ໄດ້ຊໍາລະໄວ້ຈະບໍ່ສາມາດຂໍຄືນໄດ້ຖ້າຫາກຍົກເລີກການຈອງ\n**Check-in 14:00\n**Check-out 11:00'
        }
        settings_ref.document('invoice_settings').set(invoice_settings)
        print("✅ Created invoice_settings")
        
        # Create rooms collection
        rooms_ref = client.collection('rooms')
        
        # Sample rooms
        rooms = [
            {
                'id': 'R001',
                'name': 'ເຮືອນສາມຫຼ່ຽມ A',
                'type': 'villa',
                'price': 490000,
                'status': 'available',
                'description': 'ເຮືອນຮູບສາມຫຼ່ຽມທີ່ສະດວກສະບາຍພ້ອມວິວພູເຂົາທີ່ສວຍງາມ',
                'amenities': ['ສະລອງນ້ຳສ່ວນຕົວ', 'ວິວພູເຂົາ', 'ເຕຍງຂະໜາດໃຫຍ່', 'ຫ້ອງນ້ຳຫຼູຫຼາ'],
                'max_guests': 4
            },
            {
                'id': 'R002',
                'name': 'ເຕັນຫຼູຫຼາ B',
                'type': 'glamping',
                'price': 290000,
                'status': 'available',
                'description': 'ເຕັນຫຼູຫຼາພ້ອມສິ່ງອຳນວຍຄວາມສະດວກທັນສະໄໝ',
                'amenities': ['ເຕຍງສະດວກສະບາຍ', 'ຫ້ອງນ້ຳສ່ວນຕົວ', 'ເຄື່ອງປັບອາກາດ', 'ວິວທິວທັດ'],
                'max_guests': 2
            },
            {
                'id': 'R003',
                'name': 'ເຂດແຄມປິ້ງ C',
                'type': 'camping',
                'price': 150000,
                'status': 'available',
                'description': 'ເຂດແຄມປິ້ງແບບດັ້ງເດີມພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຮ່ວມ',
                'amenities': ['ຫ້ອງນ້ຳຮ່ວມ', 'ບ່ອນຈູດໄຟ', 'ໂຕະປິກນິກ', 'ເສັ້ນທາງທ່ອງທິວທັດ'],
                'max_guests': 6
            }
        ]
        
        for room in rooms:
            rooms_ref.document(room['id']).set(room)
            print(f"✅ Created room {room['id']}")
        
        # Create users collection
        users_ref = client.collection('users')
        
        # Sample users
        users = [
            {
                'id': 'U001',
                'name': 'ທ້າວ ບຸນມີ',
                'email': 'bunmee@kanghanvalley.com',
                'role': 'manager'
            },
            {
                'id': 'U002',
                'name': 'ນາງ ສີດາ',
                'email': 'sida@kanghanvalley.com',
                'role': 'reception'
            }
        ]
        
        for user in users:
            users_ref.document(user['id']).set(user)
            print(f"✅ Created user {user['id']}")
        
        print("✅ All initial data created successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error creating initial data: {e}")
        return False

if __name__ == "__main__":
    print("=== Firebase Connection Test ===\n")
    
    # Test connection
    if test_firebase_connection():
        print("\n=== Creating Initial Data ===\n")
        create_initial_data()
    else:
        print("\n❌ Firebase connection failed. Please check your configuration.")
        print("\nTo fix this:")
        print("1. Create Firebase project at https://console.firebase.google.com")
        print("2. Download service account key from Project Settings > Service accounts")
        print("3. Save the key file as 'backend/credentials/serviceAccountKey.json'") 