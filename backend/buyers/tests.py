from django.urls import reverse

from users.tests import TestUserSetUp

from listings.models import Listing


class TestBuyerSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.buyer_retrieve_update_url = reverse(
            'buyer-retrieve-update',
            kwargs={'username': self.test_user.username}
        )

        self.buyer_wishlist_url = reverse(
            'buyer-wishlist',
            kwargs={'username': self.test_user.username}
        )

        self.test_listing = Listing.objects.get(pk=1)

    def get_ids_from_list_or_queryset(self, items):
        """
        Takes in a queryset or list of objects / dicts. 
        Returns a list of ids.
        Raises an error if an item doesn't have an id.
        """
        ids = []
        for item in items:
            id_value = None

            if isinstance(item, dict):
                id_value = item.get('id')
            else:
                id_value = getattr(item, 'id', None)

            if id_value is None:
                raise AttributeError(
                    f'Item {item} has no "id" attribute in {items}.')

            ids.append(id_value)

        return ids

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
        self.assertIn('wishlist', res.data)
        self.assertIn('username', res.data['user'])
        self.assertIn('email', res.data['user'])
        self.assertIn('first_name', res.data['user'])
        self.assertIn('last_name', res.data['user'])
        self.assertIn('date_joined', res.data['user'])

    def test_not_owner_of_buyer_account_can_get_partial_details(self):
        token = self.login_user_and_get_token(self.new_user)
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
        self.assertNotIn('wishlist', res.data)

    def test_unauthorized_user_can_get_partial_details_of_buyer_account(self):
        res = self.client.get(self.buyer_retrieve_update_url)
        self.assertEqual(res.status_code, 200)
        self.assertIn('user', res.data)
        self.assertIn('bio', res.data)
        self.assertIn('username', res.data['user'])
        self.assertIn('email', res.data['user'])
        self.assertIn('first_name', res.data['user'])
        self.assertIn('last_name', res.data['user'])
        self.assertIn('date_joined', res.data['user'])
        self.assertNotIn('wishlist', res.data)

    def test_user_cannot_get_buyer_details_with_wrong_input(self):
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

    def test_unauthorized_user_cannot_edit_details_of_buyer_account(self):
        data = {'bio': 'new bio',
                'profile_image_path': ""}

        res = self.client.patch(self.buyer_retrieve_update_url, data)

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(data['bio'],
                            self.test_user.buyer_account.bio)
        self.assertNotEqual(bool(data['profile_image_path']),
                            self.test_user.buyer_account.profile_image_path)

    def test_owner_can_get_wishlist(self):
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(self.buyer_wishlist_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        # self.assertIn('wishlist', res.data)

    def test_not_owner_cannot_get_wishlist(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(self.buyer_wishlist_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_wishlist(self):
        token = 'wrong_token'
        res = self.client.get(self.buyer_wishlist_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_owner_can_edit_wishlist(self):
        token = self.login_user_and_get_token(self.test_user)

        data = {'add_listing': self.test_listing.pk}
        res1 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res1.status_code, 200)
        self.assertIn(self.test_listing.pk,
                      self.get_ids_from_list_or_queryset(
                          self.test_user.buyer_account.wishlist.all()))

        data = {'remove_listing': self.test_listing.pk}
        res2 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res2.status_code, 200)
        self.assertNotIn(self.test_listing.pk,
                         self.get_ids_from_list_or_queryset(
                             self.test_user.buyer_account.wishlist.all()))

    def test_not_owner_cannot_edit_wishlist_of_others(self):
        token = self.login_user_and_get_token(self.new_user)

        data = {'add_listing': self.test_listing.pk}
        res1 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res1.status_code, 403)
        self.assertNotIn(self.test_listing.pk,
                         self.get_ids_from_list_or_queryset(
                             self.test_user.buyer_account.wishlist.all()))

        data = {'remove_listing': self.test_listing.pk}
        res2 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res2.status_code, 403)

    def test_unauthorized_user_cannot_edit_wishlist(self):
        token = 'wrong_token'

        data = {'add_listing': self.test_listing.pk}
        res1 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res1.status_code, 401)
        self.assertNotIn(self.test_listing.pk,
                         self.get_ids_from_list_or_queryset(
                             self.test_user.buyer_account.wishlist.all()))

        data = {'remove_listing': self.test_listing.pk}
        res2 = self.client.patch(self.buyer_wishlist_url,
                                 data,
                                 headers=self.create_auth_header(token))

        self.test_user.refresh_from_db()
        self.assertEqual(res2.status_code, 401)
