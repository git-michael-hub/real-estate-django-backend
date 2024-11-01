from rest_framework import pagination
from rest_framework.response import Response


class ListingPagination(pagination.PageNumberPagination):
    page_size = 2

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'pages': self.page.paginator.num_pages,
            'results': data,
            'context': self.get_html_context()
        })
