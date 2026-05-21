from django.http import JsonResponse
from django.views import View

from .payloads import (
    build_contacts_payload,
    build_home_payload,
    build_matches_payload,
    build_media_payload,
    build_site_payload,
    build_team_payload,
)


def api_response(payload):
    return JsonResponse(payload, json_dumps_params={"ensure_ascii": False})


class SiteAPIView(View):
    def get(self, request):
        return api_response(build_site_payload())


class HomeAPIView(View):
    def get(self, request):
        return api_response(build_home_payload(request))


class TeamAPIView(View):
    def get(self, request):
        return api_response(build_team_payload(request))


class MatchesAPIView(View):
    def get(self, request):
        return api_response(build_matches_payload(request))


class MediaAPIView(View):
    def get(self, request):
        return api_response(build_media_payload(request))


class ContactsAPIView(View):
    def get(self, request):
        return api_response(build_contacts_payload(request))
