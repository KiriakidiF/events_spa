defmodule EventsServerWeb.EventView do
  use EventsServerWeb, :view
  alias EventsServerWeb.EventView
  alias EventsServerWeb.InviteView
  alias EventsServerWeb.CommentView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: event}) do

    invites = if Ecto.assoc_loaded?(event.invites) do
      render_many(event.invites, InviteView, "invite.json")
    else
      nil
    end

    comments = if Ecto.assoc_loaded?(event.comments) do
      render_many(event.comments, CommentView, "comment.json")
    else
      nil
    end

    %{id: event.id,
      name: event.name,
      date: event.date,
      desc: event.desc,
      invites: invites,
      comments: comments}
  end
end
