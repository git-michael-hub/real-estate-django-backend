from datetime import date

from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework.test import APITestCase

from buyers.models import BuyerAccount
from sellers.models import SellerAccount, SellerApplication

from .models import PasswordResetRequest


class TestUserSetUp(APITestCase):
    def setUp(self):
        self.auth_user_url = reverse('auth-user')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')

        self.request_password_reset_url = reverse('request-password-reset')

        self.user_data = {
            'email': 'testemail@gmail.com',
            'username': 'testusername',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123'
        }

        self.unregistered_user_data = {
            'email': 'unregistereduser@gmail.com',
            'username': 'unregistereduser',
            'password': 'testpassword123',
            'first_name': 'jesmar',
            'last_name': 'marmar',
            'address': 'jesmarseller address',
            'gender': 'M',
            'birthdate': date(1988, 7, 10),
            'contact_number_1': 22222222
        }

        self.registered_buyer_data = {
            'email': 'registeredbuyer@gmail.com',
            'username': 'registeredbuyer',
            'password': 'testpassword123',
            'first_name': 'maxibuyer',
            'last_name': 'macmacbuyer'
        }

        self.registered_seller_data = {
            'email': 'registeredseller@gmail.com',
            'username': 'registeredseller',
            'password': 'testpassword123',
            'first_name': 'maxiseller',
            'last_name': 'macmacseller',
            'address': 'maxiseller address',
            'gender': 'M',
            'birthdate': date(1990, 3, 19),
            'contact_number_1': 111111111,
        }

        self.login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }

        self.unregistered_user_login_data = {
            'username': self.unregistered_user_data['username'],
            'password': self.unregistered_user_data['password']
        }

        self.registered_buyer_login_data = {
            'username': self.registered_buyer_data['username'],
            'password': self.registered_buyer_data['password']
        }

        self.registered_seller_login_data = {
            'username': self.registered_seller_data['username'],
            'password': self.registered_seller_data['password']
        }

        self.reset_password_data = {
            'new_password': 'Newpassword123!',
            'confirm_password': 'Newpassword123!'
        }

        self.buyer_account = self.create_buyer(self.registered_buyer_data)

        self.seller_account = self.create_seller(
            self.registered_seller_data)

    def create_buyer(self, buyer_data):
        hashed_password = make_password(password=buyer_data['password'])
        user = User(email=buyer_data['email'],
                    username=buyer_data['username'],
                    password=hashed_password)
        user.save()
        buyer_account = BuyerAccount(user=user,
                                     first_name=buyer_data['first_name'],
                                     last_name=buyer_data['last_name'])
        buyer_account.save()
        return buyer_account

    def create_seller_application(self, user_data):
        seller_application = SellerApplication(
            email=user_data['email'],
            username=user_data['username'],
            password=make_password(user_data['password']),
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            address=user_data['address'],
            birthdate=user_data['birthdate'],
            gender=user_data['gender'],
            contact_number_1=user_data['contact_number_1'],
            status='P'
        )
        seller_application.save()
        return seller_application

    def create_seller(self, user_data):
        application = self.create_seller_application(user_data)
        user = User(email=application.email,
                    username=application.username,
                    password=application.password
                    )
        seller_account = SellerAccount(
            user=user,
            sellerapplication_ptr=application,
            birthdate=application.birthdate,
            application_date=application.application_date,
            contact_number_1=application.contact_number_1
        )
        application.status = 'A'
        user.save()
        seller_account.save()
        application.save()

        return seller_account

        return super().setUp()

    def create_registered_user(self, user_data):
        user = User.objects.create(
            email=user_data['email'], username=user_data['username'], password=make_password(user_data['password']))
        return user

    def login(self, login_data):
        res = self.client.post(self.login_url, login_data)
        return res

    def login_and_get_token(self, login_data):
        res = self.login(login_data)
        token = res.data['token']
        return token

    def create_auth_header(self, token):
        return {'Authorization': f'Token {token}'}

    def tearDown(self):
        return super().tearDown()


class TestUserView(TestUserSetUp):

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
