from rest_framework import serializers

from offers.serializers import OfferRetrieveSerializer

from .models import Transaction, TRANSACTION_STATUS


class TransactionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionRetrieveSerializer(serializers.ModelSerializer):
    offer = OfferRetrieveSerializer()

    class Meta:
        model = Transaction
        fields = '__all__'


class BuyerTransactionUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=TRANSACTION_STATUS.CHOICES[3:])

    class Meta:
        model = Transaction
        fields = ['status']

    def validate(self, attrs):
        transaction = self.instance

        if transaction.status != TRANSACTION_STATUS.PENDING:
            raise serializers.ValidationError(
                f"User cannot cancel a transaction with '{TRANSACTION_STATUS.get_str_name(transaction.status)}' status.")

        return attrs


class SellerTransactionUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=TRANSACTION_STATUS.CHOICES[1:])

    class Meta:
        model = Transaction
        fields = ['status']

    def validate(self, attrs):
        transaction = self.instance

        if transaction.status in (TRANSACTION_STATUS.CANCELLED, TRANSACTION_STATUS.COMPLETED):
            raise serializers.ValidationError(
                f"User cannot modify the status of a {TRANSACTION_STATUS.get_str_name(transaction.status)} transaction.")

        return attrs


class AgentTransactionUpdateSerializer(BuyerTransactionUpdateSerializer):
    class Meta(BuyerTransactionUpdateSerializer.Meta):
        fields = BuyerTransactionUpdateSerializer.Meta.fields
