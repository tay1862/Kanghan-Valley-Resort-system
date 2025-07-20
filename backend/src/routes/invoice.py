from flask import Blueprint, request, jsonify, send_file
from src.firebase_config import get_firestore_client
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfutils
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import io
import os
from datetime import datetime

invoice_bp = Blueprint('invoice', __name__)

@invoice_bp.route('/invoice/<booking_id>', methods=['GET'])
def generate_invoice(booking_id):
    """สร้างใบเสร็จ PDF สำหรับการจอง"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get booking data
        booking_doc = db.collection('bookings').document(booking_id).get()
        if not booking_doc.exists:
            return jsonify({'error': 'Booking not found'}), 404
        
        booking_data = booking_doc.to_dict()
        
        # Get settings
        resort_doc = db.collection('settings').document('resort_info').get()
        resort_info = resort_doc.to_dict() if resort_doc.exists else {}
        
        invoice_doc = db.collection('settings').document('invoice_settings').get()
        invoice_settings = invoice_doc.to_dict() if invoice_doc.exists else {}
        
        # Generate PDF
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Set up fonts (using default fonts for now)
        pdf.setFont("Helvetica-Bold", 16)
        
        # Header
        pdf.drawString(50, height - 50, resort_info.get('name', 'Kanghan Valley Resort & Camping'))
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, height - 70, resort_info.get('phone', 'Tel: +856 20 9674 8657'))
        
        # Title
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(400, height - 50, "ໃບຮັບເງິນ/Receipt")
        
        # Booking details
        y_position = height - 120
        pdf.setFont("Helvetica", 10)
        
        # Check-in/out dates
        pdf.drawString(400, y_position, f"Check-in Date: {booking_data.get('check_in', '')}")
        pdf.drawString(400, y_position - 20, f"Check-out Date: {booking_data.get('check_out', '')}")
        
        # Guest info
        y_position -= 60
        pdf.drawString(50, y_position, f"ຊື່ແຂກ/Guest Name: {booking_data.get('guest_name', '')}")
        pdf.drawString(50, y_position - 20, f"Phone number: {booking_data.get('phone_number', '')}")
        
        # Table header
        y_position -= 80
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y_position, "ລາຍການ")
        pdf.drawString(200, y_position, "ຈຳນວນຄືນ")
        pdf.drawString(300, y_position, "ຈຳນວນຫ້ອງ")
        pdf.drawString(400, y_position, "Price Room")
        pdf.drawString(500, y_position, "Amount")
        
        # Draw line
        pdf.line(50, y_position - 5, 550, y_position - 5)
        
        # Table content
        y_position -= 25
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, y_position, booking_data.get('room_name', ''))
        pdf.drawString(200, y_position, "1")  # nights
        pdf.drawString(300, y_position, "1")  # rooms
        pdf.drawString(400, y_position, f"LAK {booking_data.get('total_amount', 0):,}")
        pdf.drawString(500, y_position, f"LAK {booking_data.get('total_amount', 0):,}")
        
        # Totals
        y_position -= 100
        pdf.drawString(400, y_position, f"LAK {booking_data.get('total_amount', 0):,}")
        
        deposit_percentage = invoice_settings.get('deposit_percentage', 30)
        pdf.drawString(50, y_position - 20, f"ຄ່າມັດຈຳ ({deposit_percentage}%):")
        pdf.drawString(400, y_position - 20, f"LAK {booking_data.get('deposit_amount', 0):,}")
        
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y_position - 40, "ຍອດຄ້າງຊຳລະ:")
        pdf.drawString(400, y_position - 40, f"LAK {booking_data.get('remaining_amount', 0):,}")
        
        # Terms and conditions
        y_position -= 100
        pdf.setFont("Helvetica", 8)
        terms = invoice_settings.get('terms', '')
        if terms:
            lines = terms.split('\n')
            for i, line in enumerate(lines):
                pdf.drawString(50, y_position - (i * 12), line)
        
        # Check-in/out times
        y_position -= len(terms.split('\n')) * 12 + 20
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y_position, "**Check-in 14:00")
        pdf.drawString(50, y_position - 15, "**Check-out 11:00")
        
        pdf.save()
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"invoice_{booking_id}.pdf",
            mimetype='application/pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invoice_bp.route('/invoice/<booking_id>/preview', methods=['GET'])
def preview_invoice(booking_id):
    """ดูตัวอย่างใบเสร็จ"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get booking data
        booking_doc = db.collection('bookings').document(booking_id).get()
        if not booking_doc.exists:
            return jsonify({'error': 'Booking not found'}), 404
        
        booking_data = booking_doc.to_dict()
        
        # Get settings
        resort_doc = db.collection('settings').document('resort_info').get()
        resort_info = resort_doc.to_dict() if resort_doc.exists else {}
        
        invoice_doc = db.collection('settings').document('invoice_settings').get()
        invoice_settings = invoice_doc.to_dict() if invoice_doc.exists else {}
        
        # Return invoice data for preview
        invoice_data = {
            'booking': booking_data,
            'resort_info': resort_info,
            'invoice_settings': invoice_settings,
            'generated_at': datetime.now().isoformat()
        }
        
        return jsonify({'invoice': invoice_data}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invoice_bp.route('/invoices', methods=['GET'])
def get_invoices():
    """ดึงรายการใบเสร็จทั้งหมด"""
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Get all bookings (invoices are generated from bookings)
        invoices = []
        docs = db.collection('bookings').stream()
        
        for doc in docs:
            booking_data = doc.to_dict()
            invoice_data = {
                'booking_id': doc.id,
                'guest_name': booking_data.get('guest_name', ''),
                'room_name': booking_data.get('room_name', ''),
                'check_in': booking_data.get('check_in', ''),
                'check_out': booking_data.get('check_out', ''),
                'total_amount': booking_data.get('total_amount', 0),
                'status': booking_data.get('status', ''),
                'created_at': booking_data.get('created_at', '')
            }
            invoices.append(invoice_data)
        
        return jsonify({'invoices': invoices}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

