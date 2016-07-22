from flask import Flask,render_template,request,jsonify
from server.database_setup import User,DBSession
from server import signupLoginHelpers
import os

application = Flask(__name__)

@application.route("/",methods = ["GET","POST"])
def index():
    return render_template("index.html")
    
@application.route("/signup", methods = ["POST"])
def signup():
    session = DBSession()
    data = request.json
    nameForm = data["name"]
    emailForm = data["email"]
    passwordForm = data["password"]
    user = User(name = nameForm,email = emailForm,password = passwordForm)
    truth = signupLoginHelpers.check_duplicate_user(user,session)
    if truth:
        return jsonify(
                    {
                        "status" : "400BAD",
                        "message" : "User with same email exists :("
                    }
                )
    session.add(user)
    session.commit()
    session.close()
    return jsonify(
                    {
                       "status" : "200OK",
                       "message" : "success"
                    }
                )

if __name__ == "__main__":
    application.run(host = "0.0.0.0", port = int(os.environ.get("PORT")))