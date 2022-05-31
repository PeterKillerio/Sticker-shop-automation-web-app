from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class UsernameAndEmailAuthenticationBackend(ModelBackend):
    """ Customized authentication that can additioanlly give user option
        to login with either username or an email. """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        user = None

        # First check email
        try:
            user = UserModel.objects.get(email=username)
            if user.check_password(password):
                return user
        except:
            pass
        # Check username
        try:
            user = UserModel.objects.get(username=username)
            if user.check_password(password):
                return user
        except:
            pass

        return None
