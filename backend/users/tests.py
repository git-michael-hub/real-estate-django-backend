from datetime import date

from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.core.management import call_command

from rest_framework.test import APITestCase

# from buyers.models import BuyerAccount
# from sellers.models import SellerAccount, SellerApplication

from .models import User, PasswordResetRequest


class TestUserSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.auth_user_url = reverse('auth-user')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.request_password_reset_url = reverse('request-password-reset')

        self.unregistered_user_data = {
            'username': 'unregistereduser',
            'email': 'unregistereduser@gmail.com',
            'password': 'testpassword123',
            'first_name': 'jesmar',
            'last_name': 'marmar',
        }

        self.unregistered_user_login_data = {
            'username': self.unregistered_user_data['username'],
            'password': self.unregistered_user_data['password']
        }

        self.reset_password_data = {
            'new_password': 'Newpassword123!',
            'confirm_password': 'Newpassword123!'
        }

        self.test_password = 'testpassword123'

        # self.user_data = {
        #     'email': 'testemail@gmail.com',
        #     'username': 'testusername',
        #     'password': 'testpassword123',
        #     'confirm_password': 'testpassword123'
        # }

        # self.registered_buyer_data = {
        #     'email': 'registeredbuyer@gmail.com',
        #     'username': 'registeredbuyer',
        #     'password': 'testpassword123',
        #     'first_name': 'maxibuyer',
        #     'last_name': 'macmacbuyer'
        # }

        # self.registered_seller_data = {
        #     'email': 'registeredseller@gmail.com',
        #     'username': 'registeredseller',
        #     'password': 'testpassword123',
        #     'first_name': 'maxiseller',
        #     'last_name': 'macmacseller',
        #     'address': 'maxiseller address',
        #     'gender': 'M',
        #     'birthdate': date(1990, 3, 19),
        #     'contact_number_1': 111111111,
        # }

        # self.login_data = {
        #     'username': self.user_data['username'],
        #     'password': self.user_data['password']
        # }

        # self.registered_buyer_login_data = {
        #     'username': self.registered_buyer_data['username'],
        #     'password': self.registered_buyer_data['password']
        # }

        # self.registered_seller_login_data = {
        #     'username': self.registered_seller_data['username'],
        #     'password': self.registered_seller_data['password']
        # }

        # self.buyer_account = self.create_buyer(self.registered_buyer_data)

        # self.seller_account = self.create_seller(
        #     self.registered_seller_data)

    # def create_buyer(self, buyer_data):
    #     hashed_password = make_password(password=buyer_data['password'])
    #     user = User(email=buyer_data['email'],
    #                 username=buyer_data['username'],
    #                 password=hashed_password)
    #     user.save()
    #     buyer_account = BuyerAccount(user=user,
    #                                  first_name=buyer_data['first_name'],
    #                                  last_name=buyer_data['last_name'])
    #     buyer_account.save()
    #     return buyer_account

    # def create_seller_application(self, user_data):
    #     seller_application = SellerApplication(
    #         email=user_data['email'],
    #         username=user_data['username'],
    #         password=make_password(user_data['password']),
    #         first_name=user_data['first_name'],
    #         last_name=user_data['last_name'],
    #         address=user_data['address'],
    #         birthdate=user_data['birthdate'],
    #         gender=user_data['gender'],
    #         contact_number_1=user_data['contact_number_1'],
    #         status='P'
    #     )
    #     seller_application.save()
    #     return seller_application

    # def create_seller(self, user_data):
    #     application = self.create_seller_application(user_data)
    #     user = User(email=application.email,
    #                 username=application.username,
    #                 password=application.password
    #                 )
    #     seller_account = SellerAccount(
    #         user=user,
    #         sellerapplication_ptr=application,
    #         birthdate=application.birthdate,
    #         application_date=application.application_date,
    #         contact_number_1=application.contact_number_1
    #     )
    #     application.status = 'A'
    #     user.save()
    #     seller_account.save()
    #     application.save()

    #     return seller_account

    # create a registered user directly
    def create_registered_user(self, user_data):
        user = User.objects.create(
            email=user_data['email'],
            username=user_data['username'],
            password=make_password(user_data['password']),
            is_active=True)
        return user

    # register a user through API
    def register_user(self, user_data):
        user_data['confirm_password'] = user_data['password']
        res = self.client.post(self.register_url, user_data)
        return res

    # login using a dictionary of a user's login_data
    def login(self, login_data):
        res = self.client.post(self.login_url, login_data)
        return res

    # same as login(self, login_data) but returns a token
    def login_and_get_token(self, login_data):
        res = self.login(login_data)
        token = res.data['token']
        return token

    # login using a user object
    def login_user(self, user):
        user.set_password(self.test_password)
        user.save()
        login_data = {'username': user.username,
                      'password': self.test_password}
        return self.login(login_data)

    # same as login_user(self, user) but returns a token
    def login_user_and_get_token(self, user):
        user.set_password(self.test_password)
        user.save()
        login_data = {'username': user.username,
                      'password': self.test_password}
        return self.login_and_get_token(login_data)

    def create_auth_header(self, token):
        return {'Authorization': f'Token {token}'}

    def tearDown(self):
        return super().tearDown()


