from django.urls import reverse

from users.tests import TestUserSetUp

from listings.models import Listing

from .models import WishlistEntry


class TestBuyerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.buyer_retrieve_update_url = reverse(
            'buyer-retrieve-update',
            kwargs={'username': self.test_user.username}
        )

        self.wishlist_list_create_url = reverse(
            'wishlist-entry-list-create',
            kwargs={'username': self.test_user.username}
        )

        self.test_listing = Listing.objects.get(pk=1)

    def create_test_wishlist_entry(self):
        return WishlistEntry.objects.create(
            buyer_account=self.test_user.buyer_account,
            listing=self.test_listing)

    def tearDown(self):
        return super().tearDown()


class TestBuyer(TestBuyerSetUp):
    fixtures = ['users.json', 'buyers.json', 'sellers.json', 'agents.json',
                'properties.json', 'listings.json']

    def test_owner_of_buyer_account_can_get_full_details(self):
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(self.buyer_retrieve_update_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        self.assertIn('user', res.data)
        self.assertIn('bio', res.data)
        self.assertIn('username', res.data['user'])
        self.assertIn('email', res.data['user'])
        self.assertIn('first_name', res.data['user'])
        self.assertIn('last_name', res.data['user'])
        self.assertIn('date_joined', res.data['user'])

    def test_user_cannot_get_buyer_details_with_wrong_username(self):
        buyer_retrieve_update_url = reverse(
            'buyer-retrieve-update', kwargs={'username': 'wrong_username'})
        res = self.client.get(buyer_retrieve_update_url)
        self.assertEqual(res.status_code, 404)

    def test_owner_of_buyer_account_can_edit_details(self):
        token = self.login_user_and_get_token(self.test_user)
        data = {
            'bio': 'new bio',
            'profile_image_path': self.generate_test_image(),
        }
        res = self.client.patch(self.buyer_retrieve_update_url,
                                data,
                                headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['bio'], self.test_user.buyer_account.bio)

    def test_not_owner_of_buyer_account_cannot_edit_details(self):
        data = {'bio': 'new bio',
                'profile_image_path': ""}

        token = self.login_user_and_get_token(self.new_user)
        res = self.client.patch(self.buyer_retrieve_update_url,
                                data,
                                headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(data['bio'],
                            self.test_user.buyer_account.bio)
        self.assertNotEqual(bool(data['profile_image_path']),
                            self.test_user.buyer_account.profile_image_path)

    def test_unauthorized_user_cannot_edit_buyer_account_details(self):
        data = {'bio': 'new bio',
                'profile_image_path': ""}

        res = self.client.patch(self.buyer_retrieve_update_url, data)

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(data['bio'],
                            self.test_user.buyer_account.bio)
        self.assertNotEqual(bool(data['profile_image_path']),
                            self.test_user.buyer_account.profile_image_path)

    def test_user_can_get_wishlist(self):
        token = self.login_user_and_get_token(self.test_user)
        self.create_test_wishlist_entry()
        res = self.client.get(self.wishlist_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_others_wishlist(self):
        token = self.login_user_and_get_token(self.new_user)
        self.create_test_wishlist_entry()
        res = self.client.get(self.wishlist_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_wishlist(self):
        token = 'wrong_token'
        self.create_test_wishlist_entry()
        res = self.client.get(self.wishlist_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_user_can_create_wishlist_entry(self):
        token = self.login_user_and_get_token(self.test_user)
        data = {'listing': self.test_listing.pk}
        res = self.client.post(self.wishlist_list_create_url,
                               data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 201)

    def test_user_cannot_create_wishlist_entry_using_others_username_in_url(self):
        token = self.login_user_and_get_token(self.new_user)
        data = {'listing': self.test_listing.pk}
        res = self.client.post(self.wishlist_list_create_url,
                               data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_create_wishlist_entry(self):
        token = 'invalid_token'
        data = {'listing': self.test_listing.pk}
        res = self.client.post(self.wishlist_list_create_url,
                               data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_user_can_destroy_wishlist_entry(self):
        token = self.login_user_and_get_token(self.test_user)

        wishlist_entry = self.create_test_wishlist_entry()

        wishlist_entry_destroy_url = reverse(
            'wishlist-entry-destroy',
            kwargs={'username': self.test_user.username, 'pk': wishlist_entry.pk})

        res = self.client.delete(wishlist_entry_destroy_url,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 204)
        self.assertFalse(WishlistEntry.objects.filter(
            id=wishlist_entry.id).exists())

    def test_user_cannot_destroy_wishlist_entry_they_dont_own(self):
        token = self.login_user_and_get_token(self.new_user)

        wishlist_entry = self.create_test_wishlist_entry()

        wishlist_entry_destroy_url = reverse(
            'wishlist-entry-destroy',
            kwargs={'username': self.test_user.username, 'pk': wishlist_entry.pk})

        res = self.client.delete(wishlist_entry_destroy_url,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 403)
        self.assertTrue(WishlistEntry.objects.filter(
            id=wishlist_entry.id).exists())

    def test_unauthorized_user_cannot_destroy_wishlist_entry_they_dont_own(self):
        token = 'invalid_token'

        wishlist_entry = self.create_test_wishlist_entry()

        wishlist_entry_destroy_url = reverse(
            'wishlist-entry-destroy',
            kwargs={'username': self.test_user.username, 'pk': wishlist_entry.pk})

        res = self.client.delete(wishlist_entry_destroy_url,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertTrue(WishlistEntry.objects.filter(
            id=wishlist_entry.id).exists())
