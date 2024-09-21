from datetime import date

from django.urls import reverse

from users.tests import TestUserSetUp

from .models import SellerEmailValidationRequest


class TestSellerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.unregistered_seller_data = self.unregistered_user_data

        self.seller_application_form = self.create_seller_application(
            self.unregistered_seller_data)

        self.seller_validation_url = reverse('seller-validation')
        self.seller_application_create_url = reverse('seller-application')
        self.approve_seller_application_url = reverse(
            'admin:sellers_sellerapplication_change', args=(self.seller_application_form.id,))
        self.seller_detail_url = reverse(
            'seller-detail-update', kwargs={'username': self.seller_account.user.username})
        self.seller_update_url = reverse(
            'seller-detail-update', kwargs={'username': self.seller_account.user.username})

    def tearDown(self):
        return super().tearDown()


class TestSeller(TestSellerSetUp):
    def test_user_can_make_seller_validation_request(self):
        self.unregistered_seller_data['confirm_password'] = self.unregistered_seller_data['password']
        res = self.client.post(self.seller_validation_url,
                               self.unregistered_seller_data)
        self.assertEqual(res.status_code, 201)

    def test_user_cannot_register_with_wrong_pin(self):
        self.unregistered_seller_data['confirm_password'] = self.unregistered_seller_data['password']
        res1 = self.client.post(
            self.seller_validation_url, self.unregistered_seller_data)

        SellerEmailValidationRequest.objects.get(
            email=res1.data['email'])

        wrong_pin = 100000
        seller_validation_data = {
            'email': res1.data['email'], 'pin_code': wrong_pin}

        res2 = self.client.post(
            self.seller_application_create_url, seller_validation_data)
        self.assertEqual(res2.status_code, 400)

    def test_user_can_make_seller_application(self):
        self.unregistered_seller_data['confirm_password'] = self.unregistered_seller_data['password']
        res1 = self.client.post(
            self.seller_validation_url, self.unregistered_seller_data)

        validation_request = SellerEmailValidationRequest.objects.get(
            email=res1.data['email'])
        seller_validation_data = {
            'email': res1.data['email'], 'pin_code': validation_request.pin_code}

        res2 = self.client.post(
            self.seller_application_create_url, seller_validation_data)

        self.assertEqual(res2.status_code, 201)

    def test_user_can_get_seller_details(self):
        res = self.client.get(self.seller_detail_url)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_seller_details_with_wrong_input(self):
        seller_detail_url = reverse(
            'seller-detail-update', kwargs={'username': 'wrong_username'})
        res = self.client.get(seller_detail_url)
        self.assertEqual(res.status_code, 404)

    def test_owner_of_seller_account_can_edit_details(self):
        token = self.login_and_get_token(self.registered_seller_login_data)
        data = {
            'first_name': 'new first name',
            'last_name': 'new last name',
            'contact_number_1': 222222222,
            'contact_number_2': 333333333,
            'birthdate': date(1995, 2, 2),
            'gender': 'F'
        }
        res = self.client.patch(self.seller_update_url, data,
                                headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['first_name'], data['first_name'])
        self.assertEqual(res.data['last_name'], data['last_name'])
        self.assertEqual(res.data['contact_number_1'],
                         data['contact_number_1'])
        self.assertEqual(res.data['contact_number_2'],
                         data['contact_number_2'])

        # birthdate and gender are non-editable fields
        self.assertNotEqual(self.seller_account.birthdate, data['birthdate'])
        self.assertNotEqual(self.seller_account.gender, data['gender'])

    def test_not_owner_of_seller_account_cannot_edit_details(self):
        data = {
            'first_name': 'new first name',
            'last_name': 'new last name',
            'contact_number_1': 222222222,
            'contact_number_2': 333333333,
            'birthdate': date(1995, 2, 2),
            'gender': 'F'
        }

        # TEST FOR NOT AUTHORIZED USER
        res = self.client.patch(self.seller_update_url, data)
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(
            self.seller_account.first_name, data['first_name'])
        self.assertNotEqual(self.seller_account.last_name, data['last_name'])
        self.assertNotEqual(self.seller_account.contact_number_1,
                            data['contact_number_1'])
        self.assertNotEqual(self.seller_account.contact_number_2,
                            data['contact_number_2'])
        self.assertNotEqual(self.seller_account.birthdate, data['birthdate'])
        self.assertNotEqual(self.seller_account.gender, data['gender'])

        # TEST FOR AUTHORIZED USER BUT NOT OWNER OF ACCOUNT
        self.create_seller(self.unregistered_user_data)
        token = self.login_and_get_token(self.unregistered_user_login_data)
        res = self.client.patch(self.seller_update_url, data,
                                headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            self.seller_account.first_name, data['first_name'])
        self.assertNotEqual(self.seller_account.last_name, data['last_name'])
        self.assertNotEqual(self.seller_account.contact_number_1,
                            data['contact_number_1'])
        self.assertNotEqual(self.seller_account.contact_number_2,
                            data['contact_number_2'])
        self.assertNotEqual(self.seller_account.birthdate, data['birthdate'])
        self.assertNotEqual(self.seller_account.gender, data['gender'])

    # def test_user_cannot_approve_seller_application(self):

    #     User.objects.create_superuser(
    #         username='superuser', password='secret', email='admin@example.com'
    #     )
    #     self.client.login(username='superuser', password='secret')
    #     print(self.approve_seller_application_url)
    #     data = self.unregistered_seller_data
    #     data['_approve_application'] = 'Approved'

    #     res = self.client.post(self.approve_seller_application_url, data)
    #     import pdb
    #     pdb.set_trace()
    #     self.assertEqual(res.status_code, 302)
