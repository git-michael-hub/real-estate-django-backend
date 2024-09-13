from rest_framework import generics

from .models import Inquiries
from .serializers import InquiriesListCreateSerializer, InquriesDetailEditDeleteSerializer
from .permissions import IsRecipient


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
