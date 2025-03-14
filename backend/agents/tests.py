import datetime

from django.urls import reverse

from users.tests import TestUserSetUp

from .models import AgentApplication, AGENT_APP_STATUS


class TestAgentSetUp(TestUserSetUp):
    def setUp(self):
        super().setUp()

        self.test_agent_application = AgentApplication.objects.filter(
            agent_account=self.test_user.agent_account, status='A').first()

        self.agent_account_list_url = reverse('agent-account-list')

        self.agent_account_retrieve_update_url = reverse(
            'agent-account-retrieve-update', kwargs={'username': self.test_user.username})

        self.agent_application_list_create_url = reverse(
            'agent-application-list-create', kwargs={'username': self.test_user.username})

        self.agent_application_retrieve_url = reverse(
            'agent-application-retrieve', kwargs={'username': self.test_user.username, 'pk': self.test_agent_application.pk})

        self.agent_application_cancel_url = reverse(
            'agent-application-cancel', kwargs={'username': self.test_user.username, 'pk': self.test_agent_application.pk})

        self.agent_application_data = {
            'agent_name': 'Agent Name',
            'license_number': 'ZZZZZZZZZZZZ',
            'license_document_path': self.generate_test_image()
        }

        self.new_test_agent_data = {
            'agent_name': 'Agent Name',
            'profile_image_path': "",
            'bio': 'Agent Bio'
        }

    def create_agent_application(self, user, application_data):
        """Creates an AgentApplication object directly to db."""
        agent_application = AgentApplication.objects.create(
            agent_account=user.agent_account, **application_data)
        return agent_application

    def tearDown(self):
        super().tearDown()


