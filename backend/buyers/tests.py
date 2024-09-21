from django.urls import reverse

from listings.tests import TestListingsSetUp

from .models import BuyerEmailValidationRequest


class TestBuyerSetUp(TestListingsSetUp):
    def setUp(self):
        super().setUp()

        self.buyer_validation_url = reverse('buyer-validation')
        self.buyer_create_url = reverse('buyer-create')
        self.buyer_detail_url = reverse(
            'buyer-detail-update', kwargs={'username': self.buyer_account.user.username})
        self.buyer_update_url = reverse(
            'buyer-detail-update', kwargs={'username': self.buyer_account.user.username})
        self.buyer_favorite_listings_detail_url = reverse(
            'buyer-favorite-listings', kwargs={'username': self.buyer_account.user.username})
        self.buyer_favorite_listings_add_remove_url = reverse(
            'buyer-favorite-listings', kwargs={'username': self.buyer_account.user.username})

    def tearDown(self):
        return super().tearDown()


class TestBuyer(TestBuyerSetUp):
    def test_user_can_make_buyer_validation_request(self):
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        res = self.client.post(self.buyer_validation_url,
                               self.unregistered_user_data)
        self.assertEqual(res.status_code, 201)

    def test_user_can_register_as_buyer(self):
        self.unregistered_user_data['confirm_password'] = self.unregistered_user_data['password']
        res1 = self.client.post(
            self.buyer_validation_url, self.unregistered_user_data)

        validation_request = BuyerEmailValidationRequest.objects.get(
            email=res1.data['email'])
        buyer_validation_data = {
            'email': res1.data['email'], 'pin_code': validation_request.pin_code}
        res2 = self.client.post(self.buyer_create_url, buyer_validation_data)
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

    def test_owner_can_get_favorites(self):
        token = self.login_and_get_token(
            self.registered_buyer_login_data)
        res = self.client.get(self.buyer_favorite_listings_detail_url,
                              headers={'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 200)

    def test_not_owner_cannot_get_favorites(self):
        token = self.login_and_get_token(
            self.registered_seller_login_data)
        res = self.client.get(self.buyer_favorite_listings_detail_url,
                              headers={'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 403)

    def test_owner_can_add_and_remove_favorites(self):
        token = self.login_and_get_token(
            self.registered_buyer_login_data)

        add_to_favorites = {
            'add_to_favorites': self.listing.id
        }
        res1 = self.client.patch(self.buyer_favorite_listings_add_remove_url,
                                 add_to_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res1.status_code, 200)
        self.assertIn(self.listing.id, get_ids(res1.data['favorite_listings']))

        remove_from_favorites = {
            'remove_from_favorites': self.listing.id
        }
        res2 = self.client.patch(self.buyer_favorite_listings_add_remove_url,
                                 remove_from_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res2.status_code, 200)
        self.assertNotIn(self.listing.id,
                         get_ids(res2.data['favorite_listings']))

    def test_not_owner_cannot_edit_favorites(self):
        token = self.login_and_get_token(
            self.registered_seller_login_data)

        add_to_favorites = {
            'add_to_favorites': self.listing.id
        }
        res1 = self.client.patch(self.buyer_favorite_listings_add_remove_url,
                                 add_to_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res1.status_code, 403)

        remove_from_favorites = {
            'remove_from_favorites': self.listing.id
        }
        res2 = self.client.patch(self.buyer_favorite_listings_add_remove_url,
                                 remove_from_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res2.status_code, 403)


def get_ids(list):
    ids = []
    for item in list:
        ids.append(item['id'])
    return ids
