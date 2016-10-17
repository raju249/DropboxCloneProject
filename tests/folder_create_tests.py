from nose.tools import *
from server.database_setup import DBSession
from server.folderCreation import createFolderHelper

def test_create_folder():
    session = DBSession()
    result = createFolderHelper("userFolders/email@email.com","test_name",1,session)
    assert_equal(result,True)