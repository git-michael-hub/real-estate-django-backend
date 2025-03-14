
from io import BytesIO
from PIL import Image

from django.contrib.auth.hashers import make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

from rest_framework.test import APITestCase

from sellers.models import SellerAccount
from buyers.models import BuyerAccount
from agents.models import AgentAccount

from .models import User, PasswordResetRequest


class TestUserSetUp(APITestCase):
    def setUp(self):
        # test_user will be used for tests that need existing objects related to User.
        self.test_user = User.objects.get(pk=10)

        # new_user will be used for tests that need to create new objects related to User.
        self.new_user = self.create_registered_user(
            {'username': 'newuser', 'password': 'Newuser123!', 'email': 'newuser@gmail.com'})

        self.register_url = reverse('register')
        self.user_url = reverse('user')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.request_password_reset_url = reverse('request-password-reset')

        self.unregistered_user_data = {
            'username': 'unregistereduser',
            'email': 'unregistereduser@gmail.com',
            'password': 'Testpassword123!',
            'first_name': 'jesmar',
            'last_name': 'marmar',
        }

        self.unregistered_user_login_data = {
            'username': self.unregistered_user_data['username'],
            'password': self.unregistered_user_data['password']
        }

        self.reset_password_data = {
            'password': 'Newpassword123!',
            'confirm_password': 'Newpassword123!'
        }

        self.test_password = 'Testpassword123!'

    def create_registered_user(self, user_data):
        """Creates a registered user directly in the database."""
        user = User.objects.create(
            email=user_data['email'],
            username=user_data['username'],
            password=make_password(user_data['password']),
            is_active=True)
        BuyerAccount.objects.create(user=user)
        SellerAccount.objects.create(user=user, is_active=False)
        AgentAccount.objects.create(user=user, is_active=False)
        return user

    def register_user(self, user_data):
        """Register a user via the API."""
        user_data['confirm_password'] = user_data['password']
        res = self.client.post(self.register_url, user_data)
        return res

    def login(self, login_data):
        """Logs in the user via the API."""
        res = self.client.post(self.login_url, login_data)
        return res

    def login_and_get_token(self, login_data):
        """Logs in the user and returns the authentication token."""
        res = self.login(login_data)
        token = res.data.get('token')
        return token

    def login_user(self, user):
        """Logs in the user by using takes in a User object and setting a known password."""
        user.set_password(self.test_password)
        user.save()
        login_data = {'username': user.username,
                      'password': self.test_password}
        return self.login(login_data)

    def login_user_and_get_token(self, user):
        """
        Logs in the user by using takes in a User object and setting a known password.
        Then it returns the authentication token.
        """
        user.set_password(self.test_password)
        user.save()
        login_data = {'username': user.username,
                      'password': self.test_password}
        return self.login_and_get_token(login_data)

    def create_auth_header(self, token):
        """Creates an authorization header for authenticated requests."""
        return {'Authorization': f'Token {token}'}

    def generate_test_image(self):
        """Creates image file for testing."""
        image_io = BytesIO()
        image = Image.new(
            "RGB",
            (100, 100),
            color=(255, 0, 0)
        )
        image.save(image_io, format="JPEG")
        image_file = SimpleUploadedFile(
            "test.jpg",
            image_io.getvalue(),
            content_type="image/jpeg"
        )

        return image_file

    def tearDown(self):
        super().tearDown()


