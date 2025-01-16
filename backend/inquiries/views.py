from rest_framework import generics

from django.core.mail import send_mail

from config.settings import CORS_ALLOWED_ORIGINS, EMAIL_HOST_USER

from sellers.models import SellerAccount

from .models import Inquiries
from .serializers import InquiriesListCreateSerializer, InquriesDetailEditDeleteSerializer
from .permissions import IsRecipient


class SendInquiryView(generics.GenericAPIView):
    def post(self, request):
        sender_name = request.POST.get('sender_name')
        sender_contact_number = request.POST.get('sender_contact_number')
        sender_email = request.POST.get('sender_email')
        message = request.POST.get('message')
        agent_id = request.POST.get('agent_id')
        agent = SellerAccount.objects.get(id=agent_id)

        send_mail(
            f"You have received an inquiry from user {sender_name}.",
            f"""Sender Name: {sender_name} \n
            Sender Email: {sender_email} \n
            Sender Contact Number: {sender_contact_number} \n \n
            Message: ${message}
            """,
            EMAIL_HOST_USER,
            [agent.email],
            fail_silently=False,
        )


send_inquiry_view = SendInquiryView.as_view()


class InquiriesListCreateView(generics.ListCreateAPIView):
    queryset = Inquiries
    serializer_class = InquiriesListCreateSerializer
    permission_classes = [IsRecipient]

    def get_queryset(self):
        recipient_username = self.kwargs['recipient_username']
        inbox = self.queryset.objects.filter(
            recipient__username=recipient_username)
        super().get_queryset()
        return inbox


inquiries_list_create_view = InquiriesListCreateView.as_view()


class InquiriesDetailEditDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inquiries
    serializer_class = InquriesDetailEditDeleteSerializer
    permission_classes = [IsRecipient]
    lookup_field = 'id'


inquiries_detail_edit_delete_view = InquiriesDetailEditDeleteView.as_view()
