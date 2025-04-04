from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from listings.models import Listing

from agents.models import AgentAccount

from sellers.models import SellerAccount

from buyers.models import BuyerAccount

from users.models import User


class PAYMENT_METHOD:
    BANK_TRANSFER = 'BT'
    BANK_LOAN = 'BL'
    INSTALLMENT = 'I'
    CASH_PAYMENT = 'CP'
    CHECK_PAYMENT = 'CHP'

    CHOICES = [
        (BANK_TRANSFER, 'Bank Transfer'),
        (BANK_LOAN, 'Bank Loan'),
        (INSTALLMENT, 'Installment'),
        (CASH_PAYMENT, 'Cash Payment'),
        (CHECK_PAYMENT, 'Check Payment')
    ]


class USER_ROLE_IN_OFFER:
    BUYER = 'buyer'
    SELLER = 'seller'
    AGENT = 'agent'

    ROLES = (BUYER, SELLER, AGENT)


class OFFER_RESPONSE:
    PENDING = 'P'
    ACCEPT = 'A'
    REJECT = 'R'
    CANCEL = 'C'

    CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPT, 'Accept'),
        (REJECT, 'Reject'),
        (CANCEL, 'Cancel')
    ]


class OFFER_STATUS:
    WAITING = 'W'
    APPROVED = 'A'
    REJECTED = 'R'
    CANCELLED = 'C'

    CHOICES = [
        (WAITING, 'Waiting for approval'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
        (CANCELLED, 'Cancelled')
    ]


class Offer(models.Model):
    created_by_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    created_by_id = models.PositiveIntegerField()
    created_by = GenericForeignKey('created_by_type', 'created_by_id')

    listing = models.ForeignKey(Listing,
                                related_name='offers',
                                on_delete=models.CASCADE)

    agent_account = models.ForeignKey(AgentAccount,
                                      related_name='offers',
                                      on_delete=models.CASCADE,
                                      blank=True,
                                      null=True)

    seller_account = models.ForeignKey(SellerAccount,
                                       related_name='offers',
                                       on_delete=models.CASCADE)

    buyer_account = models.ForeignKey(BuyerAccount,
                                      related_name='offers',
                                      on_delete=models.CASCADE)

    price = models.PositiveIntegerField()

    payment_method = models.CharField(max_length=50,
                                      choices=PAYMENT_METHOD.CHOICES,
                                      default=PAYMENT_METHOD.BANK_TRANSFER)

    status = models.CharField(max_length=50,
                              choices=OFFER_STATUS.CHOICES,
                              default=OFFER_STATUS.WAITING)

    date_created = models.DateTimeField(auto_now_add=True)

    buyer_offer_response = models.CharField(max_length=50,
                                            choices=OFFER_RESPONSE.CHOICES,
                                            default=OFFER_RESPONSE.PENDING)

    seller_offer_response = models.CharField(max_length=50,
                                             choices=OFFER_RESPONSE.CHOICES,
                                             default=OFFER_RESPONSE.PENDING)

    agent_offer_response = models.CharField(max_length=50,
                                            choices=OFFER_RESPONSE.CHOICES,
                                            default=OFFER_RESPONSE.PENDING,
                                            blank=True,
                                            null=True)

    def is_fully_approved(self):
        if self.agent_account is not None:
            return (self.buyer_offer_response == OFFER_RESPONSE.ACCEPT and
                    self.seller_offer_response == OFFER_RESPONSE.ACCEPT and
                    self.agent_offer_response == OFFER_RESPONSE.ACCEPT)
        else:
            return (self.buyer_offer_response == OFFER_RESPONSE.ACCEPT and
                    self.seller_offer_response == OFFER_RESPONSE.ACCEPT)

    def is_user_who_created_this_offer(self, user):
        if not isinstance(user, User):
            raise TypeError(f"'{user}' is not of type User.")

        offer_creator = self.created_by_type.model_class().objects.get(pk=self.created_by_id)

        return offer_creator.user == user

    def get_user_role_in_offer(self, user):
        if not isinstance(user, User):
            raise TypeError(f"'{user}' is not of type User.")

        if user.seller_account == self.seller_account:
            return USER_ROLE_IN_OFFER.SELLER
        if user.buyer_account == self.buyer_account:
            return USER_ROLE_IN_OFFER.BUYER
        if user.agent_account == self.agent_account:
            return USER_ROLE_IN_OFFER.AGENT
        return None

    def get_allowed_offer_response_of_this_user(self, user):
        """
        Gets the user's allowed response for an Offer.
        If user is the one who created the offer, the user is allowed to CANCEL the Offer.
        If user is the 'buyer', 'seller', or 'agent' of the offer, the user is allowed to ACCEPT or REJECT the Offer.
        If user is not one of the above, the user will not have an allowed Response.
        """
        if self.is_user_who_created_this_offer(user):
            return (OFFER_RESPONSE.CANCEL,)
        elif self.get_user_role_in_offer(user):
            return (OFFER_RESPONSE.ACCEPT, OFFER_RESPONSE.REJECT)
        else:
            return ()

    def is_allowed_offer_response(self, user, offer_response):
        OFFER_RESPONSE_KEYS = dict(OFFER_RESPONSE.CHOICES).keys()
        OFFER_RESPONSE_LIST_STR = ', '.join(
            f"{key}" for key in OFFER_RESPONSE_KEYS)

        if offer_response not in OFFER_RESPONSE_KEYS:
            raise ValueError(
                f"Invalid offer_response value '{offer_response}'. Expected one of the ff: {OFFER_RESPONSE_LIST_STR}.")

        return offer_response in self.get_allowed_offer_response_of_this_user(user)
