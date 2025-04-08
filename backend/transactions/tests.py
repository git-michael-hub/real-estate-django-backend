from django.db.models import Q
from django.urls import reverse

from offers.models import Offer
from offers.tests import TestOffersSetUp

from .models import TRANSACTION_STATUS


class TestTransactionsSetUp(TestOffersSetUp):

    def setUp(self):
        super().setUp()

        self.wrong_buyer_offer = Offer.objects.filter(~Q(buyer_account__user=self.buyer.user) &
                                                      ~Q(seller_account__user=self.buyer.user) &
                                                      ~Q(agent_account__user=self.buyer.user)).first()

        self.wrong_seller_offer = Offer.objects.filter(~Q(buyer_account__user=self.seller.user) &
                                                       ~Q(seller_account__user=self.seller.user) &
                                                       ~Q(agent_account__user=self.seller.user)).first()

        self.wrong_agent_offer = Offer.objects.filter(~Q(buyer_account__user=self.agent.user) &
                                                      ~Q(seller_account__user=self.agent.user) &
                                                      ~Q(agent_account__user=self.agent.user)).first()

        for offer in (self.buyer_offer, self.seller_offer, self.agent_offer,
                      self.wrong_buyer_offer, self.wrong_seller_offer, self.wrong_agent_offer):
            self.fully_approve_offer(offer)

        # Note to self: This kind of approach is slow since it will generate the TEST_DATA_MAPS,
        # WHICH INCLUDES DATA THAT MAY NOT BE NEEDED IN A TEST, everytime it runs a single unit of test.
        # However it makes the code more modular, easier to reuse, and easier to read.
        self.TEST_DATA_MAPS = [
            {
                'account': self.buyer,
                'type': 'buyer',
                'transaction': self.buyer_offer.transaction,
                'wrong-transaction': self.wrong_buyer_offer.transaction,
                'list-url': reverse('buyer-transaction-list', kwargs={'username': self.buyer.user.username}),
                'wrong-list-url': reverse('buyer-transaction-list', kwargs={'username': self.seller.user.username}),
                'retrieve-update-url': reverse('buyer-transaction-retrieve-update',
                                               kwargs={'username': self.buyer.user.username,
                                                       'pk': self.buyer_offer.transaction.pk}),
                'wrong-retrieve-update-url': reverse('buyer-transaction-retrieve-update',
                                                     kwargs={'username': self.buyer.user.username,
                                                             'pk': self.wrong_buyer_offer.transaction.pk})
            },
            {
                'account': self.seller,
                'type': 'seller',
                'transaction': self.seller_offer.transaction,
                'wrong-transaction': self.wrong_seller_offer.transaction,
                'list-url': reverse('seller-transaction-list', kwargs={'username': self.seller.user.username}),
                'wrong-list-url': reverse('seller-transaction-list', kwargs={'username': self.agent.user.username}),
                'retrieve-update-url': reverse('seller-transaction-retrieve-update',
                                               kwargs={'username': self.seller.user.username,
                                                       'pk': self.seller_offer.transaction.pk}),
                'wrong-retrieve-update-url': reverse('seller-transaction-retrieve-update',
                                                     kwargs={'username': self.seller.user.username,
                                                             'pk': self.wrong_seller_offer.transaction.pk})
            },
            {
                'account': self.agent,
                'type': 'agent',
                'transaction': self.agent_offer.transaction,
                'wrong-transaction': self.wrong_agent_offer.transaction,
                'list-url': reverse('agent-transaction-list', kwargs={'username': self.agent.user.username}),
                'wrong-list-url': reverse('agent-transaction-list', kwargs={'username': self.buyer.user.username}),
                'retrieve-update-url': reverse('agent-transaction-retrieve-update',
                                               kwargs={'username': self.agent.user.username,
                                                       'pk': self.agent_offer.transaction.pk}),
                'wrong-retrieve-update-url': reverse('agent-transaction-retrieve-update',
                                                     kwargs={'username': self.agent.user.username,
                                                             'pk': self.wrong_agent_offer.transaction.pk})

            },
        ]

    def tearDown(self):
        return super().tearDown()


