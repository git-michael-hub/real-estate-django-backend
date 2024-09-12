from django.urls import reverse

from .models import Favorites

from listings.tests import TestListingsSetUp


class TestFavoritesSetUp(TestListingsSetUp):

    def setUp(self):
        super().setUp()

        self.favorites = Favorites.objects.create(user=self.buyer)

        self.favorite_listing_detail_update_url = reverse(
            'favorite_listing_detail_update', kwargs={'username': self.buyer.username})

    def tearDown(self):
        super().tearDown()


class TestFavoritesView(TestFavoritesSetUp):

    def test_owner_can_get_favorites(self):
        token = self.login_and_get_token(self.buyer_login_data)
        res = self.client.get(self.favorite_listing_detail_update_url,
                              headers={'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['id'], self.favorites.id)

    def test_not_owner_cannot_get_favorites(self):
        token = self.login_and_get_token(self.seller_login_data)
        res = self.client.get(self.favorite_listing_detail_update_url,
                              headers={'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 403)

    def test_owner_can_add_and_remove_favorites(self):
        token = self.login_and_get_token(self.buyer_login_data)

        add_to_favorites = {
            'add_to_favorites': self.listing.id
        }
        res1 = self.client.patch(self.favorite_listing_detail_update_url,
                                 add_to_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res1.status_code, 200)
        self.assertIn(self.listing.id, res1.data['listings'])

        remove_from_favorites = {
            'remove_from_favorites': self.listing.id
        }
        res2 = self.client.patch(self.favorite_listing_detail_update_url,
                                 remove_from_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res2.status_code, 200)
        self.assertNotIn(self.listing.id, res2.data['listings'])

    def test_not_owner_cannot_edit_favorites(self):
        token = self.login_and_get_token(self.seller_login_data)

        add_to_favorites = {
            'add_to_favorites': self.listing.id
        }
        res1 = self.client.patch(self.favorite_listing_detail_update_url,
                                 add_to_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res1.status_code, 403)

        remove_from_favorites = {
            'remove_from_favorites': self.listing.id
        }
        res2 = self.client.patch(self.favorite_listing_detail_update_url,
                                 remove_from_favorites, headers={'Authorization': f'Token {token}'})
        self.assertEqual(res2.status_code, 403)
