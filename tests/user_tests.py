from nose.tools import *
from server.database_setup import User,DBSession
from server.signupLoginHelpers import check_duplicate_user,check_user


def test_insert_user():
    session = DBSession()
    user = User(name = "Rajendra",
                email = "email@email.com",
                password = "password",
                rootFolder = "rootFolder")
    result = check_duplicate_user(user,session)
    assert_equal(result,False)
    result_inserted = check_user("email@email.com","password",session)
    assert_equal(result_inserted,False)
