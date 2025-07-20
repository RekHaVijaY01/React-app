from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from bson import ObjectId
import re
import requests
import os

app = Flask(__name__)
CORS(app)



# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["eventApp"]
users = db["users"]
services = db["services"]
bookings = db["bookings"]


# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Upload settings
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER




# User login
@app.route("/login/user", methods=["POST"])
def user_login():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")

    if username and email:
        users.insert_one({"username": username, "email": email})
        return jsonify({"message": "User login success", "role": "user"})
    return jsonify({"error": "Missing fields"}), 400

# Admin login
@app.route("/login/admin", methods=["POST"])
def admin_login():
    data = request.get_json()
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        return jsonify({"message": "Admin login success", "role": "admin"})
    return jsonify({"error": "Invalid admin credentials"}), 401

# Upload service (image + price)
# ✅ Cleaned-up Update Service
@app.route("/update/<service_id>", methods=["PUT"])
def update_service(service_id):
    service = services.find_one({"_id": ObjectId(service_id)})
    if not service:
        return jsonify({"error": "Service not found"}), 404

    title = request.form.get("title")
    price = request.form.get("price")
    image = request.files.get("image")
    service_type = request.form.get("serviceType")  # ✅ Added correctly

    update_fields = {}

    if title:
        update_fields["title"] = title
    if price:
        update_fields["price"] = float(price)
    if service_type:
        update_fields["serviceType"] = service_type
    if image:
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(filepath)
        update_fields["imageUrl"] = f"/uploads/{filename}"

    if not update_fields:
        return jsonify({"error": "No update fields provided"}), 400

    services.update_one({"_id": ObjectId(service_id)}, {"$set": update_fields})
    return jsonify({"message": "Service updated successfully"})


# Delete a service
@app.route("/delete/<service_id>", methods=["DELETE"])
def delete_service(service_id):
    result = services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"message": "Service deleted successfully"})


# Serve uploaded images
@app.route("/uploads/<filename>")
def get_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Get all services
@app.route("/services", methods=["GET"])
def get_all_services():
    all_services = list(services.find())
    for s in all_services:
        s["_id"] = str(s["_id"])
    return jsonify(all_services)

# Get services by type (e.g., decoration, catering, etc.)
@app.route("/services/<service_type>", methods=["GET"])
def get_services_by_type(service_type):
    service_list = list(services.find({"serviceType": service_type}))
    for s in service_list:
        s["_id"] = str(s["_id"])
    return jsonify(service_list)

@app.route("/upload", methods=["POST"])
def upload_service():
    title = request.form.get("title")
    price = request.form.get("price")
    service_type = request.form.get("serviceType")
    sub_category = request.form.get("subCategory")  # Only for catering
    image = request.files.get("image")  # Optional for photography

    if not title or not price or not service_type:
        return jsonify({"error": "Missing fields"}), 400

    service = {
        "title": title,
        "price": float(price),
        "serviceType": service_type
    }

    if service_type == "catering":
        if not sub_category:
            return jsonify({"error": "Sub-category is required for catering"}), 400
        service["subCategory"] = sub_category

    elif service_type in ["decoration", "cake"]:
        if not image:
            return jsonify({"error": f"Image is required for {service_type} service"}), 400
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(filepath)
        service["imageUrl"] = f"/uploads/{filename}"

    elif service_type == "photography":
        # No image needed
        pass

    else:
        return jsonify({"error": f"Unsupported service type: {service_type}"}), 400

    services.insert_one(service)
    return jsonify({"message": "Service uploaded successfully"})


@app.route("/services/catering/<sub_category>", methods=["GET"])
def get_catering_by_subcategory(sub_category):
    service_list = list(services.find({
        "serviceType": "catering",
        "subCategory": sub_category
    }))
    for s in service_list:
        s["_id"] = str(s["_id"])
    return jsonify(service_list)

@app.route("/bookings", methods=["POST"])
def create_booking():
    data = request.get_json()

    required_fields = [
        "email", "phone", "venue", "date",
        "memberCount", "cartItems",
        "totalAmount", "foodEstimation"
    ]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing booking fields"}), 400

    booking = {
        "email": data["email"],
        "phone": data["phone"],
        "altPhone": data.get("altPhone", ""),
        "venue": data["venue"],
        "date": data["date"],
        "memberCount": data["memberCount"],
        "foodEstimation": data["foodEstimation"],
        "cartItems": data["cartItems"],
        "totalAmount": data["totalAmount"],
        "paymentMethod": data.get("paymentMethod", ""),
        "paymentValue": data.get("paymentValue", ""),
        "paymentAmount": data.get("paymentAmount", 0)
    }

    result = bookings.insert_one(booking)
    return jsonify({"message": "Booking saved", "id": str(result.inserted_id)})


@app.route("/bookings", methods=["GET"])
def get_bookings():
    all_bookings = list(bookings.find())
    for b in all_bookings:
        b["_id"] = str(b["_id"])
    return jsonify(all_bookings)


    







if __name__ == "__main__":
    app.run(debug=True)
