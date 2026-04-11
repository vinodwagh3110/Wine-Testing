from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "Wine_Model.pkl")
try:
    model = pickle.load(open(MODEL_PATH, "rb"))
    print("Model loaded successfully!")
except FileNotFoundError:
    model = None
    print(f"Warning: Model file not found at {MODEL_PATH}. Place Wine_Model.pkl in the backend folder.")


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Wine Quality API is running", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please ensure Wine_Model.pkl exists in the backend folder."}), 500

    try:
        data = request.get_json()

        # Extract features in the correct order
        features = [
            float(data["fixed_acidity"]),
            float(data["volatile_acidity"]),
            float(data["citric_acid"]),
            float(data["residual_sugar"]),
            float(data["chlorides"]),
            float(data["free_sulfur_dioxide"]),
            float(data["total_sulfur_dioxide"]),
            float(data["density"]),
            float(data["pH"]),
            float(data["sulphates"]),
            float(data["alcohol"]),
        ]

        features_array = np.array([features])
        prediction = model.predict(features_array)[0]

        # Try to get probability if classifier supports it
        confidence = None
        try:
            proba = model.predict_proba(features_array)[0]
            confidence = float(max(proba)) * 100
        except AttributeError:
            pass

        quality_score = int(round(float(prediction)))

        # Map quality score to label
        if quality_score <= 4:
            label = "Poor"
            description = "This wine has significant quality issues."
        elif quality_score == 5:
            label = "Average"
            description = "This wine meets basic quality standards."
        elif quality_score == 6:
            label = "Good"
            description = "This wine is pleasant and enjoyable."
        elif quality_score == 7:
            label = "Very Good"
            description = "This is a high-quality wine with excellent characteristics."
        else:
            label = "Exceptional"
            description = "This is an outstanding wine of premium quality."

        response = {
            "quality_score": quality_score,
            "quality_label": label,
            "description": description,
            "features_used": features,
        }
        if confidence is not None:
            response["confidence"] = round(confidence, 2)

        return jsonify(response)

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/batch-predict", methods=["POST"])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model not loaded."}), 500

    try:
        data = request.get_json()
        samples = data.get("samples", [])

        if not samples:
            return jsonify({"error": "No samples provided."}), 400

        results = []
        for sample in samples:
            features = [
                float(sample["fixed_acidity"]),
                float(sample["volatile_acidity"]),
                float(sample["citric_acid"]),
                float(sample["residual_sugar"]),
                float(sample["chlorides"]),
                float(sample["free_sulfur_dioxide"]),
                float(sample["total_sulfur_dioxide"]),
                float(sample["density"]),
                float(sample["pH"]),
                float(sample["sulphates"]),
                float(sample["alcohol"]),
            ]
            pred = int(round(float(model.predict([features])[0])))
            results.append({"quality_score": pred})

        return jsonify({"results": results, "count": len(results)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)