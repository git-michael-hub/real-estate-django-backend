# from django.urls import reverse
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password

# from listings.tests import TestListingsSetUp

# from .models import Inquiries


# class TestInquiriesSetUp(TestListingsSetUp):
#     def setUp(self):
#         super().setUp()

#         self.recipient = self.seller
#         self.recipient_login_data = self.seller_login_data

#         self.inquired_listing = self.listing
#         self.not_existing_inquiry = {
#             'recipient': self.recipient.id,
#             'listing': self.inquired_listing.id,
#             'sender_name': 'not existing user',
#             'contact_number': 999999999,
#             'email': 'notexistinguser1@gmail.com',
#             'message': 'this inquiry does not exist yet'
#         }

#         self.existing_inquiry = Inquiries.objects.create(recipient=self.recipient, listing=self.inquired_listing,
#                                                          sender_name='existing user', contact_number=1111111111,
#                                                          email='existinguser@gmail.com', message='this inquiry exists')

#         self.test_kwargs1 = {'recipient_username': self.recipient.username}
#         self.test_kwargs2 = {
#             'recipient_username': self.recipient.username, 'id': self.existing_inquiry.id}

#         self.inquiry_list_url = reverse(
#             'inquiries_list_create', kwargs=self.test_kwargs1)
#         self.inquiry_create_url = reverse(
#             'inquiries_list_create', kwargs=self.test_kwargs1)
#         self.inquiry_detail_url = reverse(
#             'inquiries_detail_edit_delete', kwargs=self.test_kwargs2)
#         self.inquiry_edit_url = reverse(
#             'inquiries_detail_edit_delete', kwargs=self.test_kwargs2)
#         self.inquiry_delete_url = reverse(
#             'inquiries_detail_edit_delete', kwargs=self.test_kwargs2)

#     def tearDown(self):
#         super().tearDown()


# class TestInquiriesView(TestInquiriesSetUp):

#     def test_user_can_create_inquiry(self):
#         res = self.client.post(self.inquiry_create_url,
#                                self.not_existing_inquiry)
#         self.assertEqual(res.status_code, 201)
#         self.assertEqual(res.data['message'],
#                          self.not_existing_inquiry['message'])

#     def test_recipient_can_get_inquiries(self):
#         token = self.login_and_get_token(self.recipient_login_data)
#         res = self.client.get(self.inquiry_list_url, headers={
#                               'Authorization': f'Token {token}'})
#         self.assertEqual(res.status_code, 200)

#     def test_not_recipient_cannot_get_inquiries(self):
#         # TEST WITH AUTHORIZED USER BUT NOT RECIPIENT OF INQUIRY
#         token = self.login_and_get_token(self.buyer_login_data)
#         res = self.client.get(self.inquiry_list_url, headers={
#                               'Authorization': f'Token {token}'})
#         self.assertEqual(res.status_code, 403)

#         # TEST WITH UN-AUTHORIZED USER
#         res = self.client.get(self.inquiry_list_url)
#         self.assertEqual(res.status_code, 401)

#     def test_not_recipient_cannot_get_detailed_inquiries(self):
#         # TEST WITH AUTHORIZED USER BUT NOT RECIPIENT OF INQUIRY
#         token = self.login_and_get_token(self.buyer_login_data)
#         res = self.client.get(self.inquiry_detail_url, headers={
#                               'Authorization': f'Token {token}'})
#         self.assertEqual(res.status_code, 403)

#         # TEST WITH UN-AUTHORIZED USER
#         res = self.client.get(self.inquiry_detail_url)
#         self.assertEqual(res.status_code, 401)

#     def test_recipient_can_only_edit_is_read_field(self):
#         token = self.login_and_get_token(self.recipient_login_data)
#         data = self.not_existing_inquiry
#         data['recipient'] = 200
#         data['listing'] = 200
#         data['is_read'] = True

#         res = self.client.patch(self.inquiry_edit_url, data,
#                                 headers={'Authorization': f'Token {token}'})
#         self.assertNotEqual(res.data['recipient'], data['recipient'])
#         self.assertNotEqual(res.data['listing'], data['listing'])
#         self.assertNotEqual(res.data['sender_name'], data['sender_name'])
#         self.assertNotEqual(res.data['contact_number'], data['contact_number'])
#         self.assertNotEqual(res.data['email'], data['email'])
#         self.assertNotEqual(res.data['message'], data['message'])
#         self.assertEqual(res.data['is_read'], data['is_read'])

#     def test_not_recipient_cannot_edit_inquiry(self):
#         token = self.login_and_get_token(self.buyer_login_data)
#         data = self.not_existing_inquiry
#         data['recipient'] = 200
#         data['listing'] = 200
#         data['is_read'] = True

#         # TEST WITH AUTHORIZED USER BUT NOT RECIPIENT OF INQUIRY
#         res = self.client.patch(self.inquiry_edit_url, data,
#                                 headers={'Authorization': f'Token {token}'})
#         self.assertEqual(res.status_code, 403)

#         # TEST WITH UN-AUTHORIZED USER
#         res = self.client.patch(self.inquiry_edit_url, data)
#         self.assertEqual(res.status_code, 401)

#     def test_recipient_can_delete_inquiry(self):
#         token = self.login_and_get_token(self.recipient_login_data)
#         res = self.client.delete(self.inquiry_delete_url, headers={
#                                  'Authorization': f'Token {token}'})

#         self.assertEqual(res.status_code, 204)

#     def test_not_recipient_cannot_delete_inquiry(self):
#         # TEST WITH AUTHORIZED USER BUT NOT RECIPIENT OF INQUIRY
#         token = self.login_and_get_token(self.buyer_login_data)
#         res = self.client.delete(self.inquiry_delete_url, headers={
#                                  'Authorization': f'Token {token}'})
#         self.assertEqual(res.status_code, 403)

#         # TEST WITH UN-AUTHORIZED USER
#         res = self.client.delete(self.inquiry_delete_url)
#         self.assertEqual(res.status_code, 401)
