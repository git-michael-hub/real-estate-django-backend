from rest_framework import serializers

from users.mixins import CreateEmailValidationRequestSerializerMixin, ValidatePinCodeSerializerMixin

from .models import SellerEmailValidationRequest, SellerApplication, SellerAccount


class SellerEmailValidationRequestSerializer(CreateEmailValidationRequestSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SellerEmailValidationRequest
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'pin_code': {'write_only': True}
        }


class SellerEmailValidationSerializer(ValidatePinCodeSerializerMixin, serializers.Serializer):
    email = serializers.EmailField()
    pin_code = serializers.IntegerField()

    class Meta:
        model = SellerEmailValidationRequest


class SellerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = '__all__'


class SellerAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerAccount
        exclude = ['address', 'birthdate', 'gender',
                   'seller_image_url', 'valid_id_url']
        extra_kwargs = {
            'password': {'write_only': True}
        }
