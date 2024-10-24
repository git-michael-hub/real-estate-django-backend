
from rest_framework import generics, status
from rest_framework.response import Response

from users.mixins import CreateEmailValidationRequestMixin, RetrieveByUsernameMixin

from .serializers import SellerEmailValidationRequestSerializer, SellerEmailValidationSerializer, SellerAccountDetailUpdateSerializer, SellerAccountPartialDetailSerializer
from .models import SellerEmailValidationRequest, SellerApplication, SellerAccount
from .permissions import IsSellerAccountOwnerOrReadOnly


class SellerValidationView(CreateEmailValidationRequestMixin, generics.CreateAPIView):
    serializer_class = SellerEmailValidationRequestSerializer


seller_validation_view = SellerValidationView.as_view()


class SellerApplicationCreateView(generics.CreateAPIView):
    serializer_class = SellerEmailValidationSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        email_validation_request = SellerEmailValidationRequest.objects.filter(
            email=data['email'], pin_code=data['pin_code']).first()

        seller_application = SellerApplication(
            email=email_validation_request.email,
            username=email_validation_request.username,
            password=email_validation_request.password,
            first_name=email_validation_request.first_name,
            last_name=email_validation_request.last_name,
            address=email_validation_request.address,
            birthdate=email_validation_request.birthdate,
            gender=email_validation_request.gender,
            contact_number_1=email_validation_request.contact_number_1,
            contact_number_2=email_validation_request.contact_number_2,
            seller_image_url=email_validation_request.seller_image_url,
            valid_id_url=email_validation_request.valid_id_url,
        )

        seller_application.save()

        email_validation_request.delete()

        return Response({'success': ['Application sent!']}, status=status.HTTP_201_CREATED)


seller_application_view = SellerApplicationCreateView.as_view()


class SellerListView(generics.ListAPIView):
    queryset = SellerAccount.objects.all()
    serializer = SellerAccountPartialDetailSerializer

    def list(self, request):
        sellers = self.get_queryset()
        serializer = SellerAccountPartialDetailSerializer(
            sellers, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


seller_list_view = SellerListView.as_view()


class SellerDetailUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = SellerAccount
    serializer_class = SellerAccountDetailUpdateSerializer
    permission_classes = [IsSellerAccountOwnerOrReadOnly]
    lookup_field = 'username'


seller_detail_update_view = SellerDetailUpdateView.as_view()
