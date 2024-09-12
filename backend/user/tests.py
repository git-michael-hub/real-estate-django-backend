from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework.test import APITestCase

from .models import EmailVerificationRequest, PasswordResetRequest, Roles


class TestUserSetUp(APITestCase):
    def setUp(self):
        self.auth_user_url = reverse('auth-user')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.request_email_verification_url = reverse(
            'request-email-verification')
        self.register_url = reverse('register')
        self.request_password_reset_url = reverse('request-password-reset')

        self.user_data = {
            'email': 'testemail@gmail.com',
            'username': 'testusername',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123'
        }

        self.login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }

        self.reset_password_data = {
            'new_password': 'Newpassword123!',
            'confirm_password': 'Newpassword123!'
        }

        return super().setUp()

    def create_registered_user(self, user_data):
        user = User.objects.create(
            email=user_data['email'], username=user_data['username'], password=make_password(user_data['password']))
        Roles.objects.create(user=user)
        return user

    def login(self, login_data):
        res = self.client.post(self.login_url, login_data)
        return res

    def login_and_get_token(self, login_data):
        res = self.login(login_data)
        token = res.data['token']
        return token

    def tearDown(self):
        return super().tearDown()


class TestUserView(TestUserSetUp):

    def test_user_can_request_email_verification(self):
        res = self.client.post(
            self.request_email_verification_url, self.user_data)
        self.assertEqual(res.status_code, 200)

        email_verification = EmailVerificationRequest.objects.get(
            email=self.user_data['email'])
        self.assertEqual(email_verification.email, self.user_data['email'])

    def test_user_cannot_request_email_verification_with_wrong_data(self):
        res1 = self.client.post(self.request_email_verification_url)
        self.assertEqual(res1.status_code, 400)

        self.user_data['confirm_password'] = ''
        res2 = self.client.post(
            self.request_email_verification_url, self.user_data)
        self.assertEqual(res2.status_code, 400)

    def test_user_can_register(self):
        self.client.post(
            self.request_email_verification_url, self.user_data)

        email_verification = EmailVerificationRequest.objects.get(
            email=self.user_data['email'])

        self.user_data['pin'] = email_verification.pin
        res = self.client.post(self.register_url, self.user_data)
        self.assertEqual(res.status_code, 201)

    def test_user_cannot_register_with_wrong_pin(self):
        self.client.post(
            self.request_email_verification_url, self.user_data)

        EmailVerificationRequest.objects.get(
            email=self.user_data['email'])

        wrong_pin = 100000
        self.user_data['pin'] = wrong_pin
        res = self.client.post(self.register_url, self.user_data)
        self.assertEqual(res.status_code, 400)

    def test_user_can_login(self):
        self.create_registered_user(self.user_data)
        res = self.login(self.login_data)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_login_with_wrong_credentials(self):
        # TEST LOGIN WITHOUT BEING REGISTERED
        res1 = self.login(self.login_data)
        self.assertEqual(res1.status_code, 400)

        # TEST LOGIN WHILE BEING REGISTERED BUT ENTERS WRONG PASSWORD
        self.create_registered_user(self.user_data)
        self.login_data['password'] = 'wrong_password'
        res2 = self.login(self.login_data)
        self.assertEqual(res2.status_code, 400)

    def test_auth_user_can_get_user_data(self):
        self.create_registered_user(self.user_data)
        token = self.login_and_get_token(self.login_data)
        res = self.client.get(self.auth_user_url, self.user_data, headers={
                              'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['username'], self.user_data['username'])

    def test_not_auth_user_cannot_get_user_data(self):
        token = 'wrong_token'
        res = self.client.get(self.auth_user_url, self.user_data, headers={
                              'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 401)

    def test_registered_user_can_request_reset_password(self):
        self.create_registered_user(self.user_data)
        data = {
            'email': self.user_data['email']
        }
        res = self.client.post(
            self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 200)

    def test_not_registered_user_cannot_request_reset_password(self):
        data = {
            'email': 'not_registered_email@gmail.com'
        }
        res = self.client.post(self.request_password_reset_url, data)
        self.assertEqual(res.status_code, 404)

    def test_user_can_reset_password(self):
        self.create_registered_user(self.user_data)
        data = {
            'email': self.user_data['email']
        }
        self.client.post(self.request_password_reset_url, data)
        token = PasswordResetRequest.objects.get(email=data['email']).token

        res2 = self.client.post(
            reverse('password-reset', kwargs={'token': token}), self.reset_password_data)
        self.assertEqual(res2.status_code, 200)

    def test_user_cannot_reset_password_with_wrong_data(self):
        self.create_registered_user(self.user_data)
        data = {
            'email': self.user_data['email']
        }
        self.client.post(self.request_password_reset_url, data)

        # TEST RESET PASSWORD WITH WRONG TOKEN
        res1 = self.client.post(reverse(
            'password-reset', kwargs={'token': 'wrong_token'}), self.reset_password_data)
        self.assertEqual(res1.status_code, 400)

        # TEST RESET PASSWORD WITH NOT MATCHING PASSWORD
        token = PasswordResetRequest.objects.get(email=data['email']).token
        self.reset_password_data['confirm_password'] = 'Wrong_confirm_password123!'
        res2 = self.client.post(
            reverse('password-reset', kwargs={'token': token}), self.reset_password_data)
        self.assertEqual(res2.status_code, 400)
