from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
import os

app = Flask(__name__)
CORS(app)

# Configure Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'AI Service is running!',
        'tesseract_version': pytesseract.get_tesseract_version()
    })

@app.route('/api/extract', methods=['POST'])
def extract_data():
    """Extract tournament data from screenshot"""
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    game = request.form.get('game', 'free_fire')
    
    # For now, return mock data
    # We'll add real OCR processing later
    
    mock_data = {
        'success': True,
        'game': game,
        'teams': [
            {
                'team_name': 'DARK HORIZON',
                'rank': 1,
                'kills': 64,
                'points': 74,
                'confidence': 95
            },
            {
                'team_name': 'TEAM HANDA',
                'rank': 2,
                'kills': 27,
                'points': 35,
                'confidence': 90
            },
            {
                'team_name': 'FIRE EXTRIME',
                'rank': 3,
                'kills': 26,
                'points': 32,
                'confidence': 88
            }
        ],
        'message': 'Mock data - Real OCR coming soon!'
    }
    
    return jsonify(mock_data)

if __name__ == '__main__':
    print('✅ AI Service starting...')
    print('🔍 Tesseract version:', pytesseract.get_tesseract_version())
    app.run(port=5000, debug=True)
