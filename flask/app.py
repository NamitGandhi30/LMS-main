# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq()

SYSTEM_PROMPT = """You are a doubt clearing expert assistant. Your goal is to provide clear, accurate answers in 5 sentences or less, unless specifically asked to expand. Focus on the most important aspects of the question and eliminate any unnecessary information. Be direct and precise in your explanations."""

# Store conversation history in memory
conversation_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        conversation_history.append({"role": "user", "content": user_message})

        chat_completion = client.chat.completions.create(
            messages=conversation_history,
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=2048
        )

        assistant_response = chat_completion.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": assistant_response})

        return jsonify({
            'response': assistant_response,
            'history': conversation_history[1:] 
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset', methods=['POST'])
def reset():
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": SYSTEM_PROMPT})
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
