from django.views.generic import TemplateView

from .payloads import (
    build_contacts_payload,
    build_home_payload,
    build_matches_payload,
    build_media_payload,
    build_team_payload,
)


class ReactPageView(TemplateView):
    template_name = "pages/react_page.html"
    page_name = ""
    page_title = "Газпром Футбол"
    payload_builder = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        payload = self.payload_builder(self.request) if self.payload_builder else {}
        context.update(
            page_name=self.page_name,
            page_title=self.page_title,
            initial_payload=payload,
        )
        return context


class HomeView(ReactPageView):
    page_name = "home"
    page_title = "Газпром Футбол"
    payload_builder = staticmethod(build_home_payload)


class TeamView(ReactPageView):
    page_name = "team"
    page_title = "Команда | Газпром Футбол"
    payload_builder = staticmethod(build_team_payload)


class MatchListView(ReactPageView):
    page_name = "matches"
    page_title = "Матчи | Газпром Футбол"
    payload_builder = staticmethod(build_matches_payload)


class MediaView(ReactPageView):
    page_name = "media"
    page_title = "Медиа | Газпром Футбол"
    payload_builder = staticmethod(build_media_payload)


class ContactsView(ReactPageView):
    page_name = "contacts"
    page_title = "Контакты | Газпром Футбол"
    payload_builder = staticmethod(build_contacts_payload)
