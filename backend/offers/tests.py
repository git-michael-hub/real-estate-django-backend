from django.db.models import Q
from django.urls import reverse

from listings.models import Listing
from listings.tests import TestListingsSetUp

from buyers.models import BuyerAccount

from sellers.models import SellerAccount

from agents.models import AgentAccount

from users.models import User

from .models import Offer, PAYMENT_METHOD, OFFER_RESPONSE, OFFER_STATUS


class TestOffersSetUp(TestListingsSetUp):

    def setUp(self):
        super().setUp()

        self.buyer = BuyerAccount.objects.get(pk=13)
        self.seller = SellerAccount.objects.get(pk=10)
        self.agent = AgentAccount.objects.get(pk=11)

        self.buyer_offer = Offer.objects.filter(buyer_account=self.buyer.pk,
                                                created_by_id=self.buyer.pk).first()

        self.seller_offer = Offer.objects.filter(seller_account=self.seller.pk,
                                                 created_by_id=self.seller.pk).first()

        self.agent_offer = Offer.objects.filter(agent_account=self.agent.pk,
                                                created_by_id=self.agent.pk).first()

        self.listing = Listing.objects.filter(
            agent_account=self.agent, property__seller_account=self.seller).first()
        self.listing2 = Listing.objects.exclude(
            Q(agent_account=self.agent) | Q(property__seller_account=self.seller)).first()

        self.offer_data = {'listing': self.listing.pk,
                           'price': self.listing.price,
                           'payment_method': PAYMENT_METHOD.INSTALLMENT,
                           'buyer_account': self.buyer.pk}

        self.buyer_offer_list_create_url = reverse(
            'buyer-offer-list-create', kwargs={'username': self.buyer.user.username}
        )

        self.seller_offer_list_create_url = reverse(
            'seller-offer-list-create', kwargs={'username': self.seller.user.username}
        )

        self.agent_offer_list_create_url = reverse(
            'agent-offer-list-create', kwargs={'username': self.agent.user.username}
        )

        self.buyer_offer_retrieve_update_url = reverse(
            'buyer-offer-retrieve-update', kwargs={'username': self.buyer.user.username, 'pk': self.buyer_offer.pk}
        )

        self.seller_offer_retrieve_update_url = reverse(
            'seller-offer-retrieve-update', kwargs={'username': self.seller.user.username, 'pk': self.seller_offer.pk}
        )

        self.agent_offer_retrieve_update_url = reverse(
            'agent-offer-retrieve-update', kwargs={'username': self.agent.user.username, 'pk': self.agent_offer.pk}
        )

        self.ACCOUNT_TYPE_MAPS = (
            {
                'account': self.buyer,
                'offer': self.buyer_offer,
                'offer-list-create': self.buyer_offer_list_create_url,
                'offer-retrieve-update': self.buyer_offer_retrieve_update_url,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'offer': self.seller_offer,
                'offer-list-create': self.seller_offer_list_create_url,
                'offer-retrieve-update': self.seller_offer_retrieve_update_url,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'offer': self.agent_offer,
                'offer-list-create': self.agent_offer_list_create_url,
                'offer-retrieve-update': self.agent_offer_retrieve_update_url,
                'offer-response': 'agent_offer_response'
            }
        )

        self.INVALID_TOKEN = 'INVALID_TOKEN'

    def create_offer_retrieve_update_url(self, account_type, username, offer_pk):
        account_types = {'buyer': 'buyer-offer-retrieve-update',
                         'seller': 'seller-offer-retrieve-update',
                         'agent': 'agent-offer-retrieve-update'}

        if account_type not in account_types:
            raise KeyError(
                f"Expected account_type to be 'buyer', 'seller', or 'agent'. Got {account_type} instead.")

        url = reverse(account_types[account_type],
                      kwargs={'username': username, 'pk': offer_pk})
        return url

    def fully_approve_offer(self, offer):
        ACCOUNT_TYPE_MAPS = (
            {'account-type': 'buyer', 'offer-response': 'buyer_offer_response'},
            {'account-type': 'seller', 'offer-response': 'seller_offer_response'},
            {'account-type': 'agent', 'offer-response': 'agent_offer_response'},
        )

        for account_type_map in ACCOUNT_TYPE_MAPS:
            account_attr_name = f"{account_type_map['account-type']}_account"
            offer_response_attr_name = f"{account_type_map['offer-response']}"

            account = getattr(offer, account_attr_name, None)
            offer_response = getattr(offer, offer_response_attr_name, None)

            if offer_response not in (OFFER_RESPONSE.ACCEPT, None):
                token = self.login_user_and_get_token(account.user)
                data = {account_type_map['offer-response']: OFFER_RESPONSE.ACCEPT}
                self.client.patch(self.create_offer_retrieve_update_url(account_type_map['account-type'],
                                                                        account.user.username,
                                                                        offer.pk),
                                  data=data,
                                  headers=self.create_auth_header(token))

    def tearDown(self):
        return super().tearDown()


