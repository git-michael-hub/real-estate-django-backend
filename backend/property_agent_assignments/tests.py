from django.urls import reverse

from properties.tests import TestPropertySetUp

from .models import PropertyAgentAssignment


class TestPropertyAgentAssignmentSetUp(TestPropertySetUp):
    def setUp(self):
        super().setUp()

        self.new_user.agent_account.is_active = True
        self.new_user.agent_account.save()

        self.test_seller = self.test_user.seller_account
        self.test_agent = self.new_user.agent_account
        self.test_property = self.test_seller.properties.first()

        self.test_property_agent_assignment = PropertyAgentAssignment.objects.create(
            property=self.test_property, agent=self.test_agent)

        self.assigned_agent_list_create_url = reverse(
            'assigned-agent-list-create', kwargs={'username': self.test_user.username,
                                                  'property_pk': self.test_property.pk})

        self.assigned_agent_retrieve_destroy_url = reverse(
            'assigned-agent-retrieve-destroy', kwargs={'username': self.test_user.username,
                                                       'property_pk': self.test_property.pk,
                                                       'pk': self.test_property_agent_assignment.pk})

        self.assigned_property_list_url = reverse(
            'assigned-property-list', kwargs={'username': self.new_user.username})

        self.assigned_property_retrieve_url = reverse(
            'assigned-property-retrieve', kwargs={'username': self.new_user.username,
                                                  'pk': self.test_property_agent_assignment.pk})

        self.new_property_agent_assignment_data = {
            'property': self.test_property.pk,
            'agent': self.test_agent.pk
        }

    def tearDown(self):
        return super().tearDown()


class TestPropertyAgentAssignment(TestPropertyAgentAssignmentSetUp):

    fixtures = ['users.json', 'sellers.json', 'agents.json',
                'properties.json']

    def test_seller_can_create_property_agent_assignment(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.post(self.assigned_agent_list_create_url,
                               self.new_property_agent_assignment_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 201)

    def test_seller_cannot_create_property_agent_assignment_of_property_they_dont_own(self):
        self.test_agent.user.seller_account.is_active = True
        self.test_agent.user.seller_account.save()

        token = self.login_user_and_get_token(self.test_agent.user)
        assigned_agent_create_url = reverse(
            'assigned-agent-list-create', kwargs={'username': self.test_agent.user.username,
                                                  'property_pk': self.test_property.pk})

        res = self.client.post(assigned_agent_create_url,
                               self.new_property_agent_assignment_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_create_property_agent_assignment(self):
        token = 'invalid_token'
        res = self.client.post(self.assigned_agent_list_create_url,
                               self.new_property_agent_assignment_data,
                               headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_seller_can_get_assigned_agent_list(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.get(self.assigned_agent_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_seller_cannot_get_assigned_agent_list_of_property_they_dont_own(self):
        self.test_agent.user.seller_account.is_active = True
        self.test_agent.user.seller_account.save()

        token = self.login_user_and_get_token(self.test_agent.user)

        assigned_agent_list_url = reverse(
            'assigned-agent-list-create', kwargs={'username': self.test_agent.user.username,
                                                  'property_pk': self.test_property.pk})
        res = self.client.get(assigned_agent_list_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_assigned_agent_list(self):
        token = 'invalid_token'
        res = self.client.get(self.assigned_agent_list_create_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_seller_can_get_property_agent_assignment_details(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.get(self.assigned_agent_retrieve_destroy_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_seller_cannot_get_property_agent_assignment_details_of_property_they_dont_own(self):
        self.test_agent.user.seller_account.is_active = True
        self.test_agent.user.seller_account.save()

        token = self.login_user_and_get_token(self.test_agent.user)

        assigned_agent_retrieve_url = reverse(
            'assigned-agent-retrieve-destroy', kwargs={'username': self.test_agent.user.username,
                                                       'property_pk': self.test_property.pk,
                                                       'pk': self.test_property_agent_assignment.pk})
        res = self.client.get(assigned_agent_retrieve_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_property_agent_assignment_details(self):
        token = 'invalid_token'
        res = self.client.get(self.assigned_agent_retrieve_destroy_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_seller_can_destroy_property_agent_assignment(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.delete(self.assigned_agent_retrieve_destroy_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 204)
        self.assertFalse(PropertyAgentAssignment.objects.filter(
            pk=self.test_property_agent_assignment.pk).exists())

    def test_seller_cannot_destroy_property_agent_assignment_they_dont_own(self):
        self.test_agent.user.seller_account.is_active = True
        self.test_agent.user.seller_account.save()

        token = self.login_user_and_get_token(self.test_agent.user)

        assigned_agent_destroy_url = reverse(
            'assigned-agent-retrieve-destroy', kwargs={'username': self.test_agent.user.username,
                                                       'property_pk': self.test_property.pk,
                                                       'pk': self.test_property_agent_assignment.pk})
        res = self.client.delete(assigned_agent_destroy_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)
        self.assertTrue(PropertyAgentAssignment.objects.filter(
            pk=self.test_property_agent_assignment.pk).exists())

    def test_unauthorized_user_cannot_destroy_property_agent_assignment(self):
        token = 'invalid_token'
        res = self.client.delete(self.assigned_agent_retrieve_destroy_url,
                                 headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)
        self.assertTrue(PropertyAgentAssignment.objects.filter(
            pk=self.test_property_agent_assignment.pk).exists())

    def test_agent_can_get_assigned_property_list(self):
        token = self.login_user_and_get_token(self.test_agent.user)
        res = self.client.get(self.assigned_property_list_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_agent_cannot_get_assigned_property_list_they_dont_own(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.get(self.assigned_property_list_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_assigned_property_list(self):
        token = 'invalid_token'
        res = self.client.get(self.assigned_property_list_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)

    def test_agent_can_get_assigned_property_details(self):
        token = self.login_user_and_get_token(self.test_agent.user)
        res = self.client.get(self.assigned_property_retrieve_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 200)

    def test_agent_cannot_get_assigned_property_details_they_dont_own(self):
        token = self.login_user_and_get_token(self.test_seller.user)
        res = self.client.get(self.assigned_property_retrieve_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_assigned_property_details(self):
        token = 'invalid_token'
        res = self.client.get(self.assigned_property_retrieve_url,
                              headers=self.create_auth_header(token))
        self.assertEqual(res.status_code, 401)
