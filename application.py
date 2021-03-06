from flask import Flask,render_template,request,jsonify,redirect,url_for,send_from_directory
from server.database_setup import User,DBSession,Folders,Files
from server import signupLoginHelpers
from flask_login import login_required,logout_user,current_user
import os,shutil
from werkzeug.utils import secure_filename
from server.folderCreation import createFolderHelper

application = Flask(__name__)
application.config['SECRET_KEY'] = '\x17\xf2\x0e\xa3\xf1G\x8e\xa8\xfd\xbf\xa2\t\xdf;|\x87\xb6\xb5\x8c\xa1\xb6\xd0u\x9d'
ROOT = os.getcwd()
if not os.path.exists(ROOT + "/userFolders"):
    os.mkdir(ROOT + "/userFolders")
PARENT = ROOT + "/userFolders"

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
    root = PARENT + "/" + emailForm
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
    os.mkdir(PARENT + "/" + emailForm)
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

@application.route("/folder", methods = ["GET","POST"])
def createFolder():
    try:
        session = DBSession()
        data = request.json
        folderName = data["name"]
        rootFolder = current_user.rootFolder
        user_id = current_user.id
        created = createFolderHelper(rootFolder,folderName,user_id,session)
        if created:
            return jsonify(
                    {
                        "status":"200OK",
                    }
                )
        else:
            return jsonify(
                    {
                        "status":"400"
                    }
                )
    except Exception as e:
        print e
        return "400"
   
@application.route("/uploadFile",methods = ["GET","POST"])
def uploadFile():
    try:
        session = DBSession()
        file = request.files["file"]
        folder = request.form["folder"]
        folder_id = session.query(Folders).filter_by(name = str(folder)).first()
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_user.rootFolder + "/" + folder + "/",filename))
        db_file = Files(name = filename,folder_id = folder_id.id,parentFolder = current_user.rootFolder + "/" + folder)
        session.add(db_file)
        session.commit()
        session.close()
        return "True"
    except Exception as e:
        print e
        return "False"
        

@application.route("/userFolder",methods = ["GET"])
def getFolders():
    try:
        session = DBSession()
        folders_array = []
        folders = session.query(Folders).filter_by(user_id = current_user.id)
        for folder in folders:
            files = session.query(Files).filter_by(folder_id = folder.id)
            folders_array.append({
                "name":folder.name,
                "files":[file.name for file in files]
            })
        return jsonify(folders_array)
    except Exception as e:
        print e
        return "False"

@application.route("/download/<folder>/<file>",methods=["GET","POST"])
@login_required
def download(folder,file):
    folder = current_user.rootFolder + "/" + folder + "/"
    return send_from_directory(folder,file)
    
@application.route("/delete/<folder>/<file>",methods=["GET","POST"])
@login_required
def delete(folder,file):
    try:
        session = DBSession()
        session.query(Files).filter_by(name = file).delete()
        session.commit()
        os.remove(current_user.rootFolder + "/" + folder + "/" + file)
        return render_template("delete.html")
    except Exception as e:
        print e
        return "False"

@application.route("/delete/<folder>",methods=["GET"])
@login_required
def deleteFolder(folder):
    try:
        session = DBSession()
        session.query(Folders).filter_by(name = folder).delete()
        session.query(Files).filter_by(parentFolder = current_user.rootFolder + "/" + folder).delete()
        session.commit()
        folder_to_remove = current_user.rootFolder + "/" + folder
        shutil.rmtree(folder_to_remove)
        return "True"
    except Exception as e:
        print e
        return "False"

@application.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))
    

if __name__ == "__main__":
    application.run(host = "0.0.0.0", port = int(os.environ.get("PORT")))