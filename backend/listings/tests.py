from django.urls import reverse

from urllib.parse import urlencode

from properties.models import Property

from property_agent_assignments.models import PropertyAgentAssignment
from property_agent_assignments.tests import TestPropertyAgentAssignmentSetUp

from .models import Listing, LISTING_TYPE, LISTING_STATUS


class TestListingsSetUp(TestPropertyAgentAssignmentSetUp):

    def setUp(self):
        super().setUp()

        self.new_user.seller_account.is_active = True
        self.new_user.agent_account.is_active = True
        self.new_user.seller_account.save()
        self.new_user.agent_account.save()

        self.test_listing = Listing.objects.get(pk=1)
        self.listing_agent = self.test_listing.agent_account
        self.listing_property_seller = self.test_listing.property.seller_account
        self.unlisted_property = Property.objects.get(pk=12)

        self.new_listing_data = {'property': self.unlisted_property.pk,
                                 'listing_type': LISTING_TYPE.FOR_SALE,
                                 'title': 'New Listing Title',
                                 'description': 'New Listing Description',
                                 'price': 800000}

        self.query_params = {'listing_type': 'FS',
                             'property_type': 'HL',
                             'max_price': 1000000,
                             'min_area': 80,
                             'province': 'Davao',
                             'city': 'Davao'}

        self.listing_search_url = reverse('listing-search')

        self.listing_retrieve_url = reverse(
            'listing-retrieve', kwargs={'pk': self.test_listing.pk})

        self.agent_listing_list_create_url = reverse(
            'agent-listing-list-create', kwargs={'username': self.listing_agent.user.username})

        self.agent_listing_retrieve_update_destory_url = reverse(
            'agent-listing-retrieve-update-destroy', kwargs={'username': self.listing_agent.user.username,
                                                             'pk': self.test_listing.pk}
        )

        self.seller_listing_list_create_url = reverse(
            'seller-listing-list-create', kwargs={'username': self.listing_property_seller.user.username}
        )

        self.seller_listing_retrieve_destroy_url = reverse(
            'seller-listing-retrieve-destory', kwargs={'username': self.listing_property_seller.user.username,
                                                       'pk': self.test_listing.pk}
        )

    def assign_agent_to_property(self, agent, property):
        PropertyAgentAssignment.objects.create(agent=agent, property=property)

    def compare_listing_type(self, response_data, query_params):
        listing_type = query_params.get('listing_type')
        if listing_type:
            for data in response_data:
                if listing_type != data.get('listing_type'):
                    raise AssertionError(
                        f"'{listing_type}' is not equal to '{data.get('listing_type')}'")

    def compare_property_type(self, response_data, query_params):
        property_type = query_params.get('property_type')
        if property_type:
            for data in response_data:
                if property_type != data['property'].get('property_type'):
                    raise AssertionError(
                        f"'{property_type}' is not equal to '{data.get('property_type')}'")

    def compare_address(self, response_data, query_params):
        province = query_params.get('province')
        city = query_params.get('city')

        if province:
            for data in response_data:
                if province.lower() not in data['property'].get('province').lower():
                    raise AssertionError(
                        f"'{province}' is not in '{data['property'].get('province')}'")

        if city:
            for data in response_data:
                if city.lower() not in data['property'].get('city').lower():
                    raise AssertionError(
                        f"'{city}' is not in '{data['property'].get('city')}'")

    def compare_price(self, response_data, query_params):
        min_price = query_params.get('min_price')
        max_price = query_params.get('max_price')

        if min_price:
            for data in response_data:
                if min_price > data.get('price'):
                    raise AssertionError(
                        f"'{min_price}' is not less than '{data.get('price')}'")

        if max_price:
            for data in response_data:
                if max_price < data.get('price'):
                    raise AssertionError(
                        f"'{max_price}' is not greater than '{data.get('price')}'")

    def compare_area(self, response_data, query_params):
        min_area = query_params.get('min_area')
        max_area = query_params.get('max_area')

        if min_area:
            for data in response_data:
                if min_area > data['property'].get('lot_area'):
                    raise AssertionError(
                        f"'{min_area}' is not less than '{data['property'].get('lot_area')}'")

        if max_area:
            for data in response_data:
                if max_area < data['property'].get('lot_area'):
                    raise AssertionError(
                        f"'{max_area}' is not greater than '{data['property'].get('lot_area')}'")

    def assert_is_listing_filtered_correctly(self, response_data, query_params):
        self.compare_listing_type(response_data, query_params)
        self.compare_property_type(response_data, query_params)
        self.compare_address(response_data, query_params)
        self.compare_price(response_data, query_params)
        self.compare_area(response_data, query_params)

    def create_listing(self, property, listing_data, agent_account=None):
        listing = Listing.objects.create(property=property,
                                         agent_account=agent_account,
                                         title=listing_data['title'],
                                         description=listing_data['description'],
                                         listing_type=listing_data['listing_type'],
                                         price=listing_data['price'])
        return listing

    def tearDown(self):
        return super().tearDown()