class TestUserView(TestUserSetUp):
    fixtures = ['users.json']

    def test_user_can_register(self):
        #  test register
        res = self.register_user(self.unregistered_user_data)
        self.assertEqual(res.status_code, 201)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_register_with_invalid_data(self):
        # test register with password and confirm_password is not the same
        self.unregistered_user_data['confirm_password'] = 'passworddoesnotmatch'
        res = self.client.post(self.register_url, self.unregistered_user_data)
        self.assertEqual(res.status_code, 400)
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']

        # test register with invalid email
        self.unregistered_user_data['email'] = 'invalidemail'
        res = self.client.post(self.register_url, self.unregistered_user_data)
        self.assertEqual(res.status_code, 400)
        self.unregistered_user_data['email'] = 'unregistereduser@gmail.com'

        # test register duplicate credentials
        res = self.client.post(self.register_url, self.unregistered_user_data)
        self.assertEqual(res.status_code, 201)
        res = self.client.post(self.register_url, self.unregistered_user_data)
        self.assertEqual(res.status_code, 400)

    # -------------------------------------------------------------------------------------------

    def test_user_can_verify_email(self):
        # test email-verification
        self.register_user(self.unregistered_user_data)
        user = User.objects.get(email=self.unregistered_user_data['email'])
        email_verification_url = reverse(
            'email-verification',
            kwargs={'email': self.unregistered_user_data['email']}
        )
        res = self.client.patch(
            email_verification_url,
            {'email_verification_pin': user.email_verification_pin}
        )
        self.assertEqual(res.status_code, 200)

        # test if user.is_active is updated from False to True after successful verification
        self.assertEqual(user.is_active, False)
        user = User.objects.get(email=self.unregistered_user_data['email'])
        self.assertEqual(user.is_active, True)

        # test if email_verification_pin is successfully deleted after successful verification
        self.assertEqual(user.email_verification_pin, None)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_verify_email_with_invalid_data(self):
        # test email-verification with wrong pin
        self.register_user(self.unregistered_user_data)
        user = User.objects.get(email=self.unregistered_user_data['email'])
        wrong_pin = 000000
        email_verification_url = reverse(
            'email-verification',
            kwargs={'email': self.unregistered_user_data['email']}
        )
        res = self.client.patch(
            email_verification_url,
            {'email_verification_pin': wrong_pin}
        )
        self.assertEqual(res.status_code, 400)
        self.assertEqual(user.is_active, False)

    # -------------------------------------------------------------------------------------------

    def test_user_can_login(self):
        # test login with existing user
        user = User.objects.get(pk=10)
        res = self.login_user(user)
        self.assertEqual(res.status_code, 200)

        # test login with registered user with unverified email
        self.register_user(self.unregistered_user_data)
        res = self.login(self.unregistered_user_login_data)
        self.assertEqual(res.status_code, 400)

        # test login with registered user with verified email
        user = User.objects.get(email=self.unregistered_user_data['email'])
        user.is_active = True
        user.email_verification_pin = None
        user.save()
        res = self.login(self.unregistered_user_login_data)
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_login_with_wrong_credentials(self):
        # test login without the user being registered
        res1 = self.login(self.unregistered_user_login_data)
        self.assertEqual(res1.status_code, 400)

        # test login with wrong password
        self.create_registered_user(self.unregistered_user_data)
        self.unregistered_user_login_data['password'] = 'wrong_password'
        res2 = self.login(self.unregistered_user_login_data)
        self.assertEqual(res2.status_code, 400)

    # -------------------------------------------------------------------------------------------

    def test_auth_user_can_get_user_data(self):
        # test if authorized user can get their details
        self.create_registered_user(self.unregistered_user_data)
        token = self.login_and_get_token(self.unregistered_user_login_data)
        res = self.client.get(self.auth_user_url,
                              self.unregistered_user_data,
                              headers=self.create_auth_header(token)
                              )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['username'],
                         self.unregistered_user_data['username'])

    # -------------------------------------------------------------------------------------------

    def test_not_auth_user_cannot_get_user_data(self):
        # test if unauthorized user can get their details
        self.create_registered_user(self.unregistered_user_data)
        token = 'wrong_token'
        res = self.client.get(self.auth_user_url,
                              self.unregistered_user_login_data,
                              headers=self.create_auth_header(token)
                              )
        self.assertEqual(res.status_code, 401)

    # -------------------------------------------------------------------------------------------

    def test_registered_user_can_request_reset_password(self):
        # test request-password-reset
        self.create_registered_user(self.unregistered_user_data)
        data = {'email': self.unregistered_user_data['email']}
        res = self.client.post(self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_not_registered_user_cannot_request_reset_password(self):
        # test request-password-reset with unregistered user
        data = {'email': 'not_registered_email@gmail.com'}
        res = self.client.post(self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 404)

    # -------------------------------------------------------------------------------------------

    def test_user_can_reset_password(self):
        # test password-reset
        self.create_registered_user(self.unregistered_user_data)
        data = {'email': self.unregistered_user_data['email']}
        self.client.post(self.request_password_reset_url, data)
        token = PasswordResetRequest.objects.get(email=data['email']).token

        res2 = self.client.post(
            reverse('password-reset', kwargs={'token': token}), self.reset_password_data)
        self.assertEqual(res2.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_reset_password_with_invalid_data(self):
        self.create_registered_user(self.unregistered_user_data)
        data = {'email': self.unregistered_user_data['email']}
        self.client.post(self.request_password_reset_url, data)

        # test password-reset with wrong token
        res1 = self.client.post(
            reverse('password-reset', kwargs={'token': 'wrong_token'}),
            self.reset_password_data
        )
        self.assertEqual(res1.status_code, 400)

        # test password-reset with non-matching passwords
        token = PasswordResetRequest.objects.get(email=data['email']).token
        self.reset_password_data['confirm_password'] = 'Wrong_confirm_password123!'
        res2 = self.client.post(
            reverse('password-reset', kwargs={'token': token}),
            self.reset_password_data
        )
        self.assertEqual(res2.status_code, 400)
