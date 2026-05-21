from django.urls import path

from . import api_views, views


urlpatterns = [
    path("api/site/", api_views.SiteAPIView.as_view(), name="api-site"),
    path("api/home/", api_views.HomeAPIView.as_view(), name="api-home"),
    path("api/team/", api_views.TeamAPIView.as_view(), name="api-team"),
    path("api/matches/", api_views.MatchesAPIView.as_view(), name="api-matches"),
    path("api/media/", api_views.MediaAPIView.as_view(), name="api-media"),
    path("api/contacts/", api_views.ContactsAPIView.as_view(), name="api-contacts"),
    path("", views.HomeView.as_view(), name="home"),
    path("team/", views.TeamView.as_view(), name="team"),
    path("matches/", views.MatchListView.as_view(), name="matches"),
    path("media/", views.MediaView.as_view(), name="media"),
    path("contacts/", views.ContactsView.as_view(), name="contacts"),
]