class TestAgent(TestAgentSetUp):

    fixtures = ['users.json', 'agents.json']

    def test_user_can_get_list_of_agent_application(self):
        # Test authorized user should be able to get their agent_application list.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.agent_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)

    def test_user_can_only_get_their_list_of_agent_application(self):
        # Test authorized user should only be able to get their agent_application list.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.agent_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)
        for application in res.data:
            self.assertEqual(application['agent_name'],
                             self.test_user.agent_account.agent_name)

        # Test authorized user should not be able to get other's agent_application list.
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(
            self.agent_application_list_create_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 403)

    def test_unauntheticated_user_cannot_get_list_of_agent_application(self):
        # Test unauthorized user should not be able to get other user's agent_application list.
        res = self.client.get(self.agent_application_list_create_url,)
        self.assertEqual(res.status_code, 401)

    def test_user_can_get_their_agent_application(self):
        # Test user should be able to get their agent_application details.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.get(
            self.agent_application_retrieve_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_agent_application_that_they_dont_own(self):
        # Test user should not be able get other user's agent_application details.
        token = self.login_user_and_get_token(self.new_user)
        res = self.client.get(
            self.agent_application_retrieve_url,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 403)

    def test_unauthorized_user_cannot_get_agent_application(self):
        # Test unauthorized user should not be able get agent_application details.
        res = self.client.get(self.agent_application_retrieve_url)
        self.assertEqual(res.status_code, 401)

    def test_user_can_cancel_their_pending_agent_application(self):
        # Test user can cancel any pending agent_application that they have.
        token = self.login_user_and_get_token(self.new_user)

        agent_application = self.create_agent_application(
            self.new_user, self.agent_application_data)

        agent_applcation_cancel_url = reverse(
            'agent-application-cancel',
            kwargs={'username': self.new_user.username, 'pk': agent_application.pk})

        res = self.client.patch(
            agent_applcation_cancel_url,
            {'status': AGENT_APP_STATUS.CANCELLED},
            headers=self.create_auth_header(token)
        )

        agent_application.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(agent_application.status,
                         AGENT_APP_STATUS.CANCELLED)

    def test_user_cannot_approve_or_reject_their_pending_application(self):
        # Test user should not be able to approve or reject their own agent_application.
        token = self.login_user_and_get_token(self.new_user)

        agent_application = self.create_agent_application(
            self.new_user, self.agent_application_data)

        agent_applcation_cancel_url = reverse(
            'agent-application-cancel',
            kwargs={'username': self.new_user.username, 'pk': agent_application.pk})

        # Test for approving.
        res = self.client.patch(
            agent_applcation_cancel_url,
            {'status': AGENT_APP_STATUS.APPROVED},
            headers=self.create_auth_header(token)
        )

        agent_application.refresh_from_db()
        self.assertEqual(res.status_code, 400)
        self.assertNotEqual(agent_application.status,
                            AGENT_APP_STATUS.APPROVED)

        # Test for rejecting.
        res = self.client.patch(
            agent_applcation_cancel_url,
            {'status': AGENT_APP_STATUS.REJECTED},
            headers=self.create_auth_header(token)
        )

        agent_application.refresh_from_db()
        self.assertEqual(res.status_code, 400)
        self.assertNotEqual(agent_application.status,
                            AGENT_APP_STATUS.REJECTED)

    def test_user_can_only_edit_agent_application_with_pending_status(self):
        # Test users should not be able to edit agent_application with
        # APPROVED, REJECTED, or CANCELLED status
        token = self.login_user_and_get_token(self.test_user)

        res = self.client.patch(
            self.agent_application_cancel_url,
            {'status': AGENT_APP_STATUS.CANCELLED},
            headers=self.create_auth_header(token)
        )

        self.test_agent_application.refresh_from_db()
        self.assertEqual(res.status_code, 404)
        self.assertEqual(self.test_agent_application.status,
                         AGENT_APP_STATUS.APPROVED)

    def test_user_can_create_agent_application(self):
        # Test authorized user should be able to create an agent_application.
        token = self.login_user_and_get_token(self.new_user)
        agent_application_create_url = reverse(
            'agent-application-list-create',
            kwargs={'username': self.new_user.username}
        )
        res = self.client.post(
            agent_application_create_url,
            self.agent_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 201)

    def test_user_with_unverified_email_cannot_create_agent_application(self):
        # Test user with an unverified email should not be able to create an agent_application.
        self.register_user(self.unregistered_user_data)
        token = self.login_and_get_token(self.unregistered_user_login_data)
        agent_application_create_url = reverse(
            'agent-application-list-create', kwargs={'username': self.unregistered_user_data['username']}
        )
        res = self.client.post(
            agent_application_create_url,
            self.agent_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 401)

    def test_user_cannot_create_agent_application_with_invalid_data(self):
        # Test user should not able to create an agent_application when they submit an invalida data.
        token = self.login_user_and_get_token(self.new_user)
        agent_application_create_url = reverse(
            'agent-application-list-create',
            kwargs={'username': self.new_user.username}
        )

        invalid_data_1 = {}  # Test no data.
        invalid_data_2 = {'agent_name': 'Business 3'}  # Test lacking data.
        invalid_data_3 = {'agent_name': 'Business 3',
                          'license_num': 'wrong_key',  # Test wrong key.
                          'license_document_path': self.generate_test_image()}

        res1 = self.client.post(
            agent_application_create_url,
            invalid_data_1,
            headers=self.create_auth_header(token)
        )
        res2 = self.client.post(
            agent_application_create_url,
            invalid_data_2,
            headers=self.create_auth_header(token)
        )
        res3 = self.client.post(
            agent_application_create_url,
            invalid_data_3,
            headers=self.create_auth_header(token)
        )

        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)

    def test_user_with_active_agent_account_cannot_create_agent_application(self):
        # Test user that is already active should not be able to create an agent_application.
        token = self.login_user_and_get_token(self.test_user)
        res = self.client.post(
            self.agent_application_list_create_url,
            self.agent_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 400)

    def test_unauthorized_user_cannot_create_agent_application(self):
        # Test unauthorized user should not be able to create an agent_application.
        token = 'invalid_token'
        res = self.client.post(
            self.agent_application_list_create_url,
            self.agent_application_data,
            headers=self.create_auth_header(token)
        )
        self.assertEqual(res.status_code, 401)

    def test_user_can_get_agent_list(self):
        # Test user should be able to get list of agents.
        res = self.client.get(self.agent_account_list_url)
        self.assertEqual(res.status_code, 200)

    def test_user_can_get_agent_details(self):
        # Test user should be able to retrieve agent_account details.
        res = self.client.get(self.agent_account_retrieve_update_url)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_get_agent_details_with_invalid_data(self):
        # Test user should get 404 when username doesn't exist.
        agent_account_retrieve_url = reverse(
            'agent-account-retrieve-update',
            kwargs={'username': 'wrong_username'}
        )
        res = self.client.get(agent_account_retrieve_url)
        self.assertEqual(res.status_code, 404)

    def test_owner_of_agent_account_can_edit_details(self):
        # Test user should be able to edit the ff agent_account details:
        # ['agent_name', 'profile_image_path', 'bio']
        token = self.login_user_and_get_token(self.test_user)

        res = self.client.patch(
            self.agent_account_retrieve_update_url,
            self.new_test_agent_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.test_user.agent_account.agent_name,
            self.new_test_agent_data['agent_name']
        )
        self.assertEqual(
            bool(self.test_user.agent_account.profile_image_path),
            False
        )
        self.assertEqual(
            self.test_user.agent_account.bio,
            self.new_test_agent_data['bio']
        )

    def test_user_cannot_edit_agent_account_data_that_requires_persmission(self):
        # Test user should not be able to edit the ff data of AgentAccount
        # ['user', 'license_number', 'is_active', 'date_approved']
        token = self.login_user_and_get_token(self.test_user)

        data = {
            'agent_name': 'New Name',
            'is_active': False,
            'date_approved': datetime.date(2023, 12, 1)
        }

        res = self.client.patch(
            self.agent_account_retrieve_update_url,
            data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.test_user.agent_account.agent_name,
            data['agent_name']
        )
        self.assertNotEqual(
            self.test_user.agent_account.is_active,
            data['is_active']
        )
        self.assertNotEqual(
            self.test_user.agent_account.date_approved.date(),
            data['date_approved']
        )

    def test_not_owner_of_agent_account_cannot_edit_details(self):
        # Test authorized user should not be able to edit the agent_account details of other users.
        # In this test, new_user is trying to change test_user's data.
        token = self.login_user_and_get_token(self.new_user)

        res = self.client.patch(
            self.agent_account_retrieve_update_url,
            self.new_test_agent_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 403)
        self.assertNotEqual(
            self.test_user.agent_account.agent_name,
            self.new_test_agent_data['agent_name']
        )
        self.assertNotEqual(
            self.test_user.agent_account.profile_image_path,
            self.new_test_agent_data['profile_image_path']
        )
        self.assertNotEqual(
            self.test_user.agent_account.bio,
            self.new_test_agent_data['bio']
        )

    def test_unauthorized_user_cannot_edit_agent_account_details(self):
        # Test unauthorized user should not be able to edit agent_account details
        token = 'invalid_token'

        res = self.client.patch(
            self.agent_account_retrieve_update_url,
            self.new_test_agent_data,
            headers=self.create_auth_header(token)
        )

        self.test_user.refresh_from_db()
        self.assertEqual(res.status_code, 401)
        self.assertNotEqual(
            self.test_user.agent_account.agent_name,
            self.new_test_agent_data['agent_name']
        )
        self.assertNotEqual(
            self.test_user.agent_account.profile_image_path,
            self.new_test_agent_data['profile_image_path']
        )
        self.assertNotEqual(
            self.test_user.agent_account.bio,
            self.new_test_agent_data['bio']
        )
