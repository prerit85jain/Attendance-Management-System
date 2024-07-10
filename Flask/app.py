from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/attendance')
def attendance():
    return render_template("attendance.html")

@app.route('/admision_predictor')
def admission():
    return render_template("admission.html")

@app.route('/placement_prediction')
def placement():
    return render_template("placement.html")

if __name__ == "__main__":
    app.run(debug=True)