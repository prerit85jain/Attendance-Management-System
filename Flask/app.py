from flask import (
    Flask,
    jsonify,
    render_template,
    request,
    json,
    send_file,
    url_for,
    flash,
    redirect,
    session,
)
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from sklearn.linear_model import LinearRegression
import qrcode
import os
import openpyxl

# from zipfile import BadZipFile


app = Flask(__name__)

# Data for Admissions
data_admission = pd.read_csv("./Dataset/admission prediction.csv")

df_admission = pd.DataFrame(data_admission)


def create_admission_plot(course):
    X = df_admission[["Year"]]
    y = df_admission[course]

    model = LinearRegression()
    model.fit(X, y)

    next_year = [[2024]]
    predicted_admission = model.predict(next_year)[0]

    years_extended = np.append(df_admission["Year"], 2024).reshape(-1, 1)
    predictions_extended = model.predict(years_extended)

    plt.figure(figsize=(8, 4))

    plt.bar(
        df_admission["Year"],
        df_admission[course],
        label="Admissions",
        alpha=0.5,
        color="blue",
    )
    plt.bar(
        2024,
        predicted_admission,
        label="Predicted Admission for 2024",
        alpha=0.5,
        color="green",
    )
    plt.plot(years_extended, predictions_extended, color="red", label="Trend Line")

    plt.xlabel("Year")
    plt.ylabel(f"{course} Admissions")
    plt.title(f"Year vs Admissions for {course}")
    plt.legend()

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    return plot_url, int(predicted_admission)


def read_data():
    departments = [
        "BBA",
        "BTech Civil",
        "BTech CSE",
        "BTech Electrical",
        "BTech Electronics",
        "MBA",
        "MTech",
    ]
    data = {}
    for dept in departments:
        file_path = f"./Dataset/Placements/{dept}.csv"
        data[dept] = pd.read_csv(file_path)
    return data


data_placement = read_data()


def create_placement_plot(course):
    df_placement = data_placement[course]
    X = df_placement[["Year", "Total Students"]]
    y = df_placement["Students Placed"]

    model = LinearRegression()
    model.fit(X, y)

    new_data = np.array([[2024, 300]])
    predicted_placement = model.predict(new_data)

    new_row = pd.DataFrame(
        {
            "Year": [2024],
            "Total Students": [300],
            "Students Placed": [predicted_placement[0]],
        }
    )
    df_placement = pd.concat([df_placement, new_row], ignore_index=True)

    plt.figure(figsize=(8, 5))
    plt.bar(
        df_placement["Year"],
        df_placement["Students Placed"],
        color="lightblue",
        label="Students Placed",
    )
    plt.xlabel("Year")
    plt.ylabel("Students Placed")
    plt.title("Students Placed vs Year")

    # Extend trend line
    X_years = np.arange(2013, 2025).reshape(-1, 1)
    X_total_students = np.full_like(
        X_years, 300
    )  # example value for Total Students in 2024
    X_extended = np.concatenate((X_years, X_total_students), axis=1)
    y_predicted_extended = model.predict(X_extended)
    plt.plot(
        X_years,
        y_predicted_extended,
        color="red",
        linestyle="--",
        label="Trend line (extended)",
    )

    # Highlight predicted value for 2024
    plt.scatter(
        2024,
        predicted_placement,
        color="green",
        label=f"Prediction for 2024: {int(predicted_placement)}",
    )
    plt.legend()

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    return plot_url, int(predicted_placement)


@app.route("/")
def login():
    return render_template("login.html")

@app.route("/dash")
def home():
    return render_template("index.html")


@app.route("/attendance")
def attendance():
    return render_template("attendance.html")


@app.route("/admission_predictor")
def admission():
    return render_template("admission.html", courses=list(data_admission.keys())[1:])


@app.route("/get_admission_data", methods=["POST"])
def get_admission_data():
    course = request.form["course"]
    plot_url, predicted_admission = create_admission_plot(course)
    dict_admission = df_admission[["Year", course]].to_dict(orient="records")
    return jsonify(
        plot_url=plot_url,
        predicted_admission=predicted_admission,
        dict_admission=dict_admission,
    )


@app.route("/placement_predictor")
def placement():
    return render_template("placement.html", courses=list(data_placement.keys()))


