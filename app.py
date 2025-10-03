import pandas as pd
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load internship dataset
internships = pd.read_csv("internship.csv")

# Endpoint to get all internships
@app.route('/get_internships', methods=['GET'])
def get_internships():
    return internships.to_json(orient="records")

# Endpoint to recommend internships for a student
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    student_skills = data.get("skills", [])
    student_location = data.get("location", "")

    # Simple matching logic: match any skill
    matched = internships[internships['Required_Skills']
                          .str.contains('|'.join(student_skills), case=False, na=False)]
    
    # Optional: filter by location
    if student_location:
        matched = matched[matched['Location']
                          .str.contains(student_location, case=False, na=False)]

    return matched.to_json(orient="records")

if __name__ == '__main__':
    app.run(debug=True)

import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get_internships')
def get_internships():
    internships = pd.read_csv("internship.csv")

    # Calculate trust_score (example)
    internships['trust_score'] = (
        0.4 * internships['certificate_verified'].apply(lambda x: 1 if x == 'yes' else 0.5) +
        0.3 * internships['company_reputation'] +
        0.2 * internships['user_feedback_score'] +
        0.1 * internships['completion_rate']
    )

    recommended = internships.sort_values(by='trust_score', ascending=False)
    data = recommended.to_dict(orient='records')

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
