import datetime

from django.urls import reverse

from users.models import User
from users.tests import TestUserSetUp

from .models import SellerAccount


class TestSellerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.seller_application_create_url = reverse('seller-application')
        self.seller_list_url = reverse('seller-list')
        self.seller_detail_url = reverse(
            'seller-detail-update', kwargs={'username': self.test_user.username})
        self.seller_update_url = reverse(
            'seller-detail-update', kwargs={'username': self.test_user.username})

        self.seller_application_data = {
            'business_name': 'New Business',
            'business_address': 'Area 1, City 1'
        }

        self.new_test_seller_data = {
            'business_name': 'New Name',
            'business_address': 'New Address',
            'contact_number_1': 00000000000,
            'contact_number_2': 99999999999,
            'profile_image_path': '',
            'description': 'New Description'
        }

    def tearDown(self):
        return super().tearDown()


class TestSeller(TestSellerSetUp):

    fixtures = ['users.json', 'sellers.json']

    def test_user_can_make_seller_application(self):
        # test authorized user should be able to create a seller_application
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        user = self.create_registered_user(self.unregistered_user_data)
        token = self.login_user_and_get_token(user)
        res = self.client.post(
            self.seller_application_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 201)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_make_seller_application_with_invalid_data(self):
        # test user should not able to create a seller_application when they submit an invalida data
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        user = self.create_registered_user(self.unregistered_user_data)
        token = self.login_user_and_get_token(user)

        invalid_data_1 = {}
        invalid_data_2 = {'business_name': 'Business 3'}
        invalid_data_3 = {'seller_account': 10,
                          'business_name': 'Business 3',
                          'business_adress': 'Area 1, City 1'}

        res1 = self.client.post(
            self.seller_application_create_url,
            invalid_data_1,
            headers=self.create_auth_header(token)
        )
        res2 = self.client.post(
            self.seller_application_create_url,
            invalid_data_2,
            headers=self.create_auth_header(token)
        )
        res3 = self.client.post(
            self.seller_application_create_url,
            invalid_data_3,
            headers=self.create_auth_header(token)
        )

        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)

    # -------------------------------------------------------------------------------------------

    def test_user_with_active_seller_account_cannot_make_seller_application(self):
        # test user that is already active should not be able to create a seller_application
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.post(
            self.seller_application_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 400)

    # -------------------------------------------------------------------------------------------

    def test_unauthorized_user_cannot_make_seller_application(self):
        # test unauthorized user should not be able to create a seller_application
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        self.create_registered_user(self.unregistered_user_data)
        token = 'wrong_token'
        res = self.client.post(
            self.seller_application_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 401)

    # -------------------------------------------------------------------------------------------

    def test_user_can_get_seller_list(self):
        # test user should be able to get list of sellers
        res = self.client.get(self.seller_list_url)
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_can_get_seller_details(self):
        # test user should be able to get seller details
        res = self.client.get(self.seller_detail_url)
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_get_seller_details_with_invalid_data(self):
        # test user should receive 404 when they use invalid data when requesting
        # seller_account details
        seller_detail_url = reverse(
            'seller-detail-update',
            kwargs={'username': 'wrong_username'}
        )
        res = self.client.get(seller_detail_url)
        self.assertEqual(res.status_code, 404)

    # -------------------------------------------------------------------------------------------

    def test_owner_of_seller_account_can_edit_details(self):
        # test user should be able to edit their seller_account details
        token = self.login_user_and_get_token(self.test_user)

        res = self.client.patch(
            self.seller_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data['business_name'],
            self.new_test_seller_data['business_name']
        )
        self.assertEqual(
            res.data['business_address'],
            self.new_test_seller_data['business_address']
        )
        self.assertEqual(
            res.data['contact_number_1'],
            self.new_test_seller_data['contact_number_1']
        )
        self.assertEqual(
            res.data['contact_number_2'],
            self.new_test_seller_data['contact_number_2']
        )
        self.assertEqual(
            res.data['profile_image_path'],
            None
        )
        self.assertEqual(
            res.data['description'],
            self.new_test_seller_data['description']
        )

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_edit_data_that_requires_persmission(self):
        # test user should not be able to edit 'is_active' and 'date_approved' of seller_account

        token = self.login_user_and_get_token(self.test_user)

        data = {
            'business_name': 'New Name',
            'is_active': False,
            'date_approved': datetime.date(2023, 12, 1)
        }

        res = self.client.patch(
            self.seller_update_url,
            data,
            headers=self.create_auth_header(token)
        )

        test_seller = SellerAccount.objects.get(user=self.test_user)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            test_seller.business_name,
            data['business_name']
        )
        self.assertNotEqual(
            test_seller.is_active,
            data['is_active']
        )
        self.assertNotEqual(
            test_seller.date_approved.date(),
            data['date_approved']
        )

    # -------------------------------------------------------------------------------------------

    def test_not_owner_of_seller_account_cannot_edit_details(self):
        # test authorized user should not be able to edit the seller_account details of other users

        test_user2 = User.objects.get(pk=11)

        token = self.login_user_and_get_token(test_user2)

        res = self.client.patch(
            self.seller_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        test_seller = SellerAccount.objects.get(user=self.test_user)

        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            test_seller.business_name,
            self.new_test_seller_data['business_name']
        )
        self.assertNotEqual(
            test_seller.business_address,
            self.new_test_seller_data['business_address']
        )
        self.assertNotEqual(
            test_seller.contact_number_1,
            self.new_test_seller_data['contact_number_1']
        )
        self.assertNotEqual(
            test_seller.contact_number_2,
            self.new_test_seller_data['contact_number_2']
        )
        self.assertNotEqual(
            test_seller.profile_image_path,
            self.new_test_seller_data['profile_image_path']
        )
        self.assertNotEqual(
            test_seller.description,
            self.new_test_seller_data['description']
        )

    # -------------------------------------------------------------------------------------------

    def test_unauthorized_user_cannot_edit_seller_account_details(self):
        # test unauthorized user should not be able to edit seller_account details

        token = 'wrong_token'

        res = self.client.patch(
            self.seller_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        test_seller = SellerAccount.objects.get(user=self.test_user)

        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(
            test_seller.business_name,
            self.new_test_seller_data['business_name']
        )
        self.assertNotEqual(
            test_seller.business_address,
            self.new_test_seller_data['business_address']
        )
        self.assertNotEqual(
            test_seller.contact_number_1,
            self.new_test_seller_data['contact_number_1']
        )
        self.assertNotEqual(
            test_seller.contact_number_2,
            self.new_test_seller_data['contact_number_2']
        )
        self.assertNotEqual(
            test_seller.profile_image_path,
            self.new_test_seller_data['profile_image_path']
        )
        self.assertNotEqual(
            test_seller.description,
            self.new_test_seller_data['description']
        )
