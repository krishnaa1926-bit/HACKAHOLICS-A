from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3

app = Flask(__name__)
CORS(app)
DB_FILE = "hackaholics.db"

# ---------------- Database Setup ----------------
def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            skills TEXT,
            location TEXT,
            trust_score INTEGER DEFAULT 0
        )
        """)
        conn.commit()
init_db()

# ---------------- Internship APIs ----------------
@app.route('/get_internships', methods=['GET'])
def get_internships():
    internships = pd.read_csv("internship.csv")
    internships['trust_score'] = (
        0.4 * internships['certificate_verified'].apply(lambda x: 1 if x == 'yes' else 0.5) +
        0.3 * internships['company_reputation'] +
        0.2 * internships['user_feedback_score'] +
        0.1 * internships['completion_rate']
    )
    recommended = internships.sort_values(by='trust_score', ascending=False)
    data = recommended.to_dict(orient='records')
    return jsonify(data)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    student_skills = data.get("skills", [])
    student_location = data.get("location", "")
    internships = pd.read_csv("internship.csv")

    matched = internships[internships['Required_Skills']
        .str.contains('|'.join(student_skills), case=False, na=False)]

    if student_location:
        matched = matched[matched['Location']
            .str.contains(student_location, case=False, na=False)]

    return jsonify(matched.to_dict(orient='records'))

# ---------------- Profile APIs ----------------
@app.route("/create_profile", methods=["POST"])
def create_profile():
    data = request.json
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO profiles (name, email, skills, location, trust_score)
            VALUES (?, ?, ?, ?, 0)
            ON CONFLICT(email) DO UPDATE SET
            name=excluded.name,
            skills=excluded.skills,
            location=excluded.location
        """, (data["name"], data["email"], ",".join(data["skills"]), data["location"]))
        conn.commit()
    return jsonify({"status": "Profile saved successfully!"})


@app.route("/get_profile/<email>", methods=["GET"])
def get_profile(email):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT name,email,skills,location,trust_score FROM profiles WHERE email=?", (email,))
        row = c.fetchone()
        if row:
            return jsonify({
                "name": row[0],
                "email": row[1],
                "skills": row[2].split(","),
                "location": row[3],
                "trust_score": row[4]
            })
        return jsonify({"error": "Profile not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
