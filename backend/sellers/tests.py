import datetime

from django.urls import reverse

from users.tests import TestUserSetUp

from .models import SellerApplication, SELLER_APP_STATUS


class TestSellerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.test_seller_application = SellerApplication.objects.filter(
            seller_account=self.test_user.seller_account, status='A').first()

        self.seller_account_list_url = reverse('seller-account-list')

        self.seller_account_retrieve_update_url = reverse(
            'seller-account-retrieve-update', kwargs={'username': self.test_user.username})

        self.seller_application_list_create_url = reverse(
            'seller-application-list-create', kwargs={'username': self.test_user.username})

        self.seller_application_retrieve_url = reverse(
            'seller-application-retrieve', kwargs={'username': self.test_user.username, 'pk': self.test_seller_application.pk})

        self.seller_application_cancel_url = reverse(
            'seller-application-cancel', kwargs={'username': self.test_user.username, 'pk': self.test_seller_application.pk})

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

    def create_seller_application(self, user, application_data):
        """Creates an SellerApplication object directly to db."""
        seller_application = SellerApplication.objects.create(
            seller_account=user.seller_account, **application_data)
        return seller_application

    def tearDown(self):
        super().tearDown()


class TestSeller(TestSellerSetUp):

    fixtures = ['users.json', 'sellers.json']

    def test_user_can_get_list_of_seller_application(self):
        # Test authorized user should be able to get their seller_application list.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.seller_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)

    def test_user_can_only_get_their_list_of_seller_application(self):
        # Test authorized user should only be able to get their seller_application list.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.seller_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)
        for application in res.data:
            self.assertEqual(application['business_name'],
                             self.test_user.seller_account.business_name)

        # Test authorized user should not be able to get other's seller_application list.
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(
            self.seller_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 403)

    def test_unauntheticated_user_cannot_get_list_of_seller_application(self):
        # Test unauthorized user should not be able to get other user's seller_application list.
        res = self.client.get(self.seller_application_list_create_url,)
        self.assertEqual(res.status_code, 401)

    def test_user_can_get_their_seller_application(self):
        # Test user should be able to get their seller_application details.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.seller_application_retrieve_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_seller_application_that_they_dont_own(self):
        # Test user should not be able get other user's seller_application details.
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(
            self.seller_application_retrieve_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_seller_application(self):
        # Test unauthorized user should not be able get seller_application details.
        res = self.client.get(self.seller_application_retrieve_url)
        self.assertEqual(res.status_code, 401)

    def test_user_can_cancel_their_pending_seller_application(self):
        # Test user can cancel any pending seller_application that they have.
        token = self.login_user_and_get_token(self.new_user)

        seller_application = self.create_seller_application(
            self.new_user, self.seller_application_data)

        seller_applcation_cancel_url = reverse(
            'seller-application-cancel',
            kwargs={'username': self.new_user.username, 'pk': seller_application.pk})

        res = self.client.patch(
            seller_applcation_cancel_url,
            {'status': SELLER_APP_STATUS.CANCELLED},
            headers=self.create_auth_header(token)
        )

        seller_application.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(seller_application.status,
                         SELLER_APP_STATUS.CANCELLED)

    def test_user_cannot_approve_or_reject_their_pending_application(self):
        # Test user should not be able to approve or reject their own seller_application.
        token = self.login_user_and_get_token(self.new_user)

        seller_application = self.create_seller_application(
            self.new_user, self.seller_application_data)

        seller_applcation_cancel_url = reverse(
            'seller-application-cancel',
            kwargs={'username': self.new_user.username, 'pk': seller_application.pk})

        # Test for approving.
        res = self.client.patch(
            seller_applcation_cancel_url,
            {'status': SELLER_APP_STATUS.APPROVED},
            headers=self.create_auth_header(token)
        )

        seller_application.refresh_from_db()
        self.assertEqual(res.status_code, 400)
        self.assertNotEqual(seller_application.status,
                            SELLER_APP_STATUS.APPROVED)

        # Test for rejecting.
        res = self.client.patch(
            seller_applcation_cancel_url,
            {'status': SELLER_APP_STATUS.REJECTED},
            headers=self.create_auth_header(token)
        )

        seller_application.refresh_from_db()
        self.assertEqual(res.status_code, 400)
        self.assertNotEqual(seller_application.status,
                            SELLER_APP_STATUS.REJECTED)

    def test_user_can_only_edit_seller_application_with_pending_status(self):
        # Test users should not be able to edit seller_application with
        # APPROVED, REJECTED, or CANCELLED status
        token = self.login_user_and_get_token(self.test_user)

        res = self.client.patch(
            self.seller_application_cancel_url,
            {'status': SELLER_APP_STATUS.CANCELLED},
            headers=self.create_auth_header(token)
        )

        self.test_seller_application.refresh_from_db()
        self.assertEqual(res.status_code, 404)
        self.assertEqual(self.test_seller_application.status,
                         SELLER_APP_STATUS.APPROVED)

    def test_user_can_make_seller_application(self):
        # Test authorized user should be able to create a seller_application.
        token = self.login_user_and_get_token(self.new_user)
        seller_application_create_url = reverse(
            'seller-application-list-create', kwargs={'username': self.new_user.username}
        )
        res = self.client.post(
            seller_application_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 201)

    def test_user_with_unverified_email_cannot_create_seller_application(self):
        # Test user with an unverified email should not be able to create a seller_application.
        self.register_user(self.unregistered_user_data)
        token = self.login_and_get_token(self.unregistered_user_login_data)
        seller_application_create_url = reverse(
            'seller-application-list-create', kwargs={'username': self.unregistered_user_data['username']}
        )
        res = self.client.post(
            seller_application_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 401)

    def test_user_cannot_make_seller_application_with_invalid_data(self):
        # Test user should not able to create a seller_application when they submit an invalida data
        token = self.login_user_and_get_token(self.new_user)
        seller_application_create_url = reverse(
            'seller-application-list-create', kwargs={'username': self.new_user.username}
        )
        invalid_data_1 = {}  # Test no data.
        invalid_data_2 = {'business_name': 'Business 3'}  # Test lacking data.
        invalid_data_3 = {'seller_account': 10,
                          'business_name': 'Business 3',
                          'business_add': 'Area 1, City 1'}  # Test wrong key.

        res1 = self.client.post(
            seller_application_create_url,
            invalid_data_1,
            headers=self.create_auth_header(token)
        )
        res2 = self.client.post(
            seller_application_create_url,
            invalid_data_2,
            headers=self.create_auth_header(token)
        )
        res3 = self.client.post(
            seller_application_create_url,
            invalid_data_3,
            headers=self.create_auth_header(token)
        )

        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)

    def test_user_with_active_seller_account_cannot_create_seller_application(self):
        # Test user that is already active should not be able to create a seller_application
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.post(
            self.seller_application_list_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 400)

    def test_unauthorized_user_cannot_create_seller_application(self):
        # Test unauthorized user should not be able to create a seller_application
        token = 'invalid_token'
        res = self.client.post(
            self.seller_application_list_create_url,
            self.seller_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 401)

    def test_user_can_get_seller_list(self):
        # Test user should be able to get list of sellers
        res = self.client.get(self.seller_account_list_url)
        self.assertEqual(res.status_code, 200)

    def test_user_can_get_seller_details(self):
        # Test user should be able to get seller details
        res = self.client.get(self.seller_account_retrieve_update_url)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_seller_details_with_invalid_data(self):
        # Test user should receive 404 when they use invalid data when requesting
        # seller_account details
        seller_account_retrieve_url = reverse(
            'seller-account-retrieve-update',
            kwargs={'username': 'wrong_username'}
        )
        res = self.client.get(seller_account_retrieve_url)
        self.assertEqual(res.status_code, 404)

    def test_owner_of_seller_account_can_edit_details(self):
        # Test user should be able to edit their seller_account details
        token = self.login_user_and_get_token(self.test_user)

        res = self.client.patch(
            self.seller_account_retrieve_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.test_user.seller_account.business_name,
            self.new_test_seller_data['business_name']
        )
        self.assertEqual(
            self.test_user.seller_account.business_address,
            self.new_test_seller_data['business_address']
        )
        self.assertEqual(
            self.test_user.seller_account.contact_number_1,
            self.new_test_seller_data['contact_number_1']
        )
        self.assertEqual(
            self.test_user.seller_account.contact_number_2,
            self.new_test_seller_data['contact_number_2']
        )
        self.assertEqual(
            bool(self.test_user.seller_account.profile_image_path),
            False
        )
        self.assertEqual(
            self.test_user.seller_account.description,
            self.new_test_seller_data['description']
        )

    def test_user_cannot_edit_seller_account_data_that_requires_persmission(self):
        # Test user should not be able to edit 'is_active' and 'date_approved' of seller_account
        token = self.login_user_and_get_token(self.test_user)

        data = {
            'business_name': 'New Name',
            'is_active': False,
            'date_approved': datetime.date(2023, 12, 1)
        }

        res = self.client.patch(
            self.seller_account_retrieve_update_url,
            data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.test_user.seller_account.business_name,
            data['business_name']
        )
        self.assertNotEqual(
            self.test_user.seller_account.is_active,
            data['is_active']
        )
        self.assertNotEqual(
            self.test_user.seller_account.date_approved.date(),
            data['date_approved']
        )

    def test_not_owner_of_seller_account_cannot_edit_details(self):
        # Test authorized user should not be able to edit the seller_account details of other users.
        # In this test, new_user is trying to change test_user's data.
        token = self.login_user_and_get_token(self.new_user)

        res = self.client.patch(
            self.seller_account_retrieve_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            self.test_user.seller_account.business_name,
            self.new_test_seller_data['business_name']
        )
        self.assertNotEqual(
            self.test_user.seller_account.business_address,
            self.new_test_seller_data['business_address']
        )
        self.assertNotEqual(
            self.test_user.seller_account.contact_number_1,
            self.new_test_seller_data['contact_number_1']
        )
        self.assertNotEqual(
            self.test_user.seller_account.contact_number_2,
            self.new_test_seller_data['contact_number_2']
        )
        self.assertNotEqual(
            self.test_user.seller_account.profile_image_path,
            self.new_test_seller_data['profile_image_path']
        )
        self.assertNotEqual(
            self.test_user.seller_account.description,
            self.new_test_seller_data['description']
        )

    def test_unauthorized_user_cannot_edit_seller_account_details(self):
        # Test unauthorized user should not be able to edit seller_account details
        token = 'invalid_token'

        res = self.client.patch(
            self.seller_account_retrieve_update_url,
            self.new_test_seller_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(
            self.test_user.seller_account.business_name,
            self.new_test_seller_data['business_name']
        )
        self.assertNotEqual(
            self.test_user.seller_account.business_address,
            self.new_test_seller_data['business_address']
        )
        self.assertNotEqual(
            self.test_user.seller_account.contact_number_1,
            self.new_test_seller_data['contact_number_1']
        )
        self.assertNotEqual(
            self.test_user.seller_account.contact_number_2,
            self.new_test_seller_data['contact_number_2']
        )
        self.assertNotEqual(
            self.test_user.seller_account.profile_image_path,
            self.new_test_seller_data['profile_image_path']
        )
        self.assertNotEqual(
            self.test_user.seller_account.description,
            self.new_test_seller_data['description']
        )
