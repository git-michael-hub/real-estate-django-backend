from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from .listings_data import test_listings

from .models import Listing

from user.tests import TestUserSetUp


class TestListingsSetUp(TestUserSetUp):

    def setUp(self):
        super().setUp()

        self.test_buyer = {
            'username': 'buyer',
            'email': 'buyer@gmail.com',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123'
        }
        self.buyer_login_data = {
            'username': self.test_buyer['username'],
            'password': self.test_buyer['password']
        }

        self.test_seller = {
            'username': 'seller',
            'email': 'seller@gmail.com',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123'
        }

        self.seller_login_data = {
            'username': self.test_seller['username'],
            'password': self.test_seller['password']
        }

        self.test_listing = {
            'title': 'test title 1',
            'description': 'test description 1',
            'listing_type': 'FS',
            'property_type': 'HL',
            'price': 1000000,
            'property_size': 100,
            'bedrooms': 2,
            'bathrooms': 2,
            'province': 'Province 1',
            'city': 'City 1',
            'baranggay': 'Baranggay 1',
            'street': 'Street 1'
        }

        self.test_listings = test_listings

        self.buyer = self.create_buyer(self.test_buyer)
        self.seller = self.create_seller(self.test_seller)
        self.listing = self.create_listing(self.seller, self.test_listing)
        self.listings = self.create_listings(self.seller, self.test_listings)

        self.listing_list_url = reverse('listing_list_create_view')
        self.listing_create_url = reverse('listing_list_create_view')
        self.listing_update_url = reverse(
            'listing_detail_update_delete_view', kwargs={'id': self.listing.id})
        self.listing_detail_url = reverse(
            'listing_detail_update_delete_view', kwargs={'id': self.listing.id})
        self.listing_delete_url = reverse(
            'listing_detail_update_delete_view', kwargs={'id': self.listing.id})

    def create_buyer(self, user_data):
        user = self.create_registered_user(user_data)
        return user

    def create_seller(self, user_data):
        user = self.create_registered_user(user_data)
        user.roles.is_seller = True
        user.roles.save()
        return user

    def create_listing(self, owner, listing_data):
        listing = Listing.objects.create(owner=owner,
                                         title=listing_data['title'],
                                         description=listing_data['description'],
                                         listing_type=listing_data['listing_type'],
                                         property_type=listing_data['property_type'],
                                         price=listing_data['price'],
                                         property_size=listing_data['property_size'],
                                         province=listing_data['province'],
                                         city=listing_data['city'],
                                         baranggay=listing_data['baranggay'],
                                         street=listing_data['street'])
        if listing_data.get('bedrooms'):
            listing.bedrooms = listing_data['bedrooms']
        if listing_data.get('bathrooms'):
            listing.bathrooms = listing_data['bathrooms']
        listing.save()

        return listing

    def create_listings(self, seller, test_listings):
        for test_listing in test_listings:
            self.create_listing(seller, test_listing)

    def tearDown(self):
        return super().tearDown()


class TestListingsView(TestListingsSetUp):

    def test_seller_can_create_listing(self):
        token = self.login_and_get_token(self.seller_login_data)
        self.test_listing['owner'] = self.seller.id
        res = self.client.post(self.listing_create_url,
                               self.test_listing, headers={'Authorization': f'Token {token}'})

        self.assertEqual(res.status_code, 201)

    def test_buyer_cannot_create_listing(self):
        token = self.login_and_get_token(self.buyer_login_data)
        self.test_listing['owner'] = self.buyer.id
        res = self.client.post(self.listing_create_url,
                               self.test_listing, headers={'Authorization': f'Token {token}'})

        self.assertEqual(res.status_code, 403)

    def test_user_can_get_detailed_listing(self):
        res = self.client.get(self.listing_detail_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['id'], self.listing.id)

    def test_owner_can_edit_listing(self):
        token = self.login_and_get_token(self.seller_login_data)
        data = {'title': 'edit title'}
        res = self.client.patch(self.listing_update_url, data, headers={
                                'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 200)
        self.assertNotEqual(res.data['title'], self.test_listing['title'])
        self.assertEqual(res.data['title'], data['title'])

    def test_user_cannot_edit_listing_is_read_only(self):
        token = self.login_and_get_token(self.seller_login_data)
        data = {'owner': self.buyer.id}
        res = self.client.patch(self.listing_update_url, data, headers={
                                'Authorization': f'Token {token}'})

        self.assertEqual(res.data['owner']['id'], self.seller.id)

    def test_not_owner_cannot_edit_listing(self):
        token = self.login_and_get_token(self.buyer_login_data)
        data = {'title': 'edit title'}
        res = self.client.patch(self.listing_update_url, data, headers={
                                'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 403)

    def test_owner_can_delete_listing(self):
        token = self.login_and_get_token(self.seller_login_data)
        res = self.client.delete(self.listing_delete_url, headers={
                                 'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 204)

    def test_not_onwer_cannot_delete_listing(self):
        token = self.login_and_get_token(self.buyer_login_data)
        res = self.client.delete(self.listing_delete_url, headers={
                                 'Authorization': f'Token {token}'})
        self.assertEqual(res.status_code, 403)

        res = self.client.delete(self.listing_delete_url)
        self.assertEqual(res.status_code, 401)

    def test_user_can_get_listing_list(self):
        res = self.client.get(
            f'{self.listing_list_url}?property_type=HL')
        self.assertEqual(res.status_code, 200)

        property_types = []
        for data in res.data:
            property_types.append(data['property_type'])

        self.assertIn('HL', property_types)
        self.assertNotIn('CO', property_types)
        self.assertNotIn('RL', property_types)
        self.assertNotIn('CL', property_types)
