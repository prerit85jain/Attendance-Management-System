from flask import Flask, jsonify, render_template, request, json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Data for Admissions
data_admission = pd.read_csv('./Dataset/admission prediction.csv');

df_admission = pd.DataFrame(data_admission)


def create_admission_plot(course):
    X = df_admission[['Year']]
    y = df_admission[course]

    model = LinearRegression()
    model.fit(X, y)

    next_year = [[2024]]
    predicted_admission = model.predict(next_year)[0]

    years_extended = np.append(df_admission['Year'], 2024).reshape(-1, 1)
    predictions_extended = model.predict(years_extended)

    plt.figure(figsize=(8, 4))

    plt.bar(df_admission['Year'], df_admission[course], label='Admissions', alpha=0.5, color='blue')
    plt.bar(2024, predicted_admission, label='Predicted Admission for 2024', alpha=0.5, color='green')
    plt.plot(years_extended, predictions_extended, color='red', label='Trend Line')

    plt.xlabel('Year')
    plt.ylabel(f'{course} Admissions')
    plt.title(f'Year vs Admissions for {course}')
    plt.legend()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    return plot_url, int(predicted_admission)


def read_data():
    departments = ['BBA', 'Btech Civil', 'Btech CSE', 'Btech Electrical', 'Btech Electronics', 'MBA', 'MTech']
    data = {}
    for dept in departments:
        file_path = f'./Dataset/Placements/{dept}.csv'
        data[dept] = pd.read_csv(file_path)
    return data

data_placement = read_data()

def create_placement_plot(course):
    df_placement = data_placement[course];
    X = df_placement[['Year','Total Students']]
    y = df_placement['Students Placed']

    model = LinearRegression()
    model.fit(X, y)

    new_data = np.array([[2024, 300]]) 
    predicted_placement = model.predict(new_data)
    
    new_row = pd.DataFrame({'Year': [2024], 'Total Students': [300], 'Students Placed': [predicted_placement[0]]})
    df_placement = pd.concat([df_placement, new_row], ignore_index=True)

    plt.figure(figsize=(8, 5))
    plt.bar(df_placement['Year'], df_placement['Students Placed'], color='lightblue', label='Students Placed')
    plt.xlabel('Year')
    plt.ylabel('Students Placed')
    plt.title('Students Placed vs Year')
    
    # Extend trend line
    X_years = np.arange(2013, 2025).reshape(-1, 1)
    X_total_students = np.full_like(X_years, 300)  # example value for Total Students in 2024
    X_extended = np.concatenate((X_years, X_total_students), axis=1)
    y_predicted_extended = model.predict(X_extended)
    plt.plot(X_years, y_predicted_extended, color='red', linestyle='--', label='Trend line (extended)')
    
    # Highlight predicted value for 2024
    plt.scatter(2024, predicted_placement, color='green', label=f'Prediction for 2024: {int(predicted_placement)}')
    plt.legend()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    return plot_url, int(predicted_placement)
    

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/attendance')
def attendance():
    return render_template("attendance.html")

@app.route('/admission_predictor')
def admission():
    return render_template("admission.html", courses=list(data_admission.keys())[1:])


@app.route('/get_admission_data', methods=['POST'])
def get_admission_data():
    course = request.form['course']
    plot_url, predicted_admission = create_admission_plot(course)
    dict_admission= df_admission[['Year', course]].to_dict(orient='records')
    return jsonify(plot_url=plot_url, predicted_admission=predicted_admission, dict_admission=dict_admission)



@app.route('/placement_predictor')
def placement():
    return render_template("placement.html", courses=list(data_placement.keys()))

@app.route('/get_Placement_data', methods=['POST'])
def get_placement_data():
    course = request.form['course']
    plot_url, predicted_placement = create_placement_plot(course)
    df_placement = data_placement[course]
    dict_placement = df_placement[['Year','Students Placed']].to_dict(orient='records')
    return jsonify(plot_url=plot_url, predicted_placement=predicted_placement, dict_placement=dict_placement)

@app.route('/faculty')
def faculty():
    return render_template("attendanceFaculty.html")


if __name__ == "__main__":
    app.run(debug=True)
