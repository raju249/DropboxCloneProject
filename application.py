from flask import Flask,render_template,request,jsonify,redirect,url_for
from server.database_setup import User,DBSession
from server import signupLoginHelpers
from flask_login import login_required,logout_user,current_user
import os

application = Flask(__name__)
application.config['SECRET_KEY'] = '\x17\xf2\x0e\xa3\xf1G\x8e\xa8\xfd\xbf\xa2\t\xdf;|\x87\xb6\xb5\x8c\xa1\xb6\xd0u\x9d'
ROOT = "userFolders"
from flask_login import LoginManager,login_user
login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_view = "loginPage"
login_manager.init_app(application)

@login_manager.user_loader
def load_user(userid):
    session = DBSession()
    return session.query(User).get(int(userid))


@application.route("/loginPage", methods = ["GET","POST"])
def loginPage():
    return render_template("login.html")
    
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
    root = ROOT + "/" + emailForm
    user = User(name = nameForm,email = emailForm,password = passwordForm, rootFolder = root)
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
    os.mkdir(ROOT + "/" + emailForm)
    print ROOT + "/" + emailForm
    return jsonify(
                    {
                       "status" : "200OK",
                       "message" : "success"
                    }
                )

@application.route("/dashboard", methods = ["GET","POST"])
@login_required
def dashboard():
    return render_template("dashboard.html")
    
@application.route("/login", methods= ["GET","POST"])
def login():
    try:
        session = DBSession()
        data = request.json
        email = data["email"]
        password = data["password"]
        is_user = signupLoginHelpers.check_user(email,password,session)
        if is_user:
            login_user(is_user,False)
            return jsonify(
                    {
                        "status" :"200OK",
                        "message" :"success"
                    }
                )
        return jsonify(
                {
                    "status":"404NOTFOUND",
                    "message":"No user exists"
                }
            )
    except Exception as e:
        print e
        return "404"


@application.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))
    

if __name__ == "__main__":
    application.run(host = "0.0.0.0", port = int(os.environ.get("PORT")))