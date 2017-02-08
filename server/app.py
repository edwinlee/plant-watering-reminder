from flask import Flask, request, jsonify
from flaskext.mysql import MySQL
import requests
mysql = MySQL()
app = Flask(__name__)

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pythondogs'
app.config['MYSQL_DATABASE_DB'] = 'WeatherData'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

# todo - convert API's to REST API's
@app.route("/getCurrentForecast")
def getCurrentForecast():
	r = requests.get('http://api.wunderground.com/api/b238215cbce16dba/conditions/q/pws:KCASANMA63.json')
	parsed_json = r.json()

	return jsonify({'StatusCode':'200','Message': parsed_json['current_observation']['weather']})

@app.route("/getExistingForecast")
def getExistingForecast():
	startDate = request.args.get('start_date')
	endDate = request.args.get('end_date')
	cursor = mysql.connect().cursor()
	cursor.execute("SELECT forecast FROM Weather WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'")
	data = cursor.fetchall()

	if data is None:
		return jsonify({'StatusCode':'500','Message': 'No weather data for that date range'})
	else:
		return jsonify({'StatusCode':'200','Message': data})

@app.route("/createForecast", methods = ['POST'])
def createForecast():
	_date = str(request.form['date'])
	_forecast = str(request.form['forecast'])

	conn = mysql.connect()
	cursor = conn.cursor()
	cursor.execute("INSERT INTO Weather (date, forecast) VALUES (%s, %s)", (_date, _forecast))
	conn.commit()

	return jsonify({'StatusCode':'200','Message': 'Created successfully'})

@app.route("/updateForecast", methods = ['PUT'])
def updateForecast():
	_date = str(request.form['date'])
	_forecast = str(request.form['forecast'])

	conn = mysql.connect()
	cursor = conn.cursor()
	cursor.execute("UPDATE Weather SET forecast = %s WHERE date = %s", (_forecast, _date))
	conn.commit()

	return jsonify({'StatusCode':'200','Message': 'Updated successfully'})

@app.route("/getSchedule")
def getSchedule():
	startDate = request.args.get('start_date')
	endDate = request.args.get('end_date')
	cursor = mysql.connect().cursor()
	cursor.execute("SELECT date FROM Schedule WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "'")
	data = cursor.fetchall()

	if data is None:
		return jsonify({'StatusCode':'500','Message': 'No watering data for that date range'})
	else:
		return jsonify({'StatusCode':'200','Message': data})

@app.route("/createSchedule", methods = ['POST'])
def createSchedule():
	_date = str(request.form['date'])

	conn = mysql.connect()
	cursor = conn.cursor()
	cursor.execute("INSERT INTO Schedule (date) VALUES (%s)", (_date))
	conn.commit()

	return jsonify({'StatusCode':'200','Message': 'Submitted successfully'})


@app.route("/")
def hello():
	return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)