@app.route("/get_Placement_data", methods=["POST"])
def get_placement_data():
    course = request.form["course"]
    plot_url, predicted_placement = create_placement_plot(course)
    df_placement = data_placement[course]
    dict_placement = df_placement[["Year", "Students Placed"]].to_dict(orient="records")
    return jsonify(
        plot_url=plot_url,
        predicted_placement=predicted_placement,
        dict_placement=dict_placement,
    )


@app.route("/faculty")
def faculty():
    return render_template("attendanceFaculty.html")


@app.route("/admin_portal")
def admin_portal():
    return render_template("admin.html")


@app.route("/admin_portal", methods=["POST"])
def get_admin_data():

    return "File type not allowed"


from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)

# Configure SQLAlchemy with SQLite
import sqlite3


def create_table(table_name):
    # Connect to (or create) the SQLite database
    conn = sqlite3.connect("attendance.db")

    # Create a cursor object to execute SQL commands
    cursor = conn.cursor()

    # Create a table if it doesn't exist
    cursor.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            name TEXT UNIQUE,
            roll_number INTEGER
        )
    """
    )
    print(f"Table {table_name} created successfully!")

    conn.commit()  # Commit changes
    conn.close()  # Close the connection


# creating database according to subject
@app.route("/qr", methods=["POST"])
def scanFaculty():
    table_name = request.json.get("code_Data")
    if table_name:
        try:
            create_table(table_name)

            return jsonify({"Server data": f"{table_name}"})
        except ValueError:
            return jsonify(
                {"error": "QR code data is not in expected format (name, roll_number)"}
            )
    else:
        return jsonify({"error": "No QR code found"})


def insert_student(table_name, name, roll_number):
    conn = sqlite3.connect("attendance.db")  # Connect to the specific database
    cursor = conn.cursor()
    print("inserting into database")

    # Insert the student details
    cursor.execute(
        f"""
        INSERT INTO  {table_name} (name, roll_number) VALUES (?, ?)
    """,
        (name, roll_number),
    )
    print("inserted")

    conn.commit()  # Commit the transaction
    conn.close()  # Close the connection


# Route to handle QR code scan
@app.route("/scanStudent", methods=["POST"])
def scan():
    student_details = request.json.get("student_details")
    print(student_details)
    if student_details:
        try:
            name, roll_number, table_name = student_details.split(",")
            roll_number = int(roll_number)  # Ensure roll_number is an integer
            print(table_name)
            # Create a new attendance entry
            insert_student(table_name, name, roll_number)

            # db.session.add(attendance)
            # db.session.commit()

            return jsonify({"data": f"Name: {name}, Roll Number: {roll_number}"})
        except ValueError:
            return jsonify(
                {"error": "QR code data is not in expected format (name, roll_number)"}
            )
    else:
        return jsonify({"error": "No QR code found"})


# Sample user data
users_df = pd.read_csv("Credentials.csv")
app.secret_key = "gla"


# @app.route("/l")
# def login():
#     return render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    college_id = request.form["college-id"]
    password = request.form["password"]

    user = users_df[
        (users_df["User_ID"] == college_id) & (users_df["Password"] == password)
    ]
    student_name = user["User_ID"].values[0]
    depart_name = user["Department"].values[0]
    student_roll = int(user["Roll"].values[0])  # Convert to standard int
    session["depart_name"] = depart_name
    session["student_name"] = student_name
    session["student_roll"] = student_roll
    if not user.empty:
        usertype = user.iloc[0]["Type"]
        if usertype == "Teacher":
            return redirect(url_for("teacher_portal"))
        else:
            return redirect(url_for("student_portal"))
    else:
        error = "Invalid College ID or Password"
        return render_template("login.html", error=error)


@app.route("/teacher-portal")
def teacher_portal():
    student_name = session.get("student_name", None)
    student_roll = session.get("student_roll", None)
    depart_name = session.get("depart_name", None)

    if student_name and student_roll and depart_name:
        return render_template(
            "attendanceFaculty.html",
            student_name=student_name,
            student_roll=student_roll,
            depart_name=depart_name
        )


@app.route("/student-portal")
def student_portal():
    # Retrieve user details from session
    student_name = session.get("student_name", None)
    student_roll = session.get("student_roll", None)

    if student_name and student_roll:
        return render_template(
            "attendance.html", student_name=student_name, student_roll=student_roll
        )
    else:
        return redirect(
            url_for("login")
        )  # If session data is missing, redirect to login


if __name__ == "__main__":
    app.run(debug=True)
