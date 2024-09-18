from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from user.tests import TestUserSetUp

from .models import BuyerAccount, BuyerVerificationRequest


class TestBuyerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.registered_buyer_data = {
            'email': 'registeredbuyer@gmail.com',
            'username': 'registeredbuyer',
            'password': 'testpassword123',
            'first_name': 'maxi',
            'last_name': 'macmac'
        }

        self.registered_buyer_login_data = {
            'username': self.registered_buyer_data['username'],
            'password': self.registered_buyer_data['password']
        }

        self.buyer_account = self.create_buyer(self.registered_buyer_data)

        self.buyer_verification_url = reverse('buyer-verification')
        self.buyer_create_url = reverse('buyer-create')
        self.buyer_detail_url = reverse(
            'buyer-detail-update', kwargs={'username': self.buyer_account.user.username})
        self.buyer_update_url = reverse(
            'buyer-detail-update', kwargs={'username': self.buyer_account.user.username})

    def tearDown(self):
        return super().tearDown()

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


class TestBuyer(TestBuyerSetUp):
    def test_user_can_make_buyer_verification_request(self):
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        res = self.client.post(self.buyer_verification_url,
                               self.unregistered_user_data)
        self.assertEqual(res.status_code, 201)

    def test_user_can_register_as_buyer(self):
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        res1 = self.client.post(
            self.buyer_verification_url, self.unregistered_user_data)

        verification_request = BuyerVerificationRequest.objects.get(
            email=res1.data['email'])
        buyer_verification_data = {
            'email': res1.data['email'], 'pin_code': verification_request.pin_code}
        res2 = self.client.post(self.buyer_create_url, buyer_verification_data)
        self.assertEqual(res2.status_code, 201)

    def test_user_can_get_buyer_details(self):
        res = self.client.get(self.buyer_detail_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['user']['username'],
                         self.registered_buyer_data['username'])

    def test_user_cannot_get_buyer_details_with_wrong_input(self):
        buyer_detail_url = reverse(
            'buyer-detail-update', kwargs={'username': 'wrong_username'})
        res = self.client.get(buyer_detail_url)
        self.assertEqual(res.status_code, 404)

    def test_owner_of_buyer_account_can_edit_details(self):
        token = self.login_and_get_token(self.registered_buyer_login_data)
        data = {
            'first_name': 'new first name',
            'last_name': 'new last name',
            'bio': 'new bio',
            'contact_number_1': 222222222,
            'contact_number_2': 333333333,
        }
        res = self.client.patch(self.buyer_update_url, data,
                                headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['first_name'], data['first_name'])
        self.assertEqual(res.data['last_name'], data['last_name'])
        self.assertEqual(res.data['bio'], data['bio'])
        self.assertEqual(res.data['contact_number_1'],
                         data['contact_number_1'])
        self.assertEqual(res.data['contact_number_2'],
                         data['contact_number_2'])

    def test_not_owner_of_buyer_account_cannot_edit_details(self):
        data = {
            'first_name': 'new first name',
            'last_name': 'new last name',
            'bio': 'new bio',
            'contact_number_1': 222222222,
            'contact_number_2': 333333333,
        }

        # TEST FOR NOT AUTHORIZED USER
        res = self.client.patch(self.buyer_update_url, data)
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(
            self.buyer_account.first_name, data['first_name'])
        self.assertNotEqual(self.buyer_account.last_name, data['last_name'])
        self.assertNotEqual(self.buyer_account.bio, data['bio'])
        self.assertNotEqual(self.buyer_account.contact_number_1,
                            data['contact_number_1'])
        self.assertNotEqual(self.buyer_account.contact_number_2,
                            data['contact_number_2'])

        # TEST FOR AUTHORIZED USER BUT NOT OWNER OF ACCOUNT
        self.create_buyer(self.unregistered_user_data)
        token = self.login_and_get_token(self.unregistered_user_login_data)
        res = self.client.patch(self.buyer_update_url, data,
                                headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            self.buyer_account.first_name, data['first_name'])
        self.assertNotEqual(self.buyer_account.last_name, data['last_name'])
        self.assertNotEqual(self.buyer_account.bio, data['bio'])
        self.assertNotEqual(self.buyer_account.contact_number_1,
                            data['contact_number_1'])
        self.assertNotEqual(self.buyer_account.contact_number_2,
                            data['contact_number_2'])