class TestListings(TestListingsSetUp):

    fixtures = ['users.json',
                'sellers.json',
                'agents.json',
                'properties.json',
                'property_agent_assignments.json',
                'listings.json']

    def test_user_can_get_listings(self):
        res = self.client.get(self.listing_search_url)
        self.assertEqual(res.status_code, 200)

    def test_user_can_query_listings(self):
        query_url = f"{self.listing_search_url}?{urlencode(self.query_params)}"
        res = self.client.get(query_url)
        self.assertEqual(res.status_code, 200)
        self.assert_is_listing_filtered_correctly(
            res.data['results'], self.query_params)

    def test_user_can_retrieve_listing(self):
        res = self.client.get(self.listing_retrieve_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['id'], self.test_listing.pk)

    def test_user_cannot_retrieve_listing_that_doesnt_exist(self):
        listing_retrieve_url = reverse('listing-retrieve', kwargs={'pk': 999})
        res = self.client.get(listing_retrieve_url)
        self.assertEqual(res.status_code, 404)

    def test_agent_can_get_listings_they_created(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        res = self.client.get(self.agent_listing_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_seller_can_get_listings_of_properties_they_own(self):
        token = self.login_user_and_get_token(
            self.listing_property_seller.user)
        res = self.client.get(self.seller_listing_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_agent_cannot_get_listing_they_didnt_create(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(self.agent_listing_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_seller_cannot_get_listings_of_properties_they_dont_own(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(self.seller_listing_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthenticated_user_cannot_get_listings(self):
        token = 'invalid_token'

        # Test url for agents
        res1 = self.client.get(self.agent_listing_list_create_url,
                               headers=self.create_auth_header(token))

        # Test url for sellers
        res2 = self.client.get(self.seller_listing_list_create_url,
                               headers=self.create_auth_header(token))

        self.assertEqual(res1.status_code, 401)
        self.assertEqual(res2.status_code, 401)

    def test_agent_can_create_listing_for_a_property_they_are_assigned_to(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        self.assign_agent_to_property(agent=self.listing_agent,
                                      property=self.unlisted_property)
        res = self.client.post(self.agent_listing_list_create_url,
                               self.new_listing_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 201)

    def test_seller_can_create_listing_for_a_property_they_own(self):
        token = self.login_user_and_get_token(
            self.listing_property_seller.user)
        res = self.client.post(self.seller_listing_list_create_url,
                               self.new_listing_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 201)

    def test_agent_cannot_create_listing_for_a_property_they_arent_assigned_to(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        res = self.client.post(self.agent_listing_list_create_url,
                               self.new_listing_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 400)

    def test_seller_cannot_create_listing_for_a_property_they_dont_own(self):
        # Change the owner of unlisted_property to new_seller
        self.unlisted_property.seller_account = self.new_user.seller_account
        self.unlisted_property.save()

        token = self.login_user_and_get_token(
            self.listing_property_seller.user)

        res = self.client.post(self.seller_listing_list_create_url,
                               self.new_listing_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 400)

    def test_agent_cannot_create_listing_with_invalid_data(self):
        token = self.login_user_and_get_token(self.listing_agent.user)

        # Test for property that does not exist
        invalid_data1 = self.new_listing_data.copy()
        invalid_data1['property'] = 999

        # Test for negative price
        invalid_data2 = self.new_listing_data.copy()
        invalid_data2['price'] = -1

        # Test for invalid listing type
        invalid_data3 = self.new_listing_data.copy()
        invalid_data3['listing_type'] = 'INVALID_LISTING_TYPE'

        # Test for no data
        invalid_data4 = {}

        res1 = self.client.post(self.agent_listing_list_create_url,
                                invalid_data1,
                                headers=self.create_auth_header(token))
        res2 = self.client.post(self.agent_listing_list_create_url,
                                invalid_data2,
                                headers=self.create_auth_header(token))
        res3 = self.client.post(self.agent_listing_list_create_url,
                                invalid_data3,
                                headers=self.create_auth_header(token))
        res4 = self.client.post(self.agent_listing_list_create_url,
                                invalid_data4,
                                headers=self.create_auth_header(token))

        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)
        self.assertEqual(res4.status_code, 400)

    def test_seller_cannot_create_listing_with_invalid_data(self):
        token = self.login_user_and_get_token(
            self.listing_property_seller.user)

        # Test for property that does not exist
        invalid_data1 = self.new_listing_data.copy()
        invalid_data1['property'] = 999

        # Test for negative price
        invalid_data2 = self.new_listing_data.copy()
        invalid_data2['price'] = -1

        # Test for invalid listing type
        invalid_data3 = self.new_listing_data.copy()
        invalid_data3['listing_type'] = 'INVALID_LISTING_TYPE'

        # Test for no data
        invalid_data4 = {}

        res1 = self.client.post(self.seller_listing_list_create_url,
                                invalid_data1,
                                headers=self.create_auth_header(token))
        res2 = self.client.post(self.seller_listing_list_create_url,
                                invalid_data2,
                                headers=self.create_auth_header(token))
        res3 = self.client.post(self.seller_listing_list_create_url,
                                invalid_data3,
                                headers=self.create_auth_header(token))
        res4 = self.client.post(self.seller_listing_list_create_url,
                                invalid_data4,
                                headers=self.create_auth_header(token))

        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)
        self.assertEqual(res4.status_code, 400)

    def test_unauthenticated_user_cannot_create_listings(self):
        token = 'invalid_token'

        # Test using url for agents
        res1 = self.client.post(self.agent_listing_list_create_url,
                                self.new_listing_data,
                                headers=self.create_auth_header(token))

        # Test using url for sellers
        res2 = self.client.post(self.seller_listing_list_create_url,
                                self.new_listing_data,
                                headers=self.create_auth_header(token))

        self.assertEqual(res1.status_code, 401)
        self.assertEqual(res2.status_code, 401)

    def test_agent_can_retrieve_listing_they_created(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        res = self.client.get(self.agent_listing_retrieve_update_destory_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['id'], self.test_listing.pk)

    def test_seller_can_retrieve_listing_of_property_they_own(self):
        token = self.login_user_and_get_token(
            self.listing_property_seller.user)
        res = self.client.get(self.seller_listing_retrieve_destroy_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['id'], self.test_listing.pk)

    def test_agent_cannot_retrieve_listing_they_didnt_create(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(self.agent_listing_retrieve_update_destory_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_seller_cannot_retrieve_listing_of_property_they_dont_own(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(self.agent_listing_retrieve_update_destory_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthenticated_user_cannot_retrieve_listing(self):
        token = 'invalid_token'

        # Test url for agents
        res1 = self.client.get(self.agent_listing_retrieve_update_destory_url,
                               headers=self.create_auth_header(token))

        # Test url for sellers
        res2 = self.client.get(self.seller_listing_retrieve_destroy_url,
                               headers=self.create_auth_header(token))

        self.assertEqual(res1.status_code, 401)
        self.assertEqual(res2.status_code, 401)

    def test_agent_can_destroy_listing_they_created(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        res = self.client.delete(self.agent_listing_retrieve_update_destory_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 204)

    def test_seller_can_destroy_listing_of_property_they_own(self):
        token = self.login_user_and_get_token(
            self.listing_property_seller.user)
        res = self.client.delete(self.seller_listing_retrieve_destroy_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 204)

    def test_agent_cannot_destroy_listing_they_didnt_create(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.delete(self.agent_listing_retrieve_update_destory_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_seller_cannot_destroy_listing_of_property_they_dont_own(self):
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.delete(self.seller_listing_retrieve_destroy_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_agent_cannot_destroy_inactive_listing(self):
        listing_status = LISTING_STATUS.get_dict()
        listing_status.pop(LISTING_STATUS.ACTIVE)

        token = self.login_user_and_get_token(self.listing_agent.user)
        for status in listing_status:
            self.test_listing.status = status
            self.test_listing.save()
            res = self.client.delete(self.agent_listing_retrieve_update_destory_url,
                                     headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 400)

    def test_seller_cannot_destroy_inactive_listing(self):
        listing_status = LISTING_STATUS.get_dict()
        listing_status.pop(LISTING_STATUS.ACTIVE)

        token = self.login_user_and_get_token(
            self.listing_property_seller.user)
        for status in listing_status:
            self.test_listing.status = status
            self.test_listing.save()
            res = self.client.delete(self.seller_listing_retrieve_destroy_url,
                                     headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 400)

    def test_unauthenticated_user_cannot_delete_listing(self):
        token = 'invalid_token'

        # Test url for agents
        res1 = self.client.delete(self.agent_listing_list_create_url,
                                  headers=self.create_auth_header(token))

        # Test url for sellers
        res2 = self.client.delete(self.seller_listing_retrieve_destroy_url,
                                  headers=self.create_auth_header(token))

        self.test_listing.refresh_from_db()
        self.assertEqual(res1.status_code, 401)
        self.assertEqual(res2.status_code, 401)
        self.assertTrue(Listing.objects.filter(
            pk=self.test_listing.pk).exists())

    def test_agent_can_edit_listings_they_created(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        data = {'title': 'Edited Title',
                'price': 999999999,
                'description': 'Edited Description'}

        res = self.client.patch(self.agent_listing_retrieve_update_destory_url,
                                data=data,
                                headers=self.create_auth_header(token))

        self.test_listing.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['title'], self.test_listing.title)
        self.assertEqual(data['price'], self.test_listing.price)
        self.assertEqual(data['description'], self.test_listing.description)

    def test_agent_cannot_edit_listing_with_invalid_data(self):
        token = self.login_user_and_get_token(self.listing_agent.user)
        initial_listing_data = self.test_listing.__dict__
        invalid_data_list = [
            {'title': 'title'},
            {'price': -1},
            {'listing_type': 'Invalid TYPE'}
        ]

        for invalid_data in invalid_data_list:
            key = list(invalid_data.keys())[0]

            self.client.patch(self.agent_listing_retrieve_update_destory_url,
                              data=invalid_data,
                              headers=self.create_auth_header(token))

            self.test_listing.refresh_from_db()
            self.assertEqual(initial_listing_data[key],
                             getattr(self.test_listing, key, None))

    def test_agent_cannot_directly_edit_inactive_listing(self):
        listing_status = LISTING_STATUS.get_dict()
        listing_status.pop(LISTING_STATUS.ACTIVE)

        token = self.login_user_and_get_token(
            self.listing_agent.user)
        for status in listing_status:
            data = {'status': LISTING_STATUS.ACTIVE}
            self.test_listing.status = status
            self.test_listing.save()

            res = self.client.patch(self.agent_listing_retrieve_update_destory_url,
                                    data=data,
                                    headers=self.create_auth_header(token))
            self.test_listing.refresh_from_db()
            self.assertEqual(res.status_code, 400)
            self.assertEqual(status, self.test_listing.status)
            self.assertNotEqual(LISTING_STATUS.ACTIVE,
                                self.test_listing.status)

    def test_agent_cannot_edit_listings_they_didnt_create(self):
        token = self.login_user_and_get_token(self.new_user)
        data = {'title': 'Edited Title',
                'price': 999999999,
                'description': 'Edited Description'}

        res = self.client.patch(self.agent_listing_retrieve_update_destory_url,
                                data=data,
                                headers=self.create_auth_header(token))

        self.test_listing.refresh_from_db()
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(data['title'], self.test_listing.title)
        self.assertNotEqual(data['price'], self.test_listing.price)
        self.assertNotEqual(data['description'], self.test_listing.description)

    def test_unauthenticated_user_cannot_edit_listing(self):
        token = 'invalid_token'
        data = {'title': 'Edited Title',
                'price': 999999999,
                'description': 'Edited Description'}

        res = self.client.patch(self.agent_listing_retrieve_update_destory_url,
                                data=data,
                                headers=self.create_auth_header(token))

        self.test_listing.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(data['title'], self.test_listing.title)
        self.assertNotEqual(data['price'], self.test_listing.price)
        self.assertNotEqual(data['description'], self.test_listing.description)