class TestTransactions(TestTransactionsSetUp):

    fixtures = ['users.json',
                'agents.json',
                'sellers.json',
                'buyers.json',
                'property_agent_assignments.json',
                'properties.json',
                'listings.json',
                'offers.json']

    def test_users_can_get_transactions(self):
        for test_data in self.TEST_DATA_MAPS:
            token = self.login_user_and_get_token(test_data['account'].user)
            res = self.client.get(test_data['list-url'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 200)

    def test_users_cannot_get_transactions_theyre_not_part_of(self):
        for test_data in self.TEST_DATA_MAPS:
            token = self.login_user_and_get_token(test_data['account'].user)
            res = self.client.get(test_data['wrong-list-url'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 403)

    def test_unauthenticated_users_cannot_get_transactions(self):
        for test_data in self.TEST_DATA_MAPS:
            res = self.client.get(test_data['list-url'],
                                  headers=self.create_auth_header(self.INVALID_TOKEN))
            self.assertEqual(res.status_code, 401)

    def test_users_can_retrieve_transaction(self):
        for test_data in self.TEST_DATA_MAPS:
            token = self.login_user_and_get_token(test_data['account'].user)
            res = self.client.get(test_data['retrieve-update-url'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 200)

    def test_users_cannot_retreive_transaction_theyre_not_part_of(self):
        for test_data in self.TEST_DATA_MAPS:
            token = self.login_user_and_get_token(test_data['account'].user)
            res = self.client.get(test_data['wrong-retrieve-update-url'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 404)

    def test_unauthenticated_users_cannot_retrieve_transaction(self):
        for test_data in self.TEST_DATA_MAPS:
            res = self.client.get(test_data['retrieve-update-url'],
                                  headers=self.create_auth_header(self.INVALID_TOKEN))
            self.assertEqual(res.status_code, 401)

    def test_users_can_cancel_transaction(self):
        for test_data in self.TEST_DATA_MAPS:
            transaction = test_data['transaction']
            token = self.login_user_and_get_token(test_data['account'].user)
            res = self.client.patch(test_data['retrieve-update-url'],
                                    data={'status': TRANSACTION_STATUS.CANCELLED},
                                    headers=self.create_auth_header(token))
            transaction.refresh_from_db()
            self.assertEqual(res.status_code, 200)
            self.assertEqual(transaction.status, TRANSACTION_STATUS.CANCELLED)

    def test_buyers_and_agents_cannot_cancel_transaction_if_status_is_not_pending(self):
        test_transaction_status = TRANSACTION_STATUS.get_keys()
        test_transaction_status.pop(0)
        self.TEST_DATA_MAPS.pop(1)

        for transaction_status in test_transaction_status:
            for test_data in self.TEST_DATA_MAPS:
                transaction = test_data['transaction']
                transaction.status = transaction_status
                transaction.save(update_fields=['status'])
                token = self.login_user_and_get_token(
                    test_data['account'].user)
                res = self.client.patch(test_data['retrieve-update-url'],
                                        data={
                                            'status': TRANSACTION_STATUS.CANCELLED},
                                        headers=self.create_auth_header(token))
                self.assertEqual(res.status_code, 400)

    def test_buyers_and_agents_cannot_set_transaction_status_to_pending_inprocess_completed(self):
        transaction_status_list = TRANSACTION_STATUS.get_keys()
        transaction_status_list.pop(3)
        self.TEST_DATA_MAPS.pop(1)

        for transaction_status in transaction_status_list:
            for test_data in self.TEST_DATA_MAPS:
                transaction = test_data['transaction']
                token = self.login_user_and_get_token(
                    test_data['account'].user)
                res = self.client.patch(test_data['retrieve-update-url'],
                                        data={'status': transaction_status},
                                        headers=self.create_auth_header(token))
                transaction.refresh_from_db()
                self.assertEqual(res.status_code, 400)

    def test_sellers_can_update_status_of_transaction(self):
        transaction_status_list = TRANSACTION_STATUS.get_keys()
        transaction_status_list.pop(0)
        seller_data = self.TEST_DATA_MAPS.pop(1)

        for transaction_status in transaction_status_list:
            transaction = seller_data['transaction']
            transaction.status = TRANSACTION_STATUS.PENDING
            transaction.save(update_fields=['status'])
            token = self.login_user_and_get_token(seller_data['account'].user)
            res = self.client.patch(seller_data['retrieve-update-url'],
                                    data={'status': transaction_status},
                                    headers=self.create_auth_header(token))
            transaction.refresh_from_db()
            self.assertEqual(res.status_code, 200)
            self.assertEqual(transaction.status, transaction_status)

    def test_sellers_cannot_update_status_of_a_completed_or_cancelled_transaction(self):
        transaction_status_list = TRANSACTION_STATUS.get_keys()
        seller_data = self.TEST_DATA_MAPS.pop(1)

        for cancelled_or_completed_status in transaction_status_list[2:0]:
            transaction = seller_data['transaction']
            transaction.status = cancelled_or_completed_status
            transaction.save(update_fields=['status'])
            token = self.login_user_and_get_token(seller_data['account'].user)
            for transaction_status in transaction_status_list:
                res = self.client.patch(seller_data['retrieve-update-url'],
                                        data={'status': transaction_status},
                                        headers=self.create_auth_header(token))
                self.assertEqual(res.status_code, 400)

    def test_users_cannot_update_status_of_transaction_theyre_not_part_of(self):
        for transaction_status in TRANSACTION_STATUS.get_keys():
            for test_data in self.TEST_DATA_MAPS:
                transaction = test_data['transaction']
                token = self.login_user_and_get_token(
                    test_data['account'].user)
                res = self.client.patch(test_data['wrong-retrieve-update-url'],
                                        data={'status': transaction_status},
                                        headers=self.create_auth_header(token))
                transaction.refresh_from_db()
                self.assertEqual(res.status_code, 404)
                self.assertEqual(transaction.status,
                                 TRANSACTION_STATUS.PENDING)

    def test_unauthenticated_users_cannot_update_status_of_transaction(self):
        for transaction_status in TRANSACTION_STATUS.get_keys():
            for test_data in self.TEST_DATA_MAPS:
                transaction = test_data['transaction']
                res = self.client.patch(test_data['retrieve-update-url'],
                                        data={'status': transaction_status},
                                        headers=self.create_auth_header(self.INVALID_TOKEN))
                transaction.refresh_from_db()
                self.assertEqual(res.status_code, 401)
                self.assertEqual(transaction.status,
                                 TRANSACTION_STATUS.PENDING)
