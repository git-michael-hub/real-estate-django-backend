from rest_framework import generics, status
from rest_framework.response import Response

from django.core.mail import send_mail

from config.settings import CORS_ALLOWED_ORIGINS, EMAIL_HOST_USER

from listings.models import Listing

from .serializers import InquiriesSerializer


class MailInquiryView(generics.GenericAPIView):
    serializer_class = InquiriesSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.validated_data

        listing_id = inquiry.get('listing_id')
        if listing_id:
            listing = Listing.objects.get(pk=listing_id)
            listing_link = f"{CORS_ALLOWED_ORIGINS[0]}/listings/{listing_id}"

            send_mail(
                f"Real Estate System: You have received an inquiry from user {inquiry['sender_name']}.",
                f"""
                Sender Name: {inquiry['sender_name']} \n
                Sender Email: {inquiry['sender_email']} \n
                Sender Contact Number: {inquiry['sender_contact_number']} \n \n
                Message: {inquiry['message']} \n \n
                From listing: {listing.title} \n
                Listing Link: {listing_link}
                """,
                EMAIL_HOST_USER,
                [inquiry['agent_email']],
                fail_silently=False,
                html_message=f"""
                <div>
                    <p>Sender Name: {inquiry['sender_name']}</p>
                    <p>Sender Email: {inquiry['sender_email']}</p>
                    <p>Sender Contact Number: {inquiry['sender_contact_number']}</p>
                    <p>Message: <strong>{inquiry['message']}</strong></p>
                    <p>From listing: <a href={listing_link}>{listing.title}</a></p>
                </div>
                """,
            )
        else:
            send_mail(
                f"Real Estate System: You have received an inquiry from user {inquiry['sender_name']}.",
                f"""
                Sender Name: {inquiry['sender_name']} \n
                Sender Email: {inquiry['sender_email']} \n
                Sender Contact Number: {inquiry['sender_contact_number']} \n \n
                Message: {inquiry['message']} \n \n
                """,
                EMAIL_HOST_USER,
                [inquiry['agent_email']],
                fail_silently=False,
                html_message=f"""
                <div>
                    <p>Sender Name: {inquiry['sender_name']}</p>
                    <p>Sender Email: {inquiry['sender_email']}</p>
                    <p>Sender Contact Number: {inquiry['sender_contact_number']}</p>
                    <p>Message: <strong>{inquiry['message']}</strong></p>
                </div>
                """,
            )

        return Response({'success': ['Successfully mailed your inquiry.']}, status=status.HTTP_200_OK)


mail_inquiry_view = MailInquiryView.as_view()
