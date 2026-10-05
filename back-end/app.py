from flask import Flask, request, jsonify
from flask_cors import CORS

from ai import get_ai_response


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "AI College Navigator backend is running!"
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        message = data.get("message", "").strip()
        profile = data.get("profile", {})

        if not message:
            return jsonify({
                "error": "Please enter a message."
            }), 400

        response = get_ai_response(
            message,
            profile
        )

        return jsonify({
            "response": response
        })

    except Exception as error:
        print("AI ERROR:", repr(error))

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)