class TestOffers(TestOffersSetUp):

    fixtures = ['users.json',
                'agents.json',
                'sellers.json',
                'buyers.json',
                'property_agent_assignments.json',
                'properties.json',
                'listings.json',
                'offers.json']

    def test_users_can_create_offer(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.post(account_type['offer-list-create'],
                                   data=self.offer_data,
                                   headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 201)

    def test_users_cannot_create_offer_with_invalid_data(self):
        self.offer_data['listing'] = 999
        for account_type in self.ACCOUNT_TYPE_MAPS:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.post(account_type['offer-list-create'],
                                   data=self.offer_data,
                                   headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 400)

    def test_agents_and_sellers_cannot_create_offer_with_listings_theyre_not_part_of(self):
        self.offer_data['listing'] = self.listing2.pk
        for account_type in self.ACCOUNT_TYPE_MAPS[1:]:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.post(account_type['offer-list-create'],
                                   data=self.offer_data,
                                   headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 403)

    def test_unauthenticated_users_cannot_create_offer(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            res = self.client.post(account_type['offer-list-create'],
                                   data=self.offer_data,
                                   headers=self.create_auth_header(self.INVALID_TOKEN))
            self.assertEqual(res.status_code, 401)

    def test_users_can_get_offers(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.get(account_type['offer-list-create'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 200)

    def test_users_cannot_get_offers_theyre_not_part_of(self):
        user = User.objects.exclude(Q(buyer_account=self.buyer) |
                                    Q(seller_account=self.seller) |
                                    Q(agent_account=self.agent)).first()
        token = self.login_user_and_get_token(user)
        for account_type in self.ACCOUNT_TYPE_MAPS:
            res = self.client.get(account_type['offer-list-create'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 403)

    def test_unauthenticated_users_cannot_get_offers(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            res = self.client.get(account_type['offer-list-create'],
                                  headers=self.create_auth_header(self.INVALID_TOKEN))
            self.assertEqual(res.status_code, 401)

    def test_users_can_retrieve_offer(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.get(account_type['offer-retrieve-update'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 200)

    def test_users_cannot_retrieve_offer_theyre_not_a_part_of(self):
        offer = Offer.objects.exclude(Q(buyer_account=self.buyer) |
                                      Q(seller_account=self.seller) |
                                      Q(agent_account=self.agent)).first()
        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer.pk)
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer.pk)
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer.pk)
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.get(account_type['url'],
                                  headers=self.create_auth_header(token))
            self.assertEqual(res.status_code, 404)

    def test_unauthenticated_users_cannot_retrieve_offer(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            res = self.client.get(account_type['offer-retrieve-update'],
                                  headers=self.create_auth_header(self.INVALID_TOKEN))
            self.assertEqual(res.status_code, 401)

    def test_users_can_cancel_offer_they_created(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            data = {account_type['offer-response']: OFFER_RESPONSE.CANCEL}
            token = self.login_user_and_get_token(account_type['account'].user)
            self.client.patch(account_type['offer-retrieve-update'],
                              data=data,
                              headers=self.create_auth_header(token))

            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertEqual(account_type['offer'].status,
                             OFFER_STATUS.CANCELLED)
            self.assertEqual(offer_response,
                             OFFER_RESPONSE.CANCEL)

    def test_unauthenticated_users_cannot_cancel_offer(self):
        for account_type in self.ACCOUNT_TYPE_MAPS:
            data = {account_type['offer-response']: OFFER_RESPONSE.CANCEL}
            res = self.client.patch(account_type['offer-retrieve-update'],
                                    data=data,
                                    headers=self.create_auth_header(self.INVALID_TOKEN))
            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertEqual(res.status_code, 401)
            self.assertNotEqual(account_type['offer'].status,
                                OFFER_STATUS.CANCELLED)
            self.assertNotEqual(offer_response,
                                OFFER_RESPONSE.CANCEL)

    def test_users_cannot_cancel_offer_they_didnt_create(self):
        offer1 = Offer.objects.filter(~Q(created_by_id=self.buyer.pk) &
                                      Q(buyer_account=self.buyer.pk) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(~Q(created_by_id=self.seller.pk) &
                                      Q(seller_account=self.seller.pk) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer3 = Offer.objects.filter(~Q(created_by_id=self.agent.pk) &
                                      Q(agent_account=self.agent.pk) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                'offer': offer1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                'offer': offer2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer3.pk),
                'offer': offer3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            data = {account_type['offer-response']: OFFER_RESPONSE.CANCEL}
            token = self.login_user_and_get_token(account_type['account'].user)
            self.client.patch(account_type['url'],
                              data=data,
                              headers=self.create_auth_header(token))

            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertNotEqual(account_type['offer'].status,
                                OFFER_STATUS.CANCELLED)
            self.assertNotEqual(offer_response,
                                OFFER_RESPONSE.CANCEL)

    def test_users_cannot_cancel_offer_theyre_not_part_of(self):
        offer1 = Offer.objects.filter(~Q(buyer_account=self.buyer.pk) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(~Q(seller_account=self.seller.pk) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer3 = Offer.objects.filter(~Q(agent_account=self.agent.pk) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                'offer': offer1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                'offer': offer2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer3.pk),
                'offer': offer3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            data = {account_type['offer-response']: OFFER_RESPONSE.CANCEL}
            token = self.login_user_and_get_token(account_type['account'].user)
            self.client.patch(account_type['url'],
                              data=data,
                              headers=self.create_auth_header(token))

            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertNotEqual(account_type['offer'].status,
                                OFFER_STATUS.CANCELLED)
            self.assertNotEqual(offer_response,
                                OFFER_RESPONSE.CANCEL)

    def test_users_can_accept_offer(self):
        offer1 = Offer.objects.filter(Q(buyer_account=self.buyer) &
                                      ~Q(created_by_id=self.buyer.pk) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(Q(created_by_id=self.buyer.pk) &
                                      Q(buyer_account=self.buyer) &
                                      ~Q(created_by_id=self.seller.pk) &
                                      ~Q(created_by_id=self.agent.pk) &
                                      Q(seller_account=self.seller) &
                                      Q(agent_account=self.agent) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        data = {'buyer_offer_response': OFFER_RESPONSE.ACCEPT}
        token = self.login_user_and_get_token(self.buyer.user)
        res1 = self.client.patch(self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                                 data=data,
                                 headers=self.create_auth_header(token))

        data = {'seller_offer_response': OFFER_RESPONSE.ACCEPT}
        token = self.login_user_and_get_token(self.seller.user)
        res2 = self.client.patch(self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                                 data=data,
                                 headers=self.create_auth_header(token))

        data = {'agent_offer_response': OFFER_RESPONSE.ACCEPT}
        token = self.login_user_and_get_token(self.agent.user)
        res3 = self.client.patch(self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer2.pk),
                                 data=data,
                                 headers=self.create_auth_header(token))

        offer1.refresh_from_db()
        offer2.refresh_from_db()
        self.assertEqual(res1.status_code, 200)
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(res3.status_code, 200)
        self.assertEqual(offer1.buyer_offer_response,
                         OFFER_RESPONSE.ACCEPT)
        self.assertEqual(offer2.seller_offer_response,
                         OFFER_RESPONSE.ACCEPT)
        self.assertEqual(offer2.agent_offer_response,
                         OFFER_RESPONSE.ACCEPT)
        self.assertEqual(offer2.status,
                         OFFER_STATUS.APPROVED)

    def test_users_cannot_accept_offer_theyre_not_part_of(self):
        offer1 = Offer.objects.filter(~Q(buyer_account=self.buyer.pk) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(~Q(seller_account=self.seller.pk) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer3 = Offer.objects.filter(~Q(agent_account=self.agent.pk) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                'offer': offer1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                'offer': offer2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer3.pk),
                'offer': offer3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            data = {account_type['offer-response']: OFFER_RESPONSE.ACCEPT}
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.patch(account_type['url'],
                                    data=data,
                                    headers=self.create_auth_header(token))

            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertEqual(res.status_code, 404)
            self.assertNotEqual(offer_response,
                                OFFER_RESPONSE.ACCEPT)

    def test_users_can_reject_offer(self):
        filter1 = (~Q(created_by_id=self.buyer.pk) &
                   Q(buyer_account=self.buyer) &
                   Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                   Q(status=OFFER_STATUS.WAITING))

        filter2 = (~Q(created_by_id=self.seller.pk) &
                   Q(seller_account=self.seller) &
                   Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                   Q(status=OFFER_STATUS.WAITING))

        filter3 = (~Q(created_by_id=self.agent.pk) &
                   Q(agent_account=self.agent) &
                   Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                   Q(status=OFFER_STATUS.WAITING))

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'str_type': 'buyer',
                'filter': filter1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'str_type': 'seller',
                'filter': filter2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'str_type': 'agent',
                'filter': filter3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            data = {account_type['offer-response']: OFFER_RESPONSE.REJECT}
            token = self.login_user_and_get_token(account_type['account'].user)
            offer = Offer.objects.filter(account_type['filter']).first()
            res = self.client.patch(self.create_offer_retrieve_update_url(account_type['str_type'],
                                                                          account_type['account'].user.username,
                                                                          offer.pk),
                                    data=data,
                                    headers=self.create_auth_header(token))
            offer.refresh_from_db()
            offer_response = getattr(offer, account_type['offer-response'])
            self.assertEqual(res.status_code, 200)
            self.assertEqual(offer_response, OFFER_RESPONSE.REJECT)
            self.assertEqual(offer.status,
                             OFFER_STATUS.REJECTED)

    def test_users_cannot_reject_offers_theyre_not_part_of(self):
        offer1 = Offer.objects.filter(~Q(buyer_account=self.buyer.pk) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(~Q(seller_account=self.seller.pk) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer3 = Offer.objects.filter(~Q(agent_account=self.agent.pk) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                'offer': offer1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                'offer': offer2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer3.pk),
                'offer': offer3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            data = {account_type['offer-response']: OFFER_RESPONSE.REJECT}
            token = self.login_user_and_get_token(account_type['account'].user)
            res = self.client.patch(account_type['url'],
                                    data=data,
                                    headers=self.create_auth_header(token))

            account_type['offer'].refresh_from_db()
            offer_response = getattr(account_type['offer'],
                                     account_type['offer-response'])
            self.assertEqual(res.status_code, 404)
            self.assertNotEqual(offer_response,
                                OFFER_RESPONSE.REJECT)
            self.assertNotEqual(account_type['offer'].status,
                                OFFER_STATUS.REJECTED)

    def test_unauthenticated_users_cannot_accept_or_reject_offer(self):
        offer1 = Offer.objects.filter(~Q(created_by_id=self.buyer.pk) &
                                      Q(buyer_account=self.buyer) &
                                      Q(buyer_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer2 = Offer.objects.filter(~Q(created_by_id=self.seller.pk) &
                                      Q(seller_account=self.seller) &
                                      Q(seller_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        offer3 = Offer.objects.filter(~Q(created_by_id=self.agent.pk) &
                                      Q(agent_account=self.agent) &
                                      Q(agent_offer_response=OFFER_RESPONSE.PENDING) &
                                      Q(status=OFFER_STATUS.WAITING)).first()

        ACCOUNT_URL_MAP = (
            {
                'account': self.buyer,
                'url': self.create_offer_retrieve_update_url('buyer', self.buyer.user.username, offer1.pk),
                'offer': offer1,
                'offer-response': 'buyer_offer_response'
            },
            {
                'account': self.seller,
                'url': self.create_offer_retrieve_update_url('seller', self.seller.user.username, offer2.pk),
                'offer': offer2,
                'offer-response': 'seller_offer_response'
            },
            {
                'account': self.agent,
                'url': self.create_offer_retrieve_update_url('agent', self.agent.user.username, offer3.pk),
                'offer': offer3,
                'offer-response': 'agent_offer_response'
            }
        )

        for account_type in ACCOUNT_URL_MAP:
            for data in [{account_type['offer-response']: OFFER_RESPONSE.ACCEPT},
                         {account_type['offer-response']: OFFER_RESPONSE.REJECT}]:
                self.client.patch(account_type['url'],
                                  data=data,
                                  headers=self.create_auth_header(self.INVALID_TOKEN))

                account_type['offer'].refresh_from_db()
                offer_response = getattr(account_type['offer'],
                                         account_type['offer-response'])
                self.assertNotEqual(offer_response,
                                    data[account_type['offer-response']])
                if data[account_type['offer-response']] == OFFER_RESPONSE.REJECT:
                    self.assertNotEqual(account_type['offer'].status,
                                        OFFER_STATUS.REJECTED)
