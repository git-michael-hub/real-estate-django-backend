from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import serializers, status
from rest_framework.response import Response

from buyers.models import BuyerAccount

from sellers.models import SellerAccount

from agents.models import AgentAccount

from listings.models import LISTING_STATUS

from .models import Offer, OFFER_RESPONSE, OFFER_STATUS


class OfferListCreateMixin:
    def get_serializer_class(self):
        from .serializers import OfferListSerializer, OfferCreateSerializer
        if self.request.method == 'POST':
            return OfferCreateSerializer
        return OfferListSerializer

    def insert_additional_data_by_model_class(self, model_class):
        VALID_CLS = (BuyerAccount, SellerAccount, AgentAccount)
        valid_cls_names = ', '.join(cls.__name__ for cls in VALID_CLS)

        if model_class not in VALID_CLS:
            raise TypeError(
                f"Invalid class '{model_class.__name__}' for model_class. Expected one of these: {valid_cls_names}.")

        instance = get_object_or_404(model_class, user=self.request.user)

        additional_data = {'created_by_type': ContentType.objects.get_for_model(model_class).pk,
                           'created_by_id': instance.pk}

        ACCEPT_FIELDS = {BuyerAccount: 'buyer_offer_response',
                         SellerAccount: 'seller_offer_response',
                         AgentAccount: 'agent_offer_response'}

        additional_data[ACCEPT_FIELDS[model_class]] = OFFER_RESPONSE.ACCEPT

        return additional_data

    def create(self, request, *args, **kwargs):
        model_class = kwargs.get('model_class')
        request_data = {
            **self.create_request_data_copy(request.data),
            **self.insert_additional_data_by_model_class(model_class=model_class)
        }
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def create_request_data_copy(self, request_data):
        request_data_copy = {}
        for key, value in dict(request_data).items():
            request_data_copy[key] = value[0]
        return request_data_copy


class OfferInsertFiltersMixin:
    def insert_filter_by_listing_id(self, filters=Q()):
        listing_id = self.kwargs.get('listing')
        if listing_id:
            try:
                filters &= Q(listing__pk=int(listing_id))
            except ValueError:
                return Q(pk=None)
        return filters


class OfferUpdateSerializerMixin:
    def check_attrs(self, attrs):
        REQUIRE_THESE_ATTRS = ('offer_response',)

        REQUIRE_AT_LEAST_ONE_OF_THESE_ATTRS = ('buyer_offer_response',
                                               'seller_offer_response',
                                               'agent_offer_response')

        attr_list_in_str_form = ', '.join(REQUIRE_AT_LEAST_ONE_OF_THESE_ATTRS)

        for item in REQUIRE_THESE_ATTRS:
            if item not in attrs:
                raise AttributeError(
                    f"'attrs' must contain Attribute '{item}'.")

        if not any(item in attrs for item in REQUIRE_AT_LEAST_ONE_OF_THESE_ATTRS):
            raise AttributeError(
                f"'attrs' must contain at least one of these: {attr_list_in_str_form}")

    def check_instance(self):
        if not isinstance(self.instance, Offer):
            raise TypeError(
                f"Mixin can only be used for updating '{Offer.__name__}' instances.")

    def validate(self, attrs):
        self.check_attrs(attrs)
        self.check_instance()

        user = self.context['request'].user
        offer_response = attrs.pop('offer_response')
        offer = self.instance

        if offer.status != OFFER_STATUS.WAITING:
            raise serializers.ValidationError(
                f"Cannot update Offer with status '{offer.status}'.")

        if not offer.is_allowed_offer_response(user, offer_response):
            raise serializers.ValidationError(
                f"User '{user}' is not allowed to make a '{offer_response}' response to this Offer.")

        if offer_response == OFFER_RESPONSE.CANCEL:
            attrs['status'] = OFFER_STATUS.CANCELLED
        if offer_response == OFFER_RESPONSE.REJECT:
            attrs['status'] = OFFER_STATUS.REJECTED

        return attrs

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        with transaction.atomic():
            instance.save()

            if instance.is_fully_approved():
                instance.status = OFFER_STATUS.APPROVED
                instance.save(update_fields=['status'])

                instance.listing.property.update_all_listing_status(
                    status=LISTING_STATUS.HOLD)

        return instance


class OfferGetCreatedByMixin:
    def get_created_by(self, instance):
        if not isinstance(instance, Offer):
            raise TypeError(
                f"Object of type {instance.__class__.__name__} is not of type {Offer.__name__}.")

        return {'type': instance.created_by_type.model_class().__name__,
                'pk': instance.created_by_id,
                'name': str(instance.created_by)}
