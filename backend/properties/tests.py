import datetime

from django.urls import reverse

from sellers.tests import TestSellerSetUp

from users.models import User

from .models import Property


class TestPropertySetUp(TestSellerSetUp):
    def setUp(self):
        super().setUp()

        self.test_property = Property.objects.get(pk=1)

        self.property_list_create_url = reverse(
            'seller-property-list-create',
            kwargs={'username': self.test_user.username})

        self.property_retrieve_update_destroy_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={
                'username': self.test_user.username,
                'pk': self.test_property.pk
            }
        )

        self.property_list_url = self.property_list_create_url
        self.property_create_url = self.property_list_create_url
        self.property_retrieve_url = self.property_retrieve_update_destroy_url
        self.property_update_url = self.property_retrieve_update_destroy_url
        self.property_delete_url = self.property_retrieve_update_destroy_url

        self.new_property_data = {
            "seller_account": 10,
            "property_type": "HL",
            "lot_area": 999,
            "floor_area": 999,
            "num_of_floors": 999,
            "bedrooms": 999,
            "bathrooms": 999,
            "province": "New Province",
            "city": "New City",
            "barangay": "New Barangay",
            "street": "New Street",
            "image1_path": self.generate_test_image(),
            "image2_path": self.generate_test_image(),
            "image3_path": self.generate_test_image(),
            "image4_path": self.generate_test_image(),
            "image5_path": self.generate_test_image()
        }

    def tearDown(self):
        return super().tearDown()