class TestUserView(TestUserSetUp):
    fixtures = ['users.json']

    def test_user_can_register(self):
        #  test register
        res = self.register_user(self.unregistered_user_data)
        self.assertEqual(res.status_code, 201)

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

    def test_user_have_agent_seller_buyer_accounts_after_registration(self):
        # test user should have a buyer, seller and account account after registration.
        self.register_user(self.unregistered_user_data)
        user = User.objects.get(
            username=self.unregistered_user_data['username'])
        self.assertEqual(bool(user.buyer_account), True)
        self.assertEqual(bool(user.seller_account), True)
        self.assertEqual(bool(user.agent_account), True)

        # test user seller and agent account should be inactive by default.
        self.assertEqual(user.seller_account.is_active, False)
        self.assertEqual(user.agent_account.is_active, False)

    def test_user_can_verify_email(self):
        # test verify-email
        self.register_user(self.unregistered_user_data)
        user = User.objects.get(email=self.unregistered_user_data['email'])
        email_verification_url = reverse(
            'verify-email',
            kwargs={'email': self.unregistered_user_data['email']}
        )
        res = self.client.patch(
            email_verification_url,
            {'email_verification_pin': user.email_verification_pin}
        )
        self.assertEqual(res.status_code, 200)

        # test if user.is_active is updated from False to True after successful verification
        user.refresh_from_db()
        self.assertEqual(user.is_active, True)

        # test if email_verification_pin is successfully deleted after successful verification
        self.assertEqual(user.email_verification_pin, None)

    def test_user_cannot_verify_email_with_invalid_data(self):
        # test verify-email with wrong pin
        self.register_user(self.unregistered_user_data)
        user = User.objects.get(email=self.unregistered_user_data['email'])
        wrong_pin = "000000"
        email_verification_url = reverse(
            'verify-email',
            kwargs={'email': self.unregistered_user_data['email']}
        )
        res = self.client.patch(
            email_verification_url,
            {'email_verification_pin': wrong_pin}
        )
        user.refresh_from_db()
        self.assertEqual(res.status_code, 400)
        self.assertEqual(user.is_active, False)

    def test_user_can_login(self):
        # test login with existing user
        res = self.login_user(self.test_user)
        self.assertEqual(res.status_code, 200)

        # test login with newly registered user with verified email
        res = self.login_user(self.new_user)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_login_with_unverified_email(self):
        # test login with registered user with unverified email
        self.register_user(self.unregistered_user_data)
        res = self.login(self.unregistered_user_login_data)
        self.assertEqual(res.status_code, 400)

    def test_user_cannot_login_with_invalid_credentials(self):
        # test login without the user being registered
        res1 = self.login(self.unregistered_user_login_data)
        self.assertEqual(res1.status_code, 400)

        # test login with wrong password
        invalid_login_data = {'username': self.test_user.username,
                              'password': 'wrong_password'}
        res2 = self.login(invalid_login_data)
        self.assertEqual(res2.status_code, 400)

    def test_auth_user_can_get_user_data(self):
        # test if authorized user can get their details
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(self.user_url,
                              headers=self.create_auth_header(token)
                              )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['username'],
                         self.test_user.username)

    def test_not_auth_user_cannot_get_user_data(self):
        # test if unauthorized user can get their details
        self.login_user_and_get_token(self.test_user)
        token = 'wrong_token'
        res = self.client.get(self.user_url,
                              headers=self.create_auth_header(token)
                              )
        self.assertEqual(res.status_code, 401)

    def test_registered_user_can_request_password_reset(self):
        # test request-password-reset
        data = {'email': self.test_user.email}
        res = self.client.post(self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 201)

    def test_not_registered_user_cannot_request_password_reset(self):
        # test request-password-reset with unregistered user
        data = {'email': self.unregistered_user_data['email']}
        res = self.client.post(self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 400)

    def test_user_can_reset_password(self):
        # test reset-password
        data = {'email': self.test_user.email}
        old_password_hash = self.test_user.password
        self.client.post(self.request_password_reset_url, data)
        token = PasswordResetRequest.objects.get(user=self.test_user).token

        res = self.client.patch(
            reverse('reset-password', kwargs={'token': token}), self.reset_password_data)
        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertNotEqual(self.test_user.password, old_password_hash)

    def test_user_cannot_reset_password_with_invalid_data(self):
        data = {'email': self.test_user.email}
        old_password_hash = self.test_user.password
        self.client.post(self.request_password_reset_url, data)

        # test reset-password with wrong token
        res1 = self.client.patch(
            reverse('reset-password', kwargs={'token': 'wrong_token'}),
            self.reset_password_data
        )
        self.test_user.refresh_from_db()
        self.assertEqual(res1.status_code, 404)
        self.assertEqual(self.test_user.password, old_password_hash)

        # test reset-password with non-matching passwords
        token = PasswordResetRequest.objects.get(user=self.test_user).token
        self.reset_password_data['confirm_password'] = 'Wrong_confirm_password123!'
        res2 = self.client.patch(
            reverse('reset-password', kwargs={'token': token}),
            self.reset_password_data
        )
        self.test_user.refresh_from_db()
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(self.test_user.password, old_password_hash)
