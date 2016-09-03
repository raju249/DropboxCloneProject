import os
from server.database_setup import Folders
def createFolderHelper(rootFolder,folderName,userId,session):
    try:
        os.mkdir(rootFolder + "/" + folderName)
        folder = Folders(name = folderName,
                        num_files = 0,
                        user_id = userId,
                        parentRootFolder = rootFolder)
        return True
    except Exception as e:
        print e
        return False
    