class TestProperty(TestPropertySetUp):

    fixtures = ['users.json', 'sellers.json',
                'properties.json', 'listings.json']

    def test_seller_can_create_property(self):
        # test seller should be able to create a property
        token = self.login_user_and_get_token(self.test_user)
        self.new_property_data['image1_path'] = self.generate_test_image()
        res = self.client.post(
            self.property_create_url,
            self.new_property_data,
            format='multipart',
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 201)

    # -------------------------------------------------------------------------------------------

    def test_seller_cannot_create_property_with_invalid_data(self):
        # test seller should not be able to create a property with an invalid data
        token = self.login_user_and_get_token(self.test_user)
        self.new_property_data['property_type'] = 0
        res = self.client.post(
            self.property_create_url,
            self.new_property_data,
            format='multipart',
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 400)

    # -------------------------------------------------------------------------------------------

    def test_seller_can_get_property_list(self):
        # test seller should be able to get thier list of properties
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(self.property_list_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_get_list_of_properties_they_do_not_own(self):
        # test user should not be able to get list of properties that they do not own
        token = self.login_user_and_get_token(self.test_user)
        user2 = User.objects.get(pk=11)
        res = self.client.get(reverse(
            'seller-property-list-create', kwargs={'username': user2.username}),
            headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    # -------------------------------------------------------------------------------------------

    def test_unauthorized_user_cannot_get_property_list(self):
        # test unauthorized user should not be able to get list of properties
        res = self.client.get(self.property_list_url)
        self.assertEqual(res.status_code, 401)

    # -------------------------------------------------------------------------------------------

    def test_seller_can_retrieve_property(self):
        # test seller should be able get property they own
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(self.property_retrieve_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_get_property_they_do_not_own(self):
        # test user should not be able to get the property that they do not own
        token = self.login_user_and_get_token(self.test_user)
        user2 = User.objects.get(pk=11)
        property_retrieve_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={'username': user2.username, 'pk': self.test_property.pk}
        )
        res = self.client.get(
            property_retrieve_url,
            headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    # -------------------------------------------------------------------------------------------

    def test_unauthorized_user_cannot_retreive_property(self):
        # test unauthorized user should not be able to get property
        res = self.client.get(self.property_retrieve_url)
        self.assertEqual(res.status_code, 401)

    # -------------------------------------------------------------------------------------------

    def test_seller_can_edit_property(self):
        # test seller should be able to edit property fields when property is not listed yet
        token = self.login_user_and_get_token(self.test_user)
        self.new_property_data['property_type'] = 'CO'
        property_update_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={'username': self.test_user.username, 'pk': 12}
        )
        res = self.client.patch(property_update_url,
                                self.new_property_data,
                                headers=self.create_auth_header(token)
                                )
        property = Property.objects.get(pk=12)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.new_property_data['property_type'],
            property.property_type
        )
        self.assertEqual(
            self.new_property_data['province'],
            property.province
        )
        self.assertEqual(
            self.new_property_data['city'],
            property.city
        )
        self.assertEqual(
            self.new_property_data['barangay'],
            property.barangay
        )
        self.assertEqual(
            self.new_property_data['street'],
            property.street
        )
        self.assertEqual(
            self.new_property_data['lot_area'],
            property.lot_area
        )
        self.assertEqual(
            self.new_property_data['floor_area'],
            property.floor_area
        )
        self.assertEqual(
            self.new_property_data['num_of_floors'],
            property.num_of_floors
        )
        self.assertEqual(
            self.new_property_data['bedrooms'],
            property.bedrooms
        )
        self.assertEqual(
            self.new_property_data['bathrooms'],
            property.bathrooms
        )
        self.assertIn('image1_path', res.data)
        self.assertIn('image2_path', res.data)
        self.assertIn('image3_path', res.data)
        self.assertIn('image4_path', res.data)
        self.assertIn('image5_path', res.data)

    # -------------------------------------------------------------------------------------------

    def test_seller_cannot_edit_non_editable_fields_in_property(self):
        # test seller should not be able to edit 'seller_account' and 'created_at' fields even
        # when property is not listed yet
        token = self.login_user_and_get_token(self.test_user)
        property_update_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={'username': self.test_user.username, 'pk': 12}
        )
        non_editable_data = {'seller_account': 2,
                             'created_at': datetime.date(2023, 12, 1)
                             }
        res = self.client.patch(property_update_url,
                                non_editable_data,
                                headers=self.create_auth_header(token)
                                )

        # test seller should not be able to edit the ff fields when the property is already listed:
        # ['property_type', 'province', 'city, 'barangay', 'street', 'lot_area', 'floor_area',
        # 'num_of_floors', 'bedrooms', 'bathrooms']
        self.new_property_data['property_type'] = 'CO'
        res = self.client.patch(self.property_update_url,
                                self.new_property_data,
                                headers=self.create_auth_header(token)
                                )
        property = Property.objects.get(pk=self.test_property.pk)
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            self.new_property_data['property_type'],
            property.property_type
        )
        self.assertNotEqual(
            self.new_property_data['province'],
            property.province
        )
        self.assertNotEqual(
            self.new_property_data['city'],
            property.city
        )
        self.assertNotEqual(
            self.new_property_data['barangay'],
            property.barangay
        )
        self.assertNotEqual(
            self.new_property_data['street'],
            property.street
        )
        self.assertNotEqual(
            self.new_property_data['lot_area'],
            property.lot_area
        )
        self.assertNotEqual(
            self.new_property_data['floor_area'],
            property.floor_area
        )
        self.assertNotEqual(
            self.new_property_data['num_of_floors'],
            property.num_of_floors
        )
        self.assertNotEqual(
            self.new_property_data['bedrooms'],
            property.bedrooms
        )
        self.assertNotEqual(
            self.new_property_data['bathrooms'],
            property.bathrooms
        )

    # -------------------------------------------------------------------------------------------

    def test_seller_can_soft_delete_their_property_without_active_listing(self):
        # test seller should be able to soft delete their own property that doesn't have an active listing
        # property with pk=12 doesn't have an active listing in this example
        token = self.login_user_and_get_token(self.test_user)
        property = Property.objects.get(pk=12)
        property_delete_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={'username': self.test_user.username, 'pk': property.pk}
        )
        res = self.client.delete(
            property_delete_url, headers=self.create_auth_header(token))
        property = Property.objects.get(pk=12)
        self.assertEqual(res.status_code, 204)
        self.assertEqual(property.is_deleted, True)

    # -------------------------------------------------------------------------------------------

    def test_seller_cannot_soft_delete_their_property_with_active_listing(self):
        # test seller should not be able to soft delete property with an active listing
        # test_property has an active listing in this example
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.delete(
            self.property_delete_url, headers=self.create_auth_header(token))
        property = Property.objects.get(pk=self.test_property.pk)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(property.is_deleted, False)

    # -------------------------------------------------------------------------------------------

    def test_unauthorized_user_cannot_delete_property(self):
        # test unauthorized user should not be able to delete property
        res = self.client.delete(self.property_delete_url)
        self.assertEqual(res.status_code, 401)

    # -------------------------------------------------------------------------------------------

    def test_user_cannot_delete_property_they_do_not_own(self):
        # test user should not be able to delete property that they don't own
        token = self.login_user_and_get_token(self.test_user)
        user2 = User.objects.get(pk=11)
        property_of_user2 = user2.seller_account.properties.all()[0]
        property_delete_url = reverse(
            'seller-property-retrieve-update-destroy',
            kwargs={'username': user2.username, 'pk': property_of_user2.id}
        )
        res = self.client.delete(property_delete_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